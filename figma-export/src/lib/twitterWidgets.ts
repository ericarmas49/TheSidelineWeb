type CreateTweetOptions = {
  theme?: 'light' | 'dark'
  width?: number
  conversation?: 'none' | 'all'
  dnt?: boolean
  linkColor?: string
  borderColor?: string
  align?: 'left' | 'right' | 'center'
}

type TwitterWidgets = {
  widgets: {
    load: (element?: Element, options?: { width?: number }) => Promise<void>
    createTweet: (tweetId: string, element: Element, options?: CreateTweetOptions) => Promise<Element | undefined>
  }
}

declare global {
  interface Window {
    twttr?: TwitterWidgets
  }
}

let twitterWidgetsLoader: Promise<TwitterWidgets> | null = null

const mountGeneration = new WeakMap<HTMLElement, number>()

export function loadTwitterWidgetsScript(): Promise<TwitterWidgets> {
  if (window.twttr?.widgets) {
    return Promise.resolve(window.twttr)
  }

  if (twitterWidgetsLoader) {
    return twitterWidgetsLoader
  }

  twitterWidgetsLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="platform.twitter.com/widgets.js"]')
    if (existing) {
      if (window.twttr?.widgets) {
        resolve(window.twttr)
        return
      }

      existing.addEventListener('load', () => {
        if (window.twttr?.widgets) resolve(window.twttr)
        else reject(new Error('Twitter widgets failed to initialize'))
      })
      existing.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.charset = 'utf-8'
    script.onload = () => {
      if (window.twttr?.widgets) resolve(window.twttr)
      else reject(new Error('Twitter widgets failed to initialize'))
    }
    script.onerror = reject
    document.head.appendChild(script)
  })

  return twitterWidgetsLoader
}

export async function hydrateTwitterEmbeds(container: HTMLElement, width = 320) {
  const hasEmbeds = container.querySelector('blockquote.twitter-tweet, a.twitter-timeline')
  if (!hasEmbeds) return

  const twttr = await loadTwitterWidgetsScript()
  await twttr.widgets.load(container, { width })
}

function bumpMountGeneration(container: HTMLElement) {
  const next = (mountGeneration.get(container) ?? 0) + 1
  mountGeneration.set(container, next)
  return next
}

function isMountCurrent(container: HTMLElement, generation: number) {
  return mountGeneration.get(container) === generation
}

/** Feed strip: one embed per container; stale async mounts are ignored. */
export async function mountFeedTweetEmbed(container: HTMLElement, tweetId: string, width = 320) {
  const generation = bumpMountGeneration(container)
  container.replaceChildren()

  const twttr = await loadTwitterWidgetsScript()
  if (!isMountCurrent(container, generation)) return

  container.replaceChildren()
  await twttr.widgets.createTweet(tweetId, container, {
    theme: 'light',
    width,
    conversation: 'none',
    dnt: true,
    linkColor: '#1d9bf0',
    borderColor: 'rgba(255,255,255,0)',
    align: 'center',
  })

  if (!isMountCurrent(container, generation)) {
    container.replaceChildren()
  }
}

export function scheduleTwitterEmbedHydration(container: HTMLElement, width = 320) {
  const run = () => {
    hydrateTwitterEmbeds(container, width).catch(() => {})
  }

  run()
  window.setTimeout(run, 600)
  window.setTimeout(run, 1500)
  window.setTimeout(run, 3000)
}

/** Mount once; optional single retry if widgets.js was still loading. */
export function mountFeedTweetEmbedWithRetry(
  container: HTMLElement,
  tweetId: string,
  width = 320,
): () => void {
  let cancelled = false
  let retryTimer: number | undefined

  const run = () => {
    if (cancelled) return
    void mountFeedTweetEmbed(container, tweetId, width).then(() => {
      if (cancelled || container.querySelector('iframe')) return
      retryTimer = window.setTimeout(run, 1200)
    })
  }

  run()

  return () => {
    cancelled = true
    if (retryTimer !== undefined) window.clearTimeout(retryTimer)
    bumpMountGeneration(container)
    container.replaceChildren()
  }
}
