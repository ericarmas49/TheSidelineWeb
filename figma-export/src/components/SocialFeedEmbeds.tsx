import { useMemo, useState, type MouseEvent } from 'react'
import type { LiveSocialTweet } from '@/hooks/useClubFeed'

function XBrandIcon() {
  return (
    <svg className="sl-feed-social-x-icon" width="15" height="15" viewBox="0 0 24 24" fill="#1d9bf0" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function tweetHandle(tweet: LiveSocialTweet) {
  if (tweet.username) return `@${tweet.username}`
  const match = tweet.tweetUrl.match(/(?:twitter|x)\.com\/([^/?#]+)/i)
  const username = match?.[1]
  if (username && username !== 'i') return `@${username}`
  return '@x'
}

function tweetBody(tweet: LiveSocialTweet) {
  if (tweet.text?.trim()) return tweet.text.trim()
  if (tweet.isProfileFallback && tweet.displayName) {
    return `Follow ${tweet.displayName} for the latest updates.`
  }
  return ''
}

function accountAvatarFallback(tweet: LiveSocialTweet) {
  if (tweet.accountEmoji) return tweet.accountEmoji
  const initial = tweet.displayName?.replace(/^[^\p{L}\p{N}]+/u, '').trim()?.[0]
  if (initial) return initial.toUpperCase()
  const handle = tweet.username?.[0]
  if (handle) return handle.toUpperCase()
  return '𝕏'
}

function SocialAccountAvatar({ tweet }: { tweet: LiveSocialTweet }) {
  const [attempt, setAttempt] = useState(0)
  const fallback = accountAvatarFallback(tweet)
  const username = tweet.username?.replace(/^@/, '').trim()

  const avatarSources = useMemo(() => {
    const sources = [tweet.avatarUrl?.trim()]
    if (username) {
      sources.push(`https://unavatar.io/x/${encodeURIComponent(username)}`)
    }
    return sources.filter(Boolean) as string[]
  }, [tweet.avatarUrl, username])

  const avatarUrl = avatarSources[attempt]

  if (avatarUrl) {
    return (
      <img
        className="sl-feed-social-avatar"
        src={avatarUrl}
        alt=""
        width={22}
        height={22}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setAttempt((value) => value + 1)}
      />
    )
  }

  return (
    <span className="sl-feed-social-avatar sl-feed-social-avatar--emoji" aria-hidden="true">
      {fallback}
    </span>
  )
}

function SocialFeedCard({
  tweet,
  onItemClick,
}: {
  tweet: LiveSocialTweet
  onItemClick: (event: MouseEvent) => void
}) {
  const body = tweetBody(tweet)

  return (
    <button
      type="button"
      id={`sl-feed-social-${tweet.id}`}
      className="sl-feed-social-card sl-feed-clickable"
      onClick={onItemClick}
    >
      <div className="sl-feed-social-card-header">
        <SocialAccountAvatar tweet={tweet} />
        <XBrandIcon />
        <span className="sl-feed-social-handle">{tweetHandle(tweet)}</span>
      </div>
      {body ? <p className="sl-feed-social-text">{body}</p> : null}
    </button>
  )
}

export function SocialFeedEmbeds({
  tweets,
  onItemClick,
}: {
  tweets: LiveSocialTweet[]
  onItemClick: (event: MouseEvent) => void
}) {
  return (
    <div
      id="sl-feed-social-list"
      className="sl-feed-social-list"
      style={{ display: 'flex', flexDirection: 'row', gap: '12px', paddingBottom: '4px', width: 'max-content' }}
    >
      {tweets.map((tweet) => (
        <SocialFeedCard key={tweet.id} tweet={tweet} onItemClick={onItemClick} />
      ))}
    </div>
  )
}
