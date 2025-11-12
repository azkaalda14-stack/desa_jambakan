import React from "react"

type Props = {
  urls: string[]
}

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.split("/").filter(Boolean)[0] || null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/watch")) {
        return u.searchParams.get("v")
      }
      const parts = u.pathname.split("/").filter(Boolean)
      if (parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live") {
        return parts[1] || null
      }
    }
  } catch (_) {}
  return null
}

function getTikTokId(url: string): string | null {
  try {
    const u = new URL(url)
    if (!u.hostname.includes("tiktok.com")) return null
    const parts = u.pathname.split("/").filter(Boolean)
    const idx = parts.findIndex((p) => p === "video")
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
  } catch (_) {}
  return null
}

function getInstagramEmbedPath(url: string): string | null {
  try {
    const u = new URL(url)
    if (!u.hostname.includes("instagram.com")) return null
    const parts = u.pathname.split("/").filter(Boolean)
    // Supported types: p, reel, tv
    const type = parts[0]
    const code = parts[1]
    if (code && (type === "p" || type === "reel" || type === "tv")) {
      return `/${type}/${code}/embed`
    }
  } catch (_) {}
  return null
}

function buildEmbed(url: string): { platform: "youtube" | "tiktok" | "instagram" | null; embedUrl: string | null } {
  // YouTube
  const yt = getYouTubeId(url)
  if (yt) {
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt}`,
    }
  }
  // TikTok
  const tt = getTikTokId(url)
  if (tt) {
    // TikTok embed v2
    return {
      platform: "tiktok",
      embedUrl: `https://www.tiktok.com/embed/v2/${tt}`,
    }
  }
  // Instagram
  const ig = getInstagramEmbedPath(url)
  if (ig) {
    return {
      platform: "instagram",
      embedUrl: `https://www.instagram.com${ig}`,
    }
  }
  return { platform: null, embedUrl: null }
}

export default function SocialEmbed({ urls }: Props) {
  const embeds = urls
    .map((u) => ({ url: u, ...buildEmbed(u) }))
    .filter((e) => !!e.embedUrl && !!e.platform)

  if (embeds.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-gray-600">Belum ada tautan video yang valid untuk ditampilkan.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {embeds.map((item, idx) => (
        <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 bg-white">
          <div className="aspect-video w-full">
            <iframe
              src={item.embedUrl!}
              title={`Embed ${item.platform} ${idx + 1}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="p-4 border-t">
            <p className="text-xs text-gray-600 truncate">{item.url}</p>
          </div>
        </div>
      ))}
    </div>
  )
}