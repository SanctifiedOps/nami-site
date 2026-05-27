// Notify IndexNow (Bing, Copilot, Yandex, et al. — not Google) that the
// site's pages have changed. Run after publishing new content:
//
//   npm run indexnow
//
// It reads the live sitemap, extracts every <loc> URL, and submits the
// batch in one request. The key file at public/<key>.txt proves we own
// the host; keep the KEY constant below in sync with that filename.

const HOST = "namicreative.co.uk";
const KEY = "a8bd7299a14f4fac8dc1348e0fafb97d";
const SITE = `https://${HOST}`;
const SITEMAP = `${SITE}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function getSitemapUrls() {
  const res = await fetch(SITEMAP, { headers: { "user-agent": "nami-indexnow" } });
  if (!res.ok) {
    throw new Error(`Sitemap fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) {
    throw new Error("No <loc> URLs found in sitemap.");
  }
  return urls;
}

async function main() {
  const urlList = await getSitemapUrls();
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList,
    }),
  });

  // IndexNow returns 200 (accepted) or 202 (accepted, pending validation).
  if (res.ok) {
    console.log(`IndexNow accepted the submission (HTTP ${res.status}).`);
  } else {
    const body = await res.text();
    throw new Error(`IndexNow rejected the submission: ${res.status} ${res.statusText}\n${body}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
