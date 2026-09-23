import { Suspense } from "react";
import { ResetForm } from "./reset-form";
export const metadata = { title: "Choose a new password", robots: { index: false, follow: false } };
export default function ResetPasswordPage() { return <section className="min-h-[75vh] px-8 py-28"><div className="mx-auto max-w-md rounded-[2rem] border border-accent/30 bg-surface-1 p-8 md:p-10"><h1 className="text-5xl">Choose a new password</h1><Suspense><ResetForm /></Suspense></div></section>; }
