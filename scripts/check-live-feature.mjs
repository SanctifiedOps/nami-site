// Read-only live directory check. Prints the names attached to featured profile records.
const response = await fetch(`https://namicreative.co.uk/network/directory?feature-check=${Date.now()}`, {
  headers: { "Cache-Control": "no-cache" },
});
if (!response.ok) throw new Error(`Directory returned ${response.status}.`);
const html = await response.text();
const visibleMatch = html.match(/>Featured member<\/p>[\s\S]{0,1800}?<h2[^>]*>([^<]+)<\/h2>/);
const imageMatch = html.match(/<img[^>]+alt="([^"]+) profile picture"[^>]+fetchPriority="high"/);
console.log(JSON.stringify({
  visibleFeaturedMember: visibleMatch?.[1] ?? null,
  priorityImageMember: imageMatch?.[1] ?? null,
}, null, 2));
