import { ForgotForm } from "./forgot-form";
export const metadata = { title: "Reset member password", robots: { index: false, follow: false } };
export default function ForgotPasswordPage() { return <section className="min-h-[75vh] px-8 py-28"><div className="mx-auto max-w-md rounded-[2rem] border border-accent/30 bg-surface-1 p-8 md:p-10"><p className="font-bold uppercase tracking-[0.16em] text-accent">Member account</p><h1 className="mt-4 text-5xl">Reset your password</h1><p className="mt-4 text-fg-muted">Enter the email linked to your directory profile.</p><ForgotForm /></div></section>; }
