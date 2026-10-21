import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  BookmarkCheck,
  Check,
  ChevronDown,
  Clock,
  Coins,
  Compass,
  GitCompareArrows,
  Lightbulb,
  ListChecks,
  RefreshCcw,
  Rocket,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  analyzeNiche,
  AUDIENCES,
  BUDGET_OPTIONS,
  EXPERIENCE_LEVELS,
  FORMATS,
  FREQUENCIES,
  GOALS,
  LIFESPAN_OPTIONS,
  NICHES,
  RATING_PCT,
  TIME_OPTIONS,
  type NicheInput,
  type NicheReport,
  type Rating,
} from "@/lib/niche";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/research")({
  head: () => ({
    meta: [
      { title: "Niche Research — FACELESS" },
      {
        name: "description",
        content:
          "Check your YouTube niche idea with FACELESS. Simulated demo analysis of demand, competition, and monetization.",
      },
    ],
  }),
  component: NicheResearchPage,
});

const EMPTY_FORM: NicheInput = {
  niche: "",
  customNiche: "",
  audiences: [],
  formats: [],
  frequency: "",
  goal: "",
  experience: "",
  time: "",
  budget: "",
  lifespan: "",
};

type Errors = Partial<Record<keyof NicheInput, string>>;

function validate(f: NicheInput): Errors {
  const e: Errors = {};
  if (!f.niche) e.niche = "Please choose a niche.";
  else if (f.niche === "Other" && !f.customNiche.trim())
    e.customNiche = "Please describe your niche.";
  if (f.audiences.length === 0) e.audiences = "Select at least one audience.";
  if (f.formats.length === 0) e.formats = "Select at least one format.";
  if (!f.frequency) e.frequency = "Please choose a publishing frequency.";
  if (!f.goal) e.goal = "Please choose your primary goal.";
  if (!f.experience) e.experience = "Please choose your experience level.";
  if (!f.time) e.time = "Please choose your available time.";
  if (!f.budget) e.budget = "Please choose your budget.";
  if (!f.lifespan) e.lifespan = "Please choose a content lifespan preference.";
  return e;
}

