interface Commenter {
  name: string;
  linkedinUrl: string;
  headline: string;
  commentText: string;
}

export async function scrapePostCommenters(
  postUrl: string
): Promise<Commenter[]> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN not set");

  const baseUrl = "https://api.apify.com/v2";

  // Start actor run and wait for it to finish
  const runRes = await fetch(
    `${baseUrl}/acts/harvestapi~linkedin-post-comments/runs?token=${encodeURIComponent(token)}&waitForFinish=300`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ posts: [postUrl], maxItems: 0 }),
    }
  );

  if (!runRes.ok) {
    const body = await runRes.text();
    throw new Error(`Apify run failed: ${runRes.status} ${body.slice(0, 500)}`);
  }

  const run = await runRes.json();
  const datasetId = run?.data?.defaultDatasetId;
  if (!datasetId) throw new Error("No datasetId from Apify run");

  // Fetch dataset items
  const dataRes = await fetch(
    `${baseUrl}/datasets/${encodeURIComponent(datasetId)}/items?token=${encodeURIComponent(token)}&clean=true`,
    { headers: { accept: "application/json" } }
  );

  if (!dataRes.ok) {
    throw new Error(`Apify dataset fetch failed: ${dataRes.status}`);
  }

  const items = await dataRes.json();
  if (!Array.isArray(items)) return [];

  return items
    .map((item: Record<string, unknown>) => {
      const actor = item.actor as Record<string, string> | undefined;
      if (!actor?.name) return null;
      return {
        name: actor.name || "",
        linkedinUrl: actor.linkedinUrl || "",
        headline: actor.headline || "",
        commentText: (item.commentary as string) || "",
      };
    })
    .filter((c): c is Commenter => c !== null);
}
