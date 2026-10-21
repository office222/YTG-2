const AUTH_KEY = "faceless-auth";

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function signIn(email: string) {
  window.localStorage.setItem(AUTH_KEY, "true");
  window.localStorage.setItem("faceless-email", email);
}

export function signOut() {
  window.localStorage.removeItem(AUTH_KEY);
  window.localStorage.removeItem("faceless-email");
}

export function getEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("faceless-email");
}
