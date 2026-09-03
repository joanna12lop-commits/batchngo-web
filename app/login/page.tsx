import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { safeRedirectPath } from "../../lib/auth/redirects";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import LoginForms from "./LoginForms";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string; next?: string }> }) {
  const { message, next: requestedNext } = await searchParams;
  const next = safeRedirectPath(requestedNext);
  const configured = isSupabaseConfigured();
  const callbackFailed = message === "confirmation-failed";
  return <div className="min-h-screen bg-[#F6F3EE]">
    <Header />
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-8 sm:py-20">
      <header className="mx-auto mb-10 max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">BatchNGo Account</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#111111]">Sign in or create an account</h1>
        <p className="mt-4 text-[#7C7A74]">Access your private dashboard with email and password or a secure magic link.</p>
      </header>
      {!configured ? <p role="status" className="mx-auto mb-8 max-w-xl rounded-2xl border border-[#C9826B] bg-[#F5E6E0]/30 p-4 text-sm">{process.env.NODE_ENV === "development" ? "Authentication is not configured. Add the Supabase variables listed in .env.example." : "Authentication is temporarily unavailable. Please try again later."}</p> : null}
      {callbackFailed ? <p role="alert" className="mx-auto mb-8 max-w-xl rounded-2xl border border-[#C9826B] bg-[#F5E6E0]/30 p-4 text-sm">We could not confirm that sign-in link. Request a new link and try again.</p> : null}
      <LoginForms configured={configured} next={next} />
    </main>
    <Footer />
  </div>;
}