function NicheResearchPage() {
  const [form, setForm] = useState<NicheInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [report, setReport] = useState<NicheReport | null>(null);
  const [saved, setSaved] = useState(false);
  const [chosen, setChosen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof NicheInput>(key: K, value: NicheInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleMulti = (key: "audiences" | "formats", value: string) => {
    setForm((f) => {
      const list = f[key];
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...f, [key]: next };
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = () => {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setReport(analyzeNiche(form));
    setSaved(false);
    setChosen(false);
    setTimeout(
      () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setReport(null);
    setSaved(false);
    setChosen(false);
    setTimeout(
      () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  };

  return (
    <div ref={topRef} className="space-y-8">
      <header>
        <p className="text-xs font-semibold tracking-widest text-primary">
          NICHE RESEARCH
        </p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
          Check My Niche
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Answer a few quick questions — mostly tapping, no typing — and get a
          Niche Opportunity Report.{" "}
          <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-gold">
            DEMO DATA
          </span>{" "}
          Results are simulated for this prototype; no real YouTube or AI data
          is used.
        </p>
      </header>

      {chosen && report ? (
        <ChosenScreen report={report} onCompare={resetForm} />
      ) : report ? (
        <ReportView
          report={report}
          saved={saved}
          onSave={() => setSaved(true)}
          onCompare={resetForm}
          onChoose={() => {
            setChosen(true);
            setTimeout(
              () =>
                topRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                }),
              50
            );
          }}
        />
      ) : (
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            submit();
          }}
          className="space-y-8"
          noValidate
        >
          {/* 1. Niche */}
          <Section
            step={1}
            icon={Compass}
            title="Proposed YouTube Niche"
            hint="Pick the topic you're thinking about."
            error={errors.niche ?? errors.customNiche}
          >
            <NicheCombobox
              value={form.niche}
              onChange={(v) => set("niche", v)}
              invalid={!!errors.niche}
            />
            {form.niche === "Other" && (
              <div className="mt-3">
                <label
                  htmlFor="custom-niche"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Describe Your Niche
                </label>
                <input
                  id="custom-niche"
                  type="text"
                  value={form.customNiche}
                  onChange={(ev) => set("customNiche", ev.target.value)}
                  placeholder="e.g. Restoring old woodworking tools"
                  className={cn(
                    "w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring",
                    errors.customNiche ? "border-destructive" : "border-input"
                  )}
                />
              </div>
            )}
          </Section>

          {/* 2. Audience */}
          <Section
            step={2}
            icon={Users}
            title="Target Audience"
            hint="Who do you want to watch your videos? You can pick more than one."
            error={errors.audiences}
          >
            <CardGrid
              options={AUDIENCES}
              selected={form.audiences}
              onToggle={(v) => toggleMulti("audiences", v)}
              multi
            />
          </Section>

          {/* 3. Formats */}
          <Section
            step={3}
            icon={Video}
            title="Preferred Video Format"
            hint="What style of videos would you like to make? Pick any that appeal."
            error={errors.formats}
          >
            <CardGrid
              options={FORMATS}
              selected={form.formats}
              onToggle={(v) => toggleMulti("formats", v)}
              multi
            />
          </Section>

          {/* 4. Frequency */}
          <Section
            step={4}
            icon={Clock}
            title="Intended Publishing Frequency"
            hint="How often do you plan to upload?"
            error={errors.frequency}
          >
            <Dropdown
              value={form.frequency}
              options={FREQUENCIES}
              placeholder="Choose a schedule"
              onChange={(v) => set("frequency", v)}
              invalid={!!errors.frequency}
              ariaLabel="Intended publishing frequency"
            />
          </Section>

          {/* 5. Goal */}
          <Section
            step={5}
            icon={Target}
            title="Primary Goal"
            hint="What's the main thing you want from this channel?"
            error={errors.goal}
          >
            <CardGrid
              options={GOALS}
              selected={form.goal ? [form.goal] : []}
              onToggle={(v) => set("goal", v)}
            />
          </Section>

          {/* 6. Experience */}
          <Section
            step={6}
            icon={Sparkles}
            title="Experience Level"
            hint="Be honest — this shapes the advice you get."
            error={errors.experience}
          >
            <CardGrid
              options={EXPERIENCE_LEVELS}
              selected={form.experience ? [form.experience] : []}
              onToggle={(v) => set("experience", v)}
            />
          </Section>

          {/* 7. Time */}
          <Section
            step={7}
            icon={Clock}
            title="Available Production Time"
            hint="How much time can you realistically spend each week?"
            error={errors.time}
          >
            <Dropdown
              value={form.time}
              options={TIME_OPTIONS}
              placeholder="Choose your available time"
              onChange={(v) => set("time", v)}
              invalid={!!errors.time}
              ariaLabel="Available production time"
            />
          </Section>

          {/* 8. Budget */}
          <Section
            step={8}
            icon={Coins}
            title="Approximate Monthly Budget"
            hint="What can you spend on tools, footage, or help each month?"
            error={errors.budget}
          >
            <Dropdown
              value={form.budget}
              options={BUDGET_OPTIONS}
              placeholder="Choose a budget range"
              onChange={(v) => set("budget", v)}
              invalid={!!errors.budget}
              ariaLabel="Approximate monthly budget"
            />
          </Section>

          {/* 9. Lifespan */}
          <Section
            step={9}
            icon={TrendingUp}
            title="Content Lifespan Preference"
            hint="Should your videos stay useful for years, or chase current trends?"
            error={errors.lifespan}
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LIFESPAN_OPTIONS.map((o) => {
                const active = form.lifespan === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => set("lifespan", o.value)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/15"
                        : "border-border bg-card hover:border-primary/50 hover:bg-accent"
                    )}
                  >
                    <span className="flex items-center justify-between text-sm font-medium">
                      {o.value}
                      {active && <Check className="size-4 text-primary" />}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {o.blurb}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {Object.keys(errors).length > 0 && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive-foreground"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
              Please answer the highlighted questions above, then analyze again.
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 sm:w-auto sm:px-12"
          >
            Analyze My Niche
          </button>
        </form>
      )}
    </div>
  );
}

/* ---------- Form building blocks ---------- */

function Section({
  step,
  icon: Icon,
  title,
  hint,
  error,
  children,
}: {
  step: number;
  icon: typeof Compass;
  title: string;
  hint: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-card/60 p-4 sm:p-6",
        error ? "border-destructive/60" : "border-border"
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="size-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold sm:text-lg">
            <span className="mr-2 text-muted-foreground">{step}.</span>
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {hint}
          </p>
        </div>
      </div>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}

function CardGrid({
  options,
  selected,
  onToggle,
  multi = false,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (v: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            role={multi ? "checkbox" : "radio"}
            aria-checked={active}
            onClick={() => onToggle(opt)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary/15 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground"
            )}
          >
            {opt}
            {active && <Check className="size-4 shrink-0 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}

function Dropdown({
  value,
  options,
  placeholder,
  onChange,
  invalid,
  ariaLabel,
}: {
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        className={cn(
          "w-full appearance-none rounded-lg border bg-card px-3 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring",
          invalid ? "border-destructive" : "border-input",
          value ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function NicheCombobox({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      NICHES.filter((n) => n.toLowerCase().includes(query.trim().toLowerCase())),
    [query]
  );
  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-card px-3 focus-within:ring-2 focus-within:ring-ring",
          invalid ? "border-destructive" : "border-input"
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-label="Proposed YouTube niche"
          value={open ? query : value}
          placeholder="Search or choose a niche…"
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(ev) => setQuery(ev.target.value)}
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </div>
      {open && (
        <ul
          role="listbox"
          aria-label="Niche options"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-xl"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No matches — try "Other".
            </li>
          )}
          {filtered.map((n) => (
            <li key={n}>
              <button
                type="button"
                role="option"
                aria-selected={value === n}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  onChange(n);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                  value === n && "bg-primary/15 text-foreground"
                )}
              >
                {n}
                {value === n && <Check className="size-4 text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Report ---------- */

const RATING_BAR: Record<Rating, string> = {
  Low: "bg-destructive/70",
  Moderate: "bg-gold",
  High: "bg-primary",
  "Very High": "bg-primary",
};

function RatingCard({
  label,
  rating,
  note,
  invertGood = false,
}: {
  label: string;
  rating: Rating;
  note: string;
  invertGood?: boolean;
}) {
  const bar = invertGood
    ? ({ Low: "bg-primary", Moderate: "bg-gold", High: "bg-gold", "Very High": "bg-destructive/70" } as Record<Rating, string>)[rating]
    : RATING_BAR[rating];
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">{label}</h3>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
            rating === "Low" && "bg-destructive/15 text-destructive",
            rating === "Moderate" && "bg-gold/15 text-gold",
            rating === "High" && "bg-primary/15 text-primary",
            rating === "Very High" && "bg-primary/25 text-primary"
          )}
        >
          {rating}
        </span>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={RATING_PCT[rating]}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full", bar)}
          style={{ width: `${RATING_PCT[rating]}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {note}
      </p>
    </div>
  );
}

function ReportView({
  report,
  saved,
  onSave,
  onCompare,
  onChoose,
}: {
  report: NicheReport;
  saved: boolean;
  onSave: () => void;
  onCompare: () => void;
  onChoose: () => void;
}) {
  const conclusionStyle =
    report.conclusion === "Strong Opportunity"
      ? "border-primary/60 bg-primary/10"
      : report.conclusion === "Promising With Adjustments"
        ? "border-gold/60 bg-gold/10"
        : "border-destructive/60 bg-destructive/10";

  return (
    <div className="space-y-6">
      {/* Score + conclusion */}
      <section className="rounded-xl border border-border bg-card/60 p-5 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col items-center justify-center rounded-xl border border-primary/40 bg-primary/10 px-6 py-5">
            <span className="text-4xl font-bold text-primary sm:text-5xl">
              {report.score}
            </span>
            <span className="mt-1 text-xs font-medium tracking-wide text-muted-foreground">
              OPPORTUNITY SCORE / 100
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold sm:text-xl">
              Niche Opportunity Report: {report.nicheLabel}
            </h2>
            <div
              className={cn(
                "mt-3 rounded-lg border p-3 text-sm font-semibold",
                conclusionStyle
              )}
            >
              {report.conclusion}
              <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
                {report.conclusionNote}
              </p>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Simulated demonstration results — not real YouTube data.
            </p>
          </div>
        </div>
      </section>

      {/* Ratings grid */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <RatingCard label="Audience Demand" rating={report.demand} note="How many people are searching for and watching this topic." />
        <RatingCard label="Competition Level" rating={report.competition} note="How crowded this niche already is. Higher means harder to stand out." invertGood />
        <RatingCard label="Monetization Potential" rating={report.monetization} note="How well channels like this typically earn from ads, sponsors, and offers." />
        <RatingCard label="Content Longevity" rating={report.longevity} note="How long each video is likely to keep attracting viewers." />
        <RatingCard label="Production Difficulty" rating={report.difficulty} note="How hard your chosen formats are to produce with your experience and budget." invertGood />
        <RatingCard label="Evergreen Potential" rating={report.evergreenPotential} note="How well this strategy suits videos that stay useful for years." />
        <RatingCard label="Dependence on Trends" rating={report.trendDependence} note="How much this approach relies on current events and fresh topics." invertGood />
      </section>

      {/* Plan facts */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Fact icon={Clock} label="Recommended Publishing Frequency" value={report.recommendedFrequency} />
        <Fact icon={TrendingUp} label="Estimated Time to Gain Traction" value={report.timeToTraction} />
        <Fact icon={BarChart3} label="Expected Useful Life of Each Video" value={report.videoLifespan} />
        <Fact icon={RefreshCcw} label="Refreshing Older Content" value={report.refreshNote} />
      </section>

      {/* Opportunities & risks */}
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="size-4 text-gold" /> Three Content Opportunities
          </h3>
          <ul className="mt-3 space-y-2.5">
            {report.opportunities.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {o}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="size-4 text-gold" /> Three Potential Risks
          </h3>
          <ul className="mt-3 space-y-2.5">
            {report.risks.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recommendation */}
      <section className="rounded-xl border border-primary/40 bg-primary/5 p-5 sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Rocket className="size-4 text-primary" /> Our Recommendation
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {report.recommendation}
        </p>
      </section>

      {saved && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-primary/50 bg-primary/10 p-3 text-sm font-medium text-primary"
        >
          <BookmarkCheck className="size-4" />
          Saved! "{report.nicheLabel}" has been added to your niches (demo).
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onSave}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
        >
          <BookmarkCheck className="size-4" /> Save This Niche
        </button>
        <button
          type="button"
          onClick={onCompare}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
        >
          <GitCompareArrows className="size-4" /> Compare Another Niche
        </button>
        <button
          type="button"
          onClick={onChoose}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ListChecks className="size-4" /> Choose This Niche
        </button>
      </div>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

function ChosenScreen({
  report,
  onCompare,
}: {
  report: NicheReport;
  onCompare: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-primary/50 bg-primary/5 p-8 text-center sm:p-12">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check className="size-7" />
      </span>
      <h2 className="mt-4 text-xl font-semibold sm:text-2xl">
        Niche Selected: {report.nicheLabel}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Great choice — this niche has been selected for your channel (demo).
        Next steps like video planning and publishing will unlock here as
        FACELESS grows.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link
          to="/app"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to Dashboard
        </Link>
        <button
          type="button"
          onClick={onCompare}
          className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
        >
          Compare Another Niche
        </button>
      </div>
    </div>
  );
}
