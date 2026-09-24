import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getNetworkDb, schema } from "@/lib/network-db";

type AiBinding = { run(model: string, input: Record<string, unknown>): Promise<unknown> };

function cleanGeneratedBio(value: string) {
  const bio = value.trim().replace(/^['"`]+|['"`]+$/g, "").replace(/\s+/g, " ");
  const words = bio.split(/\s+/).filter(Boolean).length;
  if (words < 15 || words > 60 || bio.length > 320) throw new Error("The generated directory bio did not meet the required length.");
  return bio;
}

export async function generateDirectoryBio(applicationId: string) {
  const db = await getNetworkDb();
  const [application] = await db.select().from(schema.networkApplications)
    .where(eq(schema.networkApplications.id, applicationId)).limit(1);
  if (!application) throw new Error(`Network application ${applicationId} was not found.`);
  const { env } = await getCloudflareContext({ async: true });
  const ai = (env as unknown as { AI?: AiBinding }).AI;
  if (!ai) throw new Error("The Cloudflare AI binding is unavailable.");
  const prompt = `Write one concise third-person directory bio for NAMI Creative Network using only the supplied information. Preserve the member's meaning and do not invent credentials, clients, achievements or locations. Use clear British English. Lead with what the person or business does, then add the most useful distinguishing detail. Aim for 20 to 45 words. Return one finished bio only, with no label, quotation marks, markdown, em dash, hype, generic praise or first-person language.\n\nName: ${application.displayName}\nCategory: ${application.requestedCategory}\nLocation: ${application.location}\nInstagram: ${application.instagramUrl || ""}\nWebsite or portfolio: ${application.websiteUrl || ""}\nMember's own description:\n${application.bio}`;
  const result = await ai.run("@cf/meta/llama-3.1-8b-instruct", { prompt, max_tokens: 180, temperature: 0.2 });
  const response = typeof result === "object" && result && "response" in result ? String((result as { response: unknown }).response) : "";
  if (!response) throw new Error("Cloudflare AI returned no directory bio.");
  return cleanGeneratedBio(response);
}
