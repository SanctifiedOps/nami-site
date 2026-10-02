import type { Metadata } from "next";
import { requireMemberSession } from "@/lib/network-auth/session";
import {
  contributionFormats,
  type ContributionFormat,
} from "@/lib/network-contributions/types";
import { ContributionBuilder } from "./contribution-builder";

export const metadata: Metadata = {
  title: "Write for the Network | NAMI Creative Network",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewContributionPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string }>;
}) {
  await requireMemberSession();
  const { format: requestedFormat } = await searchParams;
  const format = contributionFormats.includes(requestedFormat as ContributionFormat)
    ? (requestedFormat as ContributionFormat)
    : undefined;

  return <ContributionBuilder format={format} />;
}
