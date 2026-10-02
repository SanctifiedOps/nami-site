import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Network hub preview | NAMI Creative Network",
  robots: { index: false, follow: false },
};

export default function NetworkNewsPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  redirect("/network/news");
}
