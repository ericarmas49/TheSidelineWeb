import { useEffect, useState } from 'react'
import { getApiClubCode } from '@/lib/clubCodes'
// @ts-expect-error — shared browser API module
import { SideLineAPI } from '@/lib/sidelineApi.js'

export type LiveArticleFeed = {
  lead: {
    img: string
    source: string
    headline: string
    body?: string
  }
  secondary: Array<{
    img?: string
    source: string
    headline: string
    body?: string
  }>
}

export type LivePodcast = {
  title: string
  show: string
  duration: string
  date: string
  thumb: string
}

export type LiveSocialTweet = {
  id: string
  html: string
  tweetUrl: string
  isProfileFallback?: boolean
}

export type LiveVideo = {
  title: string
  channel: string
  channelInitial: string
  date: string
  duration: string
  thumbnailUrl?: string | null
}

type ClubFeedState = {
  loading: boolean
  error: string | null
  articles: LiveArticleFeed | null
  podcasts: LivePodcast[]
  social: LiveSocialTweet[]
  videos: LiveVideo[]
}

const EMPTY_STATE: ClubFeedState = {
  loading: false,
  error: null,
  articles: null,
  podcasts: [],
  social: [],
  videos: [],
}

const PLACEHOLDER_THUMB =
  'https://images.unsplash.com/photo-1589903308904-1010c2294adc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=120&h=120'

function channelInitial(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '?'
}

function mapArticlesFeed(
  feed: Awaited<ReturnType<typeof SideLineAPI.fetchTopStories>>,
): LiveArticleFeed | null {
  const items = feed?.items ?? []
  if (!items.length) return null

  const [lead, ...rest] = items

  return {
    lead: {
      img: lead.imageUrl || PLACEHOLDER_THUMB,
      source: lead.publicationTag || 'Top Story',
      headline: lead.title,
      body: lead.excerpt,
    },
    secondary: rest.slice(0, 4).map((item) => ({
      img: item.imageUrl || undefined,
      source: item.publicationTag || 'Article',
      headline: item.title,
    })),
  }
}

function mapPodcastsFeed(
  feed: Awaited<ReturnType<typeof SideLineAPI.fetchPodcastsForClub>>,
): LivePodcast[] {
  return (feed?.episodes ?? []).slice(0, 4).map((episode) => ({
    title: episode.title,
    show: episode.seriesName || 'Podcast',
    duration: episode.duration || '',
    date: episode.date || '',
    thumb: episode.coverUrl || PLACEHOLDER_THUMB,
  }))
}

function mapVideosFeed(
  feed: Awaited<ReturnType<typeof SideLineAPI.fetchVideosForClub>>,
): LiveVideo[] {
  return (feed?.videos ?? []).slice(0, 6).map((video) => {
    const channel = video.channelName || 'Video'
    return {
      title: video.title,
      channel,
      channelInitial: channelInitial(channel),
      date: video.date || '',
      duration: '',
      thumbnailUrl: video.thumbnailUrl,
    }
  })
}

function mapSocialFeed(
  feed: Awaited<ReturnType<typeof SideLineAPI.fetchSocialFeedForClub>>,
): LiveSocialTweet[] {
  return (feed?.tweets ?? []).slice(0, 6).map((tweet) => ({
    id: tweet.id,
    html: tweet.html,
    tweetUrl: tweet.tweetUrl,
    isProfileFallback: tweet.isProfileFallback,
  }))
}

export function useClubFeed(figmaClubId: string, teamColor: string) {
  const [state, setState] = useState<ClubFeedState>({ ...EMPTY_STATE, loading: true })

  useEffect(() => {
    const apiCode = getApiClubCode(figmaClubId)
    if (!apiCode) {
      setState({ ...EMPTY_STATE, error: 'Club not available in live feed' })
      return
    }

    let cancelled = false

    async function loadFeed() {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const [articlesFeed, podcastsFeed, socialFeed, videosFeed] = await Promise.all([
          SideLineAPI.fetchTopStories(apiCode, { teamColor, limit: 5 }),
          SideLineAPI.fetchPodcastsForClub(apiCode, { perPage: 4 }),
          SideLineAPI.fetchSocialFeedForClub(apiCode),
          SideLineAPI.fetchVideosForClub(apiCode, { perPage: 6 }),
        ])

        if (cancelled) return

        setState({
          loading: false,
          error: null,
          articles: mapArticlesFeed(articlesFeed),
          podcasts: mapPodcastsFeed(podcastsFeed),
          social: mapSocialFeed(socialFeed),
          videos: mapVideosFeed(videosFeed),
        })
      } catch (err) {
        if (cancelled) return
        setState({
          ...EMPTY_STATE,
          error: err instanceof Error ? err.message : 'Failed to load club feed',
        })
      }
    }

    loadFeed()

    return () => {
      cancelled = true
    }
  }, [figmaClubId, teamColor])

  return state
}
