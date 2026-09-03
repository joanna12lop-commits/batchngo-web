import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAuthenticatedUser } from "../../lib/auth/server";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };

export default async function AccountLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedUser("/account");
  return children;
}
