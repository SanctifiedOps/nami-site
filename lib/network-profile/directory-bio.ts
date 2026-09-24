const MAX_BIO_LENGTH = 320;

export function suggestDirectoryBio(input: { displayName: string; category: string; location: string; submittedBio: string }) {
  const cleaned = input.submittedBio.replace(/\s+/g, " ").trim();
  if (cleaned.length <= MAX_BIO_LENGTH) return cleaned;

  const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()) ?? [cleaned];
  let summary = "";
  for (const sentence of sentences) {
    const next = summary ? `${summary} ${sentence}` : sentence;
    if (next.length > MAX_BIO_LENGTH) break;
    summary = next;
    if (summary.length >= 180) break;
  }
  if (summary.length >= 80) return summary;

  const prefix = `${input.displayName} is a ${input.category.toLowerCase()} based in ${input.location}. `;
  const remaining = MAX_BIO_LENGTH - prefix.length - 1;
  const excerpt = cleaned.slice(0, Math.max(0, remaining)).replace(/\s+\S*$/, "").replace(/[,:;\s]+$/, "");
  return `${prefix}${excerpt}.`;
}
