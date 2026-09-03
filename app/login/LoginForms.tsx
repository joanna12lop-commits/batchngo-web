"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { sendMagicLink, signInWithPassword, signUp } from "./actions";
import { initialAuthState } from "./shared";

type Mode = "login" | "signup";

function SubmitButton({
  children,
  configured,
}: {
  children: React.ReactNode;
  configured: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={!configured || pending}
      className="w-full rounded-full bg-[#7C8A6A] px-6 py-3 font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

function Status({ state }: { state: typeof initialAuthState }) {
  if (
    state.status === "idle" ||
    !state.message ||
    String(state.message).trim() === ""
  )
    return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`rounded-2xl border p-4 text-sm ${state.status === "error" ? "border-[#C9826B] bg-[#F5E6E0]/30" : "border-[#7C8A6A] bg-[#EEF1E8]"}`}
    >
      {state.message}
    </p>
  );
}

export default function LoginForms({
  configured,
  next,
}: {
  configured: boolean;
  next: string;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [loginState, loginAction] = useActionState(
    signInWithPassword,
    initialAuthState,
  );
  const [signupState, signupAction] = useActionState(signUp, initialAuthState);
  const [magicState, magicAction] = useActionState(
    sendMagicLink,
    initialAuthState,
  );
  const input =
    "mt-2 h-12 w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/70 px-4 outline-none focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10";

  return (
    <section className="mx-auto max-w-xl rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8">
      <div
        role="tablist"
        aria-label="Account access"
        className="grid grid-cols-2 rounded-full bg-[#F6F3EE] p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          onClick={() => setMode("login")}
          className={`rounded-full px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A] ${mode === "login" ? "bg-white shadow-sm" : "text-[#7C7A74]"}`}
        >
          Log in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          onClick={() => setMode("signup")}
          className={`rounded-full px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A] ${mode === "signup" ? "bg-white shadow-sm" : "text-[#7C7A74]"}`}
        >
          Create account
        </button>
      </div>
      {mode === "login" ? (
        <div className="mt-7 space-y-6">
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <Status state={loginState} />
            <label
              className="block text-sm font-semibold"
              htmlFor="login-email"
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={input}
            />
            <label
              className="block text-sm font-semibold"
              htmlFor="login-password"
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={input}
            />
            <SubmitButton configured={configured}>Log in</SubmitButton>
          </form>
          <form
            action={magicAction}
            className="space-y-4 border-t border-[#E5E0D8] pt-6"
          >
            <input type="hidden" name="next" value={next} />
            <Status state={magicState} />
            <label
              className="block text-sm font-semibold"
              htmlFor="magic-email"
            >
              Email for a magic link
            </label>
            <input
              id="magic-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={input}
            />
            <SubmitButton configured={configured}>
              Email me a sign-in link
            </SubmitButton>
          </form>
        </div>
      ) : (
        <form action={signupAction} className="mt-7 space-y-4">
          <input type="hidden" name="next" value={next} />
          <Status state={signupState} />
          <label className="block text-sm font-semibold" htmlFor="account-type">
            Account type
          </label>
          <select id="account-type" name="accountType" className={input}>
            <option value="customer">Customer</option>
            <option value="manufacturer">Manufacturer</option>
          </select>
          <label className="block text-sm font-semibold" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={input}
          />
          <label
            className="block text-sm font-semibold"
            htmlFor="signup-password"
          >
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            aria-describedby="password-help"
            className={input}
          />
          <p id="password-help" className="text-xs text-[#7C7A74]">
            Use at least 8 characters.
          </p>
          <SubmitButton configured={configured}>Create account</SubmitButton>
        </form>
      )}
    </section>
  );
}
