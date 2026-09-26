import { getNetworkAdminSession } from "@/lib/network-auth/session";
import { getGaSnapshot } from "@/lib/network-admin/external-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await getNetworkAdminSession();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const days = Number(new URL(request.url).searchParams.get("days"));
  if (![7, 30, 60, 90].includes(days)) {
    return Response.json({ error: "Choose a valid reporting period." }, { status: 400 });
  }

  return Response.json({ ga: await getGaSnapshot(days) }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
