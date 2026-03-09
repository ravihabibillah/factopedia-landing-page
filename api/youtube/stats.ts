import type { VercelRequest, VercelResponse } from "@vercel/node";

let cachedStats: {
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  fetchedAt: number;
} | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (cachedStats && Date.now() - cachedStats.fetchedAt < CACHE_DURATION) {
      return res.status(200).json(cachedStats);
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "YouTube API key not configured" });
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=Factopedia-ch&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch YouTube data" });
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const stats = data.items[0].statistics;
    cachedStats = {
      subscriberCount: stats.subscriberCount || "0",
      videoCount: stats.videoCount || "0",
      viewCount: stats.viewCount || "0",
      fetchedAt: Date.now(),
    };

    return res.status(200).json(cachedStats);
  } catch (err) {
    console.error("Error fetching YouTube stats:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
