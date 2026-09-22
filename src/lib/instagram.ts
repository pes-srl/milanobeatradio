export interface InstagramMediaItem {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url?: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
  like_count?: number
  comments_count?: number
}

export interface InstagramProfile {
  id: string
  username: string
  name?: string
  profile_picture_url?: string
  biography?: string
  media_count?: number
  followers_count?: number
  follows_count?: number
}

export interface InstagramFeedData {
  profile: InstagramProfile | null
  posts: InstagramMediaItem[]
}

const DEFAULT_PROFILE: InstagramProfile = {
  id: '17841406212971353',
  username: 'milanobeatradio_mbr',
  name: 'Milano Beat Radio',
  biography:
    '📻 Web City Radio, based Milano. Un 🤝 partner che amplifica e realizza i tuoi eventi! 🎊🎉 Eventi aziendali 🎧 djset 🕵🏻home🏠parties, soft clubbing',
  followers_count: 11600,
  media_count: 299,
  follows_count: 881,
}

/**
 * Fetches latest Instagram posts and profile metrics via Meta Graph API.
 * Uses Next.js ISR cache (revalidating every 1 hour) for optimal performance,
 * zero layout shift, and protection against Meta rate limits.
 */
export async function getInstagramFeed(): Promise<InstagramFeedData> {
  const token = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID || '17841406212971353'

  if (!token) {
    return {
      profile: DEFAULT_PROFILE,
      posts: [],
    }
  }

  try {
    const [profileRes, mediaRes] = await Promise.all([
      fetch(
        `https://graph.facebook.com/v21.0/${accountId}?fields=username,name,profile_picture_url,biography,media_count,followers_count,follows_count&access_token=${token}`,
        { next: { revalidate: 3600 } }
      ).catch(() => null),
      fetch(
        `https://graph.facebook.com/v21.0/${accountId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&limit=6&access_token=${token}`,
        { next: { revalidate: 3600 } }
      ).catch(() => null),
    ])

    let profile: InstagramProfile = DEFAULT_PROFILE
    if (profileRes && profileRes.ok) {
      const data = await profileRes.json()
      profile = {
        id: data.id || accountId,
        username: data.username || DEFAULT_PROFILE.username,
        name: data.name || DEFAULT_PROFILE.name,
        profile_picture_url: data.profile_picture_url,
        biography: data.biography || DEFAULT_PROFILE.biography,
        followers_count: data.followers_count ?? DEFAULT_PROFILE.followers_count,
        media_count: data.media_count ?? DEFAULT_PROFILE.media_count,
        follows_count: data.follows_count ?? DEFAULT_PROFILE.follows_count,
      }
    }

    let posts: InstagramMediaItem[] = []
    if (mediaRes && mediaRes.ok) {
      const data = await mediaRes.json()
      if (Array.isArray(data.data)) {
        posts = data.data
      }
    }

    return { profile, posts }
  } catch (err) {
    console.error('Error fetching Instagram Graph API feed:', err)
    return {
      profile: DEFAULT_PROFILE,
      posts: [],
    }
  }
}
