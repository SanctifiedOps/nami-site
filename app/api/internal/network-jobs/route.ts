import { processNetworkJobs } from "@/lib/network-sync/process-jobs";
import { isNetworkAdminRequest } from "@/lib/network-auth/admin";
import { rotateFeaturedMember } from "@/lib/network-sync/featured-member";

export async function POST(request: Request) {
  if (!(await isNetworkAdminRequest(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const searchParams = new URL(request.url).searchParams;
  const rotate = searchParams.get("rotateFeatured") === "1";
  const requestedType = searchParams.get("jobType");
  const jobType = requestedType === "sheet" || requestedType === "email" || requestedType === "mailchimp" || requestedType === "bio" || requestedType === "owner" ? requestedType : "all";
  const requestedLimit = Number(searchParams.get("limit"));
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(25, Math.floor(requestedLimit))) : 10;
  const featured = rotate ? await rotateFeaturedMember() : null;
  return Response.json({ ...(await processNetworkJobs(limit, jobType)), featured });
}
