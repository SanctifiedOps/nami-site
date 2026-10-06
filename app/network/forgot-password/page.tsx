import { NetworkAccountShell } from "@/components/network/account-shell";
import { ForgotForm } from "./forgot-form";

export const metadata = { title: "Reset member password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <NetworkAccountShell title="Recover your account" description="Enter the email linked to your directory profile. If you have an account, we will send a reset link. If your profile still needs claiming, we will send a link to create your password."><ForgotForm /></NetworkAccountShell>;
}
