import type { VercelRequest, VercelResponse } from "@vercel/node";

let cachedVideos: { items: any[]; fetchedAt: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (
    parseInt(match[1] || "0") * 3600 +
    parseInt(match[2] || "0") * 60 +
    parseInt(match[3] || "0")
  );
}

function formatDuration(iso: string): string {
  const total = parseDuration(iso);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (cachedVideos && Date.now() - cachedVideos.fetchedAt < CACHE_DURATION) {
      return res.status(200).json(cachedVideos.items);
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "YouTube API key not configured" });
    }

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=Factopedia-ch&fields=items/contentDetails/relatedPlaylists/uploads&key=${apiKey}`
    );
    if (!channelRes.ok) {
      return res.status(502).json({ error: "Failed to fetch channel data" });
    }
    const channelData = await channelRes.json();
    const uploadsId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) {
      return res.status(404).json({ error: "Uploads playlist not found" });
    }

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=20&fields=items(snippet(title,description,resourceId/videoId,publishedAt,thumbnails/high/url))&key=${apiKey}`
    );
    if (!playlistRes.ok) {
      return res.status(502).json({ error: "Failed to fetch playlist" });
    }
    const playlistData = await playlistRes.json();
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(",");

    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&fields=items(id,contentDetails/duration,statistics/viewCount)&key=${apiKey}`
    );
    if (!detailsRes.ok) {
      return res.status(502).json({ error: "Failed to fetch video details" });
    }
    const detailsData = await detailsRes.json();

    const detailsMap: Record<string, { duration: string; viewCount: string }> =
      {};
    for (const item of detailsData.items) {
      detailsMap[item.id] = {
        duration: item.contentDetails.duration,
        viewCount: item.statistics.viewCount || "0",
      };
    }

    const shorts = playlistData.items
      .filter((item: any) => {
        const details = detailsMap[item.snippet.resourceId.videoId];
        return details && parseDuration(details.duration) <= 60;
      })
      .slice(0, 6)
      .map((item: any) => {
        const videoId = item.snippet.resourceId.videoId;
        const details = detailsMap[videoId];
        const desc = item.snippet.description?.split("\n")[0] || "";
        const displayTitle =
          item.snippet.title === "#angst" || item.snippet.title.startsWith("#")
            ? desc.substring(0, 80)
            : item.snippet.title;

        return {
          videoId,
          title: displayTitle,
          thumbnail:
            item.snippet.thumbnails?.high?.url ||
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          duration: formatDuration(details.duration),
          viewCount: details.viewCount,
          publishedAt: item.snippet.publishedAt,
          isShort: true,
        };
      });

    cachedVideos = { items: shorts, fetchedAt: Date.now() };
    return res.status(200).json(shorts);
  } catch (err) {
    console.error("Error fetching YouTube videos:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
