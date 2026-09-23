import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateNetworkProfile(memberId: string, groups: Array<string | null | undefined> = [], sitemap = false) {
  revalidatePath("/network/directory");
  revalidatePath(`/network/directory/member/${memberId}`);
  for (const group of new Set(groups.filter((value): value is string => Boolean(value)))) {
    revalidatePath(`/network/directory/${group}`);
  }
  if (sitemap) revalidatePath("/sitemap.xml");
}
