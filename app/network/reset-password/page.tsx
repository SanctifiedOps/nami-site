import { Suspense } from "react";
import { NetworkAccountShell } from "@/components/network/account-shell";
import { ResetForm } from "./reset-form";

export const metadata = { title: "Choose a new password", robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return <NetworkAccountShell title="Choose a new password" description="Create a password you can use to manage your Network profile."><Suspense><ResetForm /></Suspense></NetworkAccountShell>;
}
