import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Check,
  CircleCheck,
  Eye,
  Gauge,
  History,
  Lightbulb,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Undo2,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CHANNEL_SUMMARY,
  EMPTY_STATE,
  type GuardianMode,
  type GuardianState,
  HEALTH_LABEL,
  type Health,
  type HistoryEntry,
  MONITORED,
  type MonitoredVideo,
  PRIORITY_LABEL,
  type Priority,
  formatStamp,
  loadGuardian,
  newEntryId,
  publishedDemoVideos,
  saveGuardian,
} from "@/lib/guardian";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/guardian")({
  head: () => ({
    meta: [
      { title: "Channel Guardian — FACELESS" },
      {
        name: "description",
        content:
          "Monitor simulated video performance, diagnose problems, and approve repairs from one command center.",
      },
      { property: "og:title", content: "Channel Guardian — FACELESS" },
      {
        property: "og:description",
        content:
          "Monitor simulated video performance, diagnose problems, and approve repairs from one command center.",
      },
    ],
  }),
  component: GuardianPage,
});

type Filter = "all" | Health;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All Published Videos" },
  { value: "attention", label: "Needs Attention" },
  { value: "watch", label: "Watch" },
  { value: "healthy", label: "Healthy" },
];

const healthStyle: Record<Health, string> = {
  attention: "border-destructive/40 bg-destructive/10 text-destructive",
  watch: "border-gold/40 bg-gold/10 text-gold",
  healthy: "border-primary/40 bg-primary/10 text-primary",
};

const priorityStyle: Record<Priority, string> = {
  high: "border-destructive/40 bg-destructive/10 text-destructive",
  medium: "border-gold/40 bg-gold/10 text-gold",
  low: "border-border bg-muted text-muted-foreground",
};

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold break-words">{value}</div>
    </div>
  );
}

