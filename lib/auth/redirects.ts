export const DEFAULT_AUTH_REDIRECT = "/dashboard";

export function safeRedirectPath(value: string | null | undefined, fallback = DEFAULT_AUTH_REDIRECT) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) {
    return fallback;
  }
  try {
    const origin = "https://batchngo.invalid";
    const parsed = new URL(value, origin);
    return parsed.origin === origin ? parsed.pathname + parsed.search + parsed.hash : fallback;
  } catch {
    return fallback;
  }
}

export function isProtectedPath(pathname: string) {
  return pathname === "/account" || pathname.startsWith("/account/") || pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/admin" || pathname.startsWith("/admin/");
}

export function loginRedirectUrl(requestUrl: string) {
  const url = new URL(requestUrl);
  const login = new URL("/login", url.origin);
  login.searchParams.set("next", safeRedirectPath(url.pathname + url.search));
  return login;
}