function GuardianPage() {
  const [state, setState] = useState<GuardianState>(EMPTY_STATE);
  const [filter, setFilter] = useState<Filter>("all");
  const [diagnoseId, setDiagnoseId] = useState<string | null>(null);
  const [repairId, setRepairId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftThumb, setDraftThumb] = useState("");
  const [draftHook, setDraftHook] = useState("");
  const [approved, setApproved] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmFull, setConfirmFull] = useState(false);
  const [ideaFor, setIdeaFor] = useState<string | null>(null);

  useEffect(() => {
    setState(loadGuardian());
  }, []);

  function update(next: GuardianState) {
    setState(next);
    saveGuardian(next);
  }

  const published = publishedDemoVideos();
  const titleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of published) map.set(v.id, v.title);
    return map;
  }, [published]);

  const paused = state.mode === "paused";

  function repairFor(id: string) {
    return state.repairs.find((r) => r.videoId === id);
  }

  const rows = MONITORED.filter((m) => titleById.has(m.id)).filter(
    (m) => filter === "all" || effectiveHealth(m) === filter,
  );

  function effectiveHealth(m: MonitoredVideo): Health {
    return repairFor(m.id) ? "watch" : m.health;
  }

  const needing = MONITORED.filter(
    (m) => titleById.has(m.id) && effectiveHealth(m) === "attention",
  ).length;
  const healthy = MONITORED.filter(
    (m) => titleById.has(m.id) && effectiveHealth(m) === "healthy",
  ).length;
  const counts = {
    high: MONITORED.filter((m) => m.priority === "high" && !repairFor(m.id)).length,
    medium: MONITORED.filter((m) => m.priority === "medium" && !repairFor(m.id))
      .length,
    low: MONITORED.filter((m) => m.priority === "low").length,
  };

  const diagnosed = MONITORED.find((m) => m.id === diagnoseId) ?? null;
  const repairing = MONITORED.find((m) => m.id === repairId) ?? null;
  const ideaVideo = MONITORED.find((m) => m.id === ideaFor) ?? null;

  function openRepair(m: MonitoredVideo) {
    setRepairId(m.id);
    setApproved(false);
    setDraftTitle(m.recommendedTitle ?? "");
    setDraftThumb(m.recommendedThumbnail ?? "");
    setDraftHook(m.recommendedHook ?? "");
  }

  function applyRepair(m: MonitoredVideo) {
    if (!approved || paused) return;
    const at = new Date().toISOString();
    const videoTitle = titleById.get(m.id) ?? m.currentTitleNote;
    const entry: HistoryEntry = {
      id: newEntryId(),
      at,
      videoId: m.id,
      videoTitle,
      problem: `${m.metric}: ${m.current} vs benchmark ${m.benchmark}`,
      recommendation: m.recommendation,
      approval: "Approved by you",
      action:
        m.repairKind === "hook"
          ? "Simulated new opening hook applied"
          : "Simulated new title and thumbnail concept applied",
      result: "Repair applied in simulation — nothing was changed on YouTube.",
      undoable: true,
      kind: "apply",
    };
    update({
      ...state,
      repairs: [
        ...state.repairs.filter((r) => r.videoId !== m.id),
        {
          videoId: m.id,
          kind: m.repairKind,
          title: draftTitle || undefined,
          thumbnail: draftThumb || undefined,
          hook: draftHook || undefined,
          appliedAt: at,
        },
      ],
      history: [entry, ...state.history],
    });
    setRepairId(null);
    setDiagnoseId(null);
    setNotice("Repair applied in simulation — nothing was changed on YouTube.");
  }

  function undoRepair(entry: HistoryEntry) {
    const at = new Date().toISOString();
    const undo: HistoryEntry = {
      id: newEntryId(),
      at,
      videoId: entry.videoId,
      videoTitle: entry.videoTitle,
      problem: entry.problem,
      recommendation: "Restore the previous simulated state",
      approval: "Undo requested by you",
      action: "Simulated repair reversed",
      result: "Previous simulated state restored — nothing was changed on YouTube.",
      undoable: false,
      kind: "undo",
    };
    update({
      ...state,
      repairs: state.repairs.filter((r) => r.videoId !== entry.videoId),
      history: [
        undo,
        ...state.history.map((h) =>
          h.id === entry.id ? { ...h, undoable: false, result: `${h.result} (undone)` } : h,
        ),
      ],
    });
    setNotice("Simulated repair undone — nothing was changed on YouTube.");
  }

  function setMode(mode: GuardianMode) {
    update({ ...state, mode });
    setConfirmFull(false);
    setNotice(
      mode === "paused"
        ? "Channel Guardian paused — no simulated automatic actions can occur."
        : mode === "full"
          ? "Full Automation enabled in simulation only — nothing is published and no credits are used."
          : "Approval Required is active — Guardian will ask before every simulated repair.",
    );
  }

  function createIdea(m: MonitoredVideo) {
    setIdeaFor(m.id);
    const at = new Date().toISOString();
    const entry: HistoryEntry = {
      id: newEntryId(),
      at,
      videoId: m.id,
      videoTitle: titleById.get(m.id) ?? m.currentTitleNote,
      problem: "No problem — high performer",
      recommendation: m.followUp?.title ?? "Follow-up idea",
      approval: "No approval needed",
      action: "Simulated follow-up idea created",
      result: "Idea saved to this simulation only — no video was created.",
      undoable: false,
      kind: "idea",
    };
    update({ ...state, history: [entry, ...state.history] });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          <ShieldCheck className="size-7 shrink-0 text-primary" />
          CHANNEL GUARDIAN
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor performance, diagnose problems, and approve repairs from one
          command center.
        </p>
        <p className="mt-4 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-medium text-gold">
          Simulation only — no YouTube account is connected, and no live channel
          data or videos are being changed.
        </p>
        <p className="mt-3 text-sm font-semibold tracking-wide text-primary">
          GENERATE — AND REPAIR.
        </p>
      </header>

      {notice && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
          <CircleCheck className="mt-0.5 size-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {paused && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <Pause className="mt-0.5 size-4 shrink-0" />
          <span>
            Channel Guardian paused — no simulated automatic actions can occur.
          </span>
        </div>
      )}

      {/* Channel health overview */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Gauge className="size-5 text-primary" />
          Channel Health Overview
        </h2>
        <Card>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs text-muted-foreground">
                Simulated channel health score
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {CHANNEL_SUMMARY.score}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                <AlertTriangle className="size-3.5" />
                {CHANNEL_SUMMARY.status}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <Stat
                label="Monitoring status"
                value={paused ? "Paused" : "On"}
              />
              <Stat label="Last simulated scan" value={CHANNEL_SUMMARY.lastScan} />
              <Stat label="Next simulated scan" value={CHANNEL_SUMMARY.nextScan} />
              <Stat
                label="Published videos monitored"
                value={String(rowsCount(titleById.size))}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Videos needing attention" value={String(needing)} />
            <Stat label="Healthy videos" value={String(healthy)} />
            <Stat label="High-priority alerts" value={String(counts.high)} />
            <Stat label="Medium-priority alerts" value={String(counts.medium)} />
            <Stat label="Low-priority alerts" value={String(counts.low)} />
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Simulated summary metrics — simulated data, not live channel data
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Views (simulated)" value={CHANNEL_SUMMARY.views} />
              <Stat label="Click-through rate (simulated)" value={CHANNEL_SUMMARY.ctr} />
              <Stat
                label="Avg. retention (simulated)"
                value={CHANNEL_SUMMARY.retention}
              />
              <Stat label="Watch time (simulated)" value={CHANNEL_SUMMARY.watchTime} />
              <Stat label="Engagement (simulated)" value={CHANNEL_SUMMARY.engagement} />
              <Stat
                label="Subscriber change (simulated)"
                value={CHANNEL_SUMMARY.subscriberChange}
              />
            </div>
          </div>
        </Card>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Only published videos are monitored. Drafts, videos marked Ready,
          scheduled videos, and private videos created in Video Studio are
          excluded, because Channel Guardian begins monitoring a video only after
          it has been published.
        </p>
      </section>

      {/* Monitoring */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Activity className="size-5 text-primary" />
          Alerts and Video Monitoring
        </h2>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                filter === f.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {rows.map((m) => {
            const repaired = repairFor(m.id);
            const health = effectiveHealth(m);
            return (
              <Card key={m.id}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold">
                      Published
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        healthStyle[health],
                      )}
                    >
                      {HEALTH_LABEL[health]}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        priorityStyle[m.priority],
                      )}
                    >
                      {PRIORITY_LABEL[m.priority]}
                    </span>
                    {repaired && (
                      <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        Simulated repair applied
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold break-words">
                    {repaired?.title ?? titleById.get(m.id)}
                  </h3>
                  {repaired?.title && (
                    <p className="text-xs text-muted-foreground break-words">
                      Simulated replacement title. The saved video record was not
                      changed.
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    <Stat label="Views (simulated)" value={m.metrics.views} />
                    <Stat label="Click-through (simulated)" value={m.metrics.ctr} />
                    <Stat label="Retention (simulated)" value={m.metrics.retention} />
                    <Stat label="Watch time (simulated)" value={m.metrics.watchTime} />
                    <Stat label="Engagement (simulated)" value={m.metrics.engagement} />
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {m.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setDiagnoseId(diagnoseId === m.id ? null : m.id)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      <Stethoscope className="size-4" />
                      {diagnoseId === m.id ? "Hide diagnosis" : "Diagnose"}
                    </button>
                    {m.repairKind === "follow-up" && (
                      <button
                        onClick={() => createIdea(m)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gold/50 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/20"
                      >
                        <Lightbulb className="size-4" />
                        Create Follow-Up Idea
                      </button>
                    )}
                  </div>

                  {ideaVideo?.id === m.id && m.followUp && (
                    <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-gold">
                        <Sparkles className="size-4" />
                        Simulated follow-up idea
                      </div>
                      <p className="break-words">
                        <span className="text-muted-foreground">Title: </span>
                        {m.followUp.title}
                      </p>
                      <p className="mt-1 break-words">
                        <span className="text-muted-foreground">Hook: </span>
                        {m.followUp.hook}
                      </p>
                      <p className="mt-1 break-words">
                        <span className="text-muted-foreground">Concept: </span>
                        {m.followUp.concept}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Idea only — no video was created and Video Studio was not
                        started.
                      </p>
                    </div>
                  )}

                  {/* Diagnosis */}
                  {diagnosed?.id === m.id && (
                    <div className="rounded-lg border border-border bg-background/40 p-4">
                      <h4 className="mb-3 text-sm font-semibold">
                        Diagnosis details (simulated)
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Stat label="Metric causing concern" value={m.metric} />
                        <Stat label="Current simulated result" value={m.current} />
                        <Stat label="Simulated benchmark" value={m.benchmark} />
                        <Stat label="Difference from benchmark" value={m.difference} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed">{m.diagnosis}</p>
                      <p className="mt-2 text-xs font-semibold text-primary">
                        {m.confidence}
                      </p>
                      <div className="mt-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Likely cause
                        </div>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                          {m.cause.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="mt-3 text-sm">
                        <span className="font-semibold">Recommended repair: </span>
                        {m.recommendation}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {m.estimatedEffect}
                      </p>
                      {m.repairKind !== "follow-up" && (
                        <button
                          onClick={() => openRepair(m)}
                          disabled={paused}
                          title={
                            paused
                              ? "Channel Guardian is paused — resume monitoring to review repairs."
                              : undefined
                          }
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Wrench className="size-4" />
                          Review Repair
                        </button>
                      )}
                    </div>
                  )}

                  {/* Repair review */}
                  {repairing?.id === m.id && (
                    <div className="rounded-lg border border-primary/40 bg-primary/5 p-4">
                      <h4 className="mb-3 text-sm font-semibold text-primary">
                        Repair review — simulated comparison
                      </h4>

                      {m.recommendedTitle !== undefined && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg border border-border bg-background/50 p-3">
                            <div className="text-xs text-muted-foreground">
                              Current title
                            </div>
                            <p className="mt-1 text-sm break-words">
                              {titleById.get(m.id)}
                            </p>
                          </div>
                          <div className="rounded-lg border border-primary/40 bg-background/50 p-3">
                            <label className="text-xs text-primary" htmlFor={`t-${m.id}`}>
                              Recommended title (editable)
                            </label>
                            <textarea
                              id={`t-${m.id}`}
                              value={draftTitle}
                              onChange={(e) => setDraftTitle(e.target.value)}
                              rows={2}
                              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      )}

                      {m.recommendedThumbnail !== undefined && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg border border-border bg-background/50 p-3">
                            <div className="text-xs text-muted-foreground">
                              Current thumbnail concept
                            </div>
                            <p className="mt-1 text-sm break-words">
                              {m.currentThumbnail}
                            </p>
                          </div>
                          <div className="rounded-lg border border-primary/40 bg-background/50 p-3">
                            <label className="text-xs text-primary" htmlFor={`th-${m.id}`}>
                              Recommended thumbnail concept (editable)
                            </label>
                            <textarea
                              id={`th-${m.id}`}
                              value={draftThumb}
                              onChange={(e) => setDraftThumb(e.target.value)}
                              rows={3}
                              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      )}

                      {m.recommendedHook !== undefined && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg border border-border bg-background/50 p-3">
                            <div className="text-xs text-muted-foreground">
                              Current opening hook
                            </div>
                            <p className="mt-1 text-sm break-words">{m.currentHook}</p>
                          </div>
                          <div className="rounded-lg border border-primary/40 bg-background/50 p-3">
                            <label className="text-xs text-primary" htmlFor={`h-${m.id}`}>
                              Recommended opening hook (editable)
                            </label>
                            <textarea
                              id={`h-${m.id}`}
                              value={draftHook}
                              onChange={(e) => setDraftHook(e.target.value)}
                              rows={3}
                              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      )}

                      <p className="mt-3 text-sm">
                        <span className="font-semibold">Why this is recommended: </span>
                        {m.recommendation}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {m.estimatedEffect}
                      </p>

                      <label className="mt-4 flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={approved}
                          onChange={(e) => setApproved(e.target.checked)}
                          className="mt-0.5 size-4 accent-[var(--primary)]"
                        />
                        <span>I approve this simulated repair.</span>
                      </label>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => applyRepair(m)}
                          disabled={!approved || paused}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Check className="size-4" />
                          Apply Simulated Repair
                        </button>
                        <button
                          onClick={() => setRepairId(null)}
                          className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                      {!approved && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Tick the approval box to enable Apply Simulated Repair.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
          {rows.length === 0 && (
            <Card>
              <p className="text-sm text-muted-foreground">
                No published videos match this filter.
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Controls */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Eye className="size-5 text-primary" />
          Channel Guardian Controls
        </h2>
        <Card className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => setMode("approval")}
              className={cn(
                "rounded-lg border p-4 text-left text-sm transition-colors",
                state.mode === "approval"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div className="font-semibold">Approval Required</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Default and recommended. Guardian asks before every simulated
                repair.
              </div>
            </button>
            <button
              onClick={() =>
                state.mode === "full" ? setMode("approval") : setConfirmFull(true)
              }
              className={cn(
                "rounded-lg border p-4 text-left text-sm transition-colors",
                state.mode === "full"
                  ? "border-gold bg-gold/10"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div className="font-semibold">Full Automation</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Simulation only. Never publishes, never spends credits, never
                makes an external change, and never bypasses prohibited-topic or
                safety safeguards.
              </div>
            </button>
            <button
              onClick={() => (paused ? setMode("approval") : setMode("paused"))}
              className={cn(
                "rounded-lg border p-4 text-left text-sm transition-colors",
                paused
                  ? "border-destructive bg-destructive/10"
                  : "border-border hover:border-destructive/40",
              )}
            >
              <div className="flex items-center gap-2 font-semibold">
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
                {paused ? "Resume Monitoring" : "Emergency Pause"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {paused
                  ? "Turn simulated monitoring back on with Approval Required."
                  : "Immediately stop all simulated automatic actions."}
              </div>
            </button>
          </div>

          {confirmFull && (
            <div className="rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm">
              <p className="font-semibold text-gold">
                Enable simulated Full Automation?
              </p>
              <p className="mt-1 text-muted-foreground">
                Guardian would apply its recommended repairs without asking each
                time. Even in this mode nothing is published, no credits are
                spent, no external change is made, and safety safeguards always
                apply.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setMode("full")}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Yes, enable Full Automation
                </button>
                <button
                  onClick={() => setConfirmFull(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Channel safety */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ShieldCheck className="size-5 text-primary" />
          Channel Safety
        </h2>
        <Card>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Copyright-risk monitoring",
              "Policy-risk monitoring",
              "Strike monitoring",
              "Demonetization-risk monitoring",
            ].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-border bg-background/40 p-3"
              >
                <div className="text-sm font-medium">{label}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Not available
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No live safety data is available. Connect a YouTube channel in a
            future release to enable real monitoring.
          </p>
        </Card>
      </section>

      {/* Action history */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <History className="size-5 text-primary" />
          Action History
        </h2>
        {state.history.length === 0 ? (
          <Card>
            <p className="text-sm text-muted-foreground">
              No simulated actions yet. Choose Diagnose on a monitored video,
              review the recommended repair, then approve it — every approved
              action appears here with the option to undo it.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {state.history.map((h) => (
              <Card key={h.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatStamp(h.at)}
                  </span>
                  <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {h.kind === "undo"
                      ? "Undo"
                      : h.kind === "idea"
                        ? "Idea"
                        : "Repair"}
                  </span>
                </div>
                <div className="text-sm font-semibold break-words">
                  {h.videoTitle}
                </div>
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Problem detected
                    </dt>
                    <dd className="break-words">{h.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Recommendation</dt>
                    <dd className="break-words">{h.recommendation}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Approval status</dt>
                    <dd className="break-words">{h.approval}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Simulated action taken
                    </dt>
                    <dd className="break-words">{h.action}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted-foreground">Result</dt>
                    <dd className="break-words">{h.result}</dd>
                  </div>
                </dl>
                {h.undoable ? (
                  <button
                    onClick={() => undoRepair(h)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Undo2 className="size-4" />
                    Undo Simulated Repair
                  </button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Undo not available for this entry.
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/** Number of published demo videos Guardian is monitoring. */
function rowsCount(n: number): number {
  return n;
}
