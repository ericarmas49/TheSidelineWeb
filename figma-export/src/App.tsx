import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import wordmarkLightImg from '@/imports/SIDELINE1-1.png'
import emailHeaderWelcomeImg from '@/imports/Universal_Email_Header.png'
import appScreenshotImg from '@/imports/01KZ9HS7M08TGMZQ1M4XJ7QYHF.jpeg'
import appScreenshotPng from '@/imports/Header.png'
import heroVideoSrc from '@/imports/Semi-Final_2.mp4'
import appleStoreBadgeImg from '@/imports/apple-app-store.png'
import googlePlayBadgeImg from '@/imports/google-play-app.png'
import appIconDarkImg from '@/imports/SIDELINE7_copy.png'
import engageDiscoverImg from '@/imports/new_social.png'
import whiteFaviconImg from '@/imports/favicon-white-logo-transparent-background-512.png'
import sourcesScreenImg from '@/imports/Screenshot_2026-09-04_at_10.28.52_AM.png'
import arsenalImg from '@/imports/Arsenal.jpeg'
import whySidelinePhoneImg from '@/imports/App_Store_Screenshots___Messaging_copy.png'
import screenImg1 from '@/imports/Matchweek_Opposition-Watch-Cross-Section.jpeg'
import screenImg2 from '@/imports/Pre-Match_Injury-Report-Cross-Section_WORKAROUND-TO-REPLACE-POST-MATCH-LINEUP-3.jpeg'
import screenImg3 from '@/imports/IMG_6753.png'
import screenImg4 from '@/imports/IMG_6754.png'
import screenImg5 from '@/imports/Pre-Match_Lineups-Cross-Section-BUT-ACTUALLY-POST-MATCH-1.jpeg'
import screenImg6 from '@/imports/Post-Match-Conversation_Player-Stats-Cross-Section-3.jpeg'
import whyImg1 from '@/imports/Choose-Your-Club_Main-Hero-Image-1.jpeg'
import whyImg2 from '@/imports/All-Your-Coverage-Together_Cross-section.jpeg'
import whyImg3 from '@/imports/Cut-Through-The-Noise_Cross-Section-4.jpeg'
import whyImg4 from '@/imports/Experience-Your-Club_History-Main-Hero-Image-2.jpeg'
import whyImg5 from '@/imports/IMG_1512-1.jpeg'
import whyImg6 from '@/imports/Screenshot_2026-09-15_at_12.14.20_PM.jpeg'
import { SocialFeedEmbeds } from '@/components/SocialFeedEmbeds'
import { getClubLogo } from '@/lib/clubLogos'
import qrDarkImg from '@/imports/sideline-download-qr-dark.png'
import qrWhiteImg from '@/imports/sideline-download-qr-white-1.png'
import appPhoneMockupImg from '@/imports/App_Store_Screenshots___Messaging-2.png'
import chooseYourClubImg from '@/imports/choose_your_club.png'
import chooseSourcesImg from '@/imports/Choose_Your_Sources-2.png'
import shapeYourCoverageImg from '@/imports/Choose_Your_Sources-3.png'
import discoverImg from '@/imports/Discover.png'
import { useClubFeed } from '@/hooks/useClubFeed'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function useIsWide() {
  const [isWide, setIsWide] = useState(() => window.innerWidth >= 1280)
  useEffect(() => {
    const handler = () => setIsWide(window.innerWidth >= 1280)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isWide
}

const SVG_WRAP = (inner: string, size = 24) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`

const ICONS: { name: string; label: string; svg: string }[] = [
  {
    name: 'sideline-customize',
    label: 'Customize Experience',
    svg: SVG_WRAP('<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/>'),
  },
  {
    name: 'sideline-explore',
    label: 'Explore Content',
    svg: SVG_WRAP('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none"/>'),
  },
  {
    name: 'sideline-matchday',
    label: 'Matchday Conversation',
    svg: SVG_WRAP('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="13" x2="13" y2="13"/>'),
  },
  {
    name: 'sideline-check',
    label: 'All The Content',
    svg: SVG_WRAP('<polyline points="20 6 9 17 4 12"/>'),
  },
  {
    name: 'sideline-vetted',
    label: 'Editorially Vetted',
    svg: SVG_WRAP('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>'),
  },
  {
    name: 'sideline-grid',
    label: 'All Content Types',
    svg: SVG_WRAP('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'),
  },
  {
    name: 'sideline-trophy',
    label: 'History & Culture',
    svg: SVG_WRAP('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>'),
  },
]

function downloadPng(name: string, svg: string, size = 128) {
  const scaled = svg
    .replace(`width="24" height="24"`, `width="${size}" height="${size}"`)
    .replace('stroke="currentColor"', 'stroke="#0a0a0a"')
    .replace(/fill="currentColor"/g, 'fill="#0a0a0a"')
  const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(scaled)
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${name}.png`
    a.click()
  }
  img.src = dataUrl
}

function IconExportPanel() {
  const [copied, setCopied] = useState<string | null>(null)

  function copySvg(name: string, svg: string) {
    navigator.clipboard.writeText(svg)
    setCopied(name)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div style={{ padding: '0 32px 80px', maxWidth: '1360px', margin: '0 auto' }}>
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '48px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '6px' }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#888',
            }}>Icons</span>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '17px',
              fontWeight: 600,
              color: '#111',
            }}>Export</span>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: '#666',
            margin: 0,
            lineHeight: 1.55,
          }}>
            Download each icon as a <code style={{ fontFamily: 'monospace', fontSize: '12px', background: '#e8e8e4', padding: '1px 5px', borderRadius: '3px' }}>.png</code> (128×128), or copy the SVG markup directly.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
        }}>
          {ICONS.map(({ name, label, svg }) => (
            <div key={name} style={{
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '20px 16px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}>
              {/* Preview */}
              <div
                style={{ color: '#111' }}
                dangerouslySetInnerHTML={{ __html: svg.replace('width="24" height="24"', 'width="32" height="32"') }}
              />

              {/* Label */}
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 600,
                color: '#444',
                textAlign: 'center',
                lineHeight: 1.4,
              }}>
                {label}
              </span>

              {/* Filename */}
              <span style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#999',
              }}>
                {name}.png
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <button
                  onClick={() => downloadPng(name, svg)}
                  style={{
                    flex: 1,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#111',
                    background: '#f2f1ee',
                    border: '1px solid #d8d7d4',
                    borderRadius: '4px',
                    padding: '6px 0',
                    cursor: 'pointer',
                  }}
                >
                  ↓ Download
                </button>
                <button
                  onClick={() => copySvg(name, svg)}
                  style={{
                    flex: 1,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: copied === name ? '#2a7a2a' : '#111',
                    background: copied === name ? '#e8f5e8' : '#f2f1ee',
                    border: `1px solid ${copied === name ? '#a8d8a8' : '#d8d7d4'}`,
                    borderRadius: '4px',
                    padding: '6px 0',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {copied === name ? '✓ Copied' : 'Copy SVG'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type Club = {
  id: string
  name: string
  newsletter: string
  color: string
  onColor: string
  logo: string
}

const CLUBS: Club[] = [
  { id: 'ars', name: 'Arsenal',        newsletter: 'Arsenal Insider',      color: '#EF0107', onColor: '#fff', logo: getClubLogo('ars') },
  { id: 'avl', name: 'Aston Villa',    newsletter: 'Villa Insider',        color: '#7B003C', onColor: '#fff', logo: getClubLogo('avl') },
  { id: 'bou', name: 'Bournemouth',    newsletter: 'Cherries Insider',     color: '#C00000', onColor: '#fff', logo: getClubLogo('bou') },
  { id: 'bre', name: 'Brentford',      newsletter: 'Bees Insider',         color: '#E30613', onColor: '#fff', logo: getClubLogo('bre') },
  { id: 'bha', name: 'Brighton',       newsletter: 'Seagulls Insider',     color: '#0057B8', onColor: '#fff', logo: getClubLogo('bha') },
  { id: 'che', name: 'Chelsea',        newsletter: 'Blues Insider',        color: '#034694', onColor: '#fff', logo: getClubLogo('che') },
  { id: 'cov', name: 'Coventry',       newsletter: 'Sky Blues Insider',    color: '#3AADE1', onColor: '#0a1f2e', logo: getClubLogo('cov') },
  { id: 'cry', name: 'Crystal Palace', newsletter: 'Eagles Insider',       color: '#1B458F', onColor: '#fff', logo: getClubLogo('cry') },
  { id: 'eve', name: 'Everton',        newsletter: 'Toffees Insider',      color: '#003399', onColor: '#fff', logo: getClubLogo('eve') },
  { id: 'ful', name: 'Fulham',         newsletter: 'Cottagers Insider',    color: '#1A1A1A', onColor: '#fff', logo: getClubLogo('ful') },
  { id: 'hul', name: 'Hull City',      newsletter: 'Tigers Insider',       color: '#E8A215', onColor: '#1a0e00', logo: getClubLogo('hul') },
  { id: 'ips', name: 'Ipswich',        newsletter: 'Blues Insider',        color: '#0044A9', onColor: '#fff', logo: getClubLogo('ips') },
  { id: 'lee', name: 'Leeds United',   newsletter: 'Leeds Insider',        color: '#1D428A', onColor: '#fff', logo: getClubLogo('lee') },
  { id: 'liv', name: 'Liverpool',      newsletter: 'Reds Insider',         color: '#C8102E', onColor: '#fff', logo: getClubLogo('liv') },
  { id: 'mci', name: 'Man City',       newsletter: 'City Insider',         color: '#6CABDD', onColor: '#0d1b2e', logo: getClubLogo('mci') },
  { id: 'mun', name: 'Man United',     newsletter: 'United Insider',       color: '#DA291C', onColor: '#fff', logo: getClubLogo('mun') },
  { id: 'new', name: 'Newcastle',      newsletter: 'Magpies Insider',      color: '#241F20', onColor: '#fff', logo: getClubLogo('new') },
  { id: 'nfo', name: 'Forest',         newsletter: 'Forest Insider',       color: '#E53233', onColor: '#fff', logo: getClubLogo('nfo') },
  { id: 'sun', name: 'Sunderland',     newsletter: 'Black Cats Insider',   color: '#EB172B', onColor: '#fff', logo: getClubLogo('sun') },
  { id: 'tot', name: 'Spurs',          newsletter: 'Spurs Insider',        color: '#132257', onColor: '#fff', logo: getClubLogo('tot') },
  { id: 'whu', name: 'West Ham',       newsletter: 'Hammers Insider',      color: '#7A263A', onColor: '#fff', logo: getClubLogo('whu') },
]

const PHOTO =
  'https://images.unsplash.com/flagged/photo-1550413231-202a9d53a331?w=600&h=340&fit=crop&auto=format'

type Article = { category: string; headline: string; author: string }

const TODAY_ARTICLES: Article[] = [
  {
    category: 'Transfer News',
    headline: "Ten Hag's Tenure Ends: United Confirm Departure After Their Worst Start in a Generation",
    author: 'David Ornstein · The Sideline',
  },
  {
    category: 'Match Analysis',
    headline: 'Arsenal vs. City: The Tactical Breakdown That Defines the Title Race',
    author: 'Jonathan Wilson · The Sideline',
  },
  {
    category: 'Interview',
    headline: "Moyes Returns: How the Scot Plans to Resurrect Everton's Season",
    author: 'Amy Lawrence · The Sideline',
  },
]

const WEEK_ARTICLES: Article[] = [
  {
    category: 'Features',
    headline: "The £200m Question: Are Clubs Actually Spending Wisely This Window?",
    author: 'Barney Ronay · The Sideline',
  },
  {
    category: 'Analysis',
    headline: "England's New Generation: Why the Next Manager Inherits a Golden Crop",
    author: 'Rob Smyth · The Sideline',
  },
  {
    category: 'Long Read',
    headline: 'Lower League, Higher Stakes: The Championship Clubs Primed for the Leap',
    author: 'Sid Lowe · The Sideline',
  },
]

const CLUB_TODAY: Article[] = [
  {
    category: 'Tactics',
    headline: "Arteta's Formation Shift: The Change That Could Define Arsenal's Season",
    author: 'Jonathan Wilson · The Sideline',
  },
  {
    category: 'Selection',
    headline: 'Havertz or Nketiah? The Debate Dividing the Emirates Faithful',
    author: 'Amy Lawrence · The Sideline',
  },
  {
    category: 'Contract',
    headline: "Gabriel's Deal: What We Know, What We Don't, and What It Means",
    author: 'David Ornstein · The Sideline',
  },
]

const CLUB_WEEK: Article[] = [
  {
    category: 'Transfer Window',
    headline: "Arsenal's Summer Rated: Every Signing Graded and Assessed",
    author: 'Barney Ronay · The Sideline',
  },
  {
    category: 'Data',
    headline: "The Numbers Behind Arsenal's Title Credentials This Season",
    author: 'Michael Cox · The Sideline',
  },
  {
    category: 'Archive',
    headline: "Invincibles Revisited: What That 2004 Side Still Teaches the Game",
    author: 'Rob Smyth · The Sideline',
  },
]

type Colors = { bg: string; fg: string; dim: string; rule: string }

function light(): Colors {
  return { bg: '#ffffff', fg: '#0a0a0a', dim: '#6b6b6b', rule: '#0a0a0a' }
}
function dark(): Colors {
  return { bg: '#000000', fg: '#f0f0f0', dim: '#888888', rule: '#f0f0f0' }
}

function DoubleRule({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ height: '2px', background: color }} />
      <div style={{ height: '1px', background: color }} />
    </div>
  )
}

function Wordmark({ color }: { color: string }) {
  return (
    <div style={{
      fontFamily: "'Figtree', sans-serif",
      fontWeight: 900,
      fontSize: '68px',
      lineHeight: 1,
      letterSpacing: '-2px',
      color,
      padding: '10px 0 8px',
      userSelect: 'none',
    }}>
      Sideline
    </div>
  )
}

function ArticleSection({ c, headline, author }: { c: Colors; headline: string; author: string }) {
  return (
    <div style={{ padding: '0 40px 40px' }}>
      <div style={{ position: 'relative', marginBottom: '28px' }}>
        <img
          src={PHOTO}
          alt="Football match"
          style={{ display: 'block', width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#000',
          padding: '9px 18px',
        }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#fff',
          }}>
            Recommended For You
          </span>
        </div>
      </div>

      <h2 style={{
        fontFamily: "'Lora', serif",
        fontWeight: 700,
        fontSize: '28px',
        lineHeight: 1.2,
        color: c.fg,
        margin: '0 0 14px',
      }}>
        {headline}
      </h2>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '22px',
      }}>
        <div style={{ width: '32px', height: '1px', background: c.dim }} />
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: c.dim,
          letterSpacing: '0.01em',
        }}>
          {author}
        </span>
      </div>

      <button style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        fontWeight: 600,
        color: c.fg,
        background: 'transparent',
        border: `1.5px solid ${c.fg}`,
        borderRadius: '100px',
        padding: '9px 22px',
        cursor: 'pointer',
        letterSpacing: '0.02em',
      }}>
        Read Story
      </button>
    </div>
  )
}

function StoriesSection({
  title,
  articles,
  c,
  accentColor,
}: {
  title: string
  articles: Article[]
  c: Colors
  accentColor?: string
}) {
  return (
    <div style={{ padding: '0 40px 36px' }}>
      {/* Section header */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ height: '2px', background: accentColor || c.rule, marginBottom: '10px' }} />
        <div style={{ height: '1px', background: accentColor || c.rule, opacity: 0.3, marginBottom: '10px' }} />
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: c.dim,
        }}>
          {title}
        </span>
      </div>

      {/* Article list */}
      {articles.map((article, i) => (
        <div key={i}>
          {i > 0 && (
            <div style={{
              height: '1px',
              background: c.rule,
              opacity: 0.12,
              margin: '20px 0',
            }} />
          )}
          <div>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: accentColor || c.dim,
              display: 'block',
              marginBottom: '7px',
            }}>
              {article.category}
            </span>
            <h3 style={{
              fontFamily: "'Lora', serif",
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: 1.3,
              color: c.fg,
              margin: '0 0 10px',
            }}>
              {article.headline}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{ width: '22px', height: '1px', background: c.dim }} />
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  color: c.dim,
                }}>
                  {article.author}
                </span>
              </div>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 600,
                color: c.fg,
                letterSpacing: '0.01em',
              }}>
                Read →
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionRule({ c }: { c: Colors }) {
  return (
    <div style={{ padding: '0 40px' }}>
      <div style={{ height: '1px', background: c.rule, opacity: 0.15, marginBottom: '3px' }} />
      <div style={{ height: '2px', background: c.rule, opacity: 0.9 }} />
    </div>
  )
}

function PhoneMockups() {
  return (
    <div style={{
      background: '#0d0d0d',
      padding: '44px 40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: '0',
      minHeight: '240px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 110%, rgba(255,255,255,0.05) 0%, transparent 65%)',
      }} />

      {/* Phone back-left */}
      <div style={{
        width: '112px', height: '210px',
        borderRadius: '18px',
        border: '1.5px solid #2e2e2e',
        background: '#181818',
        transform: 'rotate(-9deg) translateX(18px) translateY(12px)',
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
        flexShrink: 0,
        zIndex: 0,
      }}>
        <div style={{ background: '#EF0107', height: '24px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
          <span style={{ fontFamily: "'Figtree',sans-serif", fontSize: '8px', fontWeight: 900, color: '#fff', letterSpacing: '-0.2px' }}>Sideline</span>
        </div>
        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[48, 28, 36, 28, 40].map((h, i) => (
            <div key={i} style={{ background: i % 2 === 0 ? '#262626' : '#1e1e1e', borderRadius: '3px', height: `${h}px` }} />
          ))}
        </div>
      </div>

      {/* Phone front-center */}
      <div style={{
        width: '128px', height: '234px',
        borderRadius: '20px',
        border: '1.5px solid #3a3a3a',
        background: '#f4f4f4',
        transform: 'rotate(4deg)',
        overflow: 'hidden',
        boxShadow: '0 20px 56px rgba(0,0,0,0.8)',
        flexShrink: 0,
        zIndex: 1,
      }}>
        <div style={{ background: '#fff', height: '20px', borderBottom: '1px solid #e8e8e8' }} />
        <div style={{ background: '#fff', display: 'flex', gap: '6px', padding: '5px 8px', borderBottom: '1px solid #eee' }}>
          <div style={{ background: '#111', borderRadius: '8px', height: '14px', width: '38px' }} />
          <div style={{ background: '#e0e0e0', borderRadius: '8px', height: '14px', width: '38px' }} />
        </div>
        <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '72px' }} />
          <div style={{ background: '#e8e8e8', borderRadius: '2px', height: '9px', width: '85%' }} />
          <div style={{ background: '#e8e8e8', borderRadius: '2px', height: '9px', width: '65%' }} />
          <div style={{ height: '4px' }} />
          <div style={{ background: '#eeeeee', borderRadius: '4px', height: '44px' }} />
          <div style={{ background: '#e8e8e8', borderRadius: '2px', height: '9px', width: '75%' }} />
        </div>
      </div>

      {/* Phone back-right */}
      <div style={{
        width: '108px', height: '200px',
        borderRadius: '16px',
        border: '1.5px solid #2a2a2a',
        background: '#1c1c1c',
        transform: 'rotate(11deg) translateX(-14px) translateY(16px)',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
        flexShrink: 0,
        zIndex: 0,
      }}>
        <div style={{ background: '#132257', height: '22px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
          <span style={{ fontFamily: "'Figtree',sans-serif", fontSize: '8px', fontWeight: 900, color: '#fff', letterSpacing: '-0.2px' }}>Sideline</span>
        </div>
        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[36, 24, 44, 24, 32].map((h, i) => (
            <div key={i} style={{ background: i % 2 === 0 ? '#282828' : '#222', borderRadius: '3px', height: `${h}px` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

type FeatureItem = { title: string; body: string; icon?: ReactNode }

function MarketingBody({ c }: { c: Colors }) {
  const features: FeatureItem[] = [
    {
      title: 'Customize your experience',
      body: "Follow the clubs, players, sources, and content creators you love and we'll personalize your entire feed.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
          <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
          <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      title: 'Explore the best content',
      body: 'Sideline brings together trusted voices and the biggest stories around your team, all editorially vetted.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      title: 'Stay in the matchday conversation',
      body: 'From lineup news and press conferences to post-match reactions, Sideline keeps you connected to the moments that matter.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
          <line x1="9" y1="13" x2="13" y2="13" />
        </svg>
      ),
    },
  ]

  const reasons: string[] = [
    "All The Content You Want. Nothing That You Don't",
    'Editorially Vetted, High Quality Sources',
    'Articles, Videos, Podcasts, and Social Content in One App',
    'All The History and Culture That Defines Your Club',
  ]

  function ReasonIcon({ index }: { index: number }) {
    const shared = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' as const, stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
    if (index === 0) return <svg {...shared}><polyline points="20 6 9 17 4 12" /></svg>
    if (index === 1) return <svg {...shared}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
    if (index === 2) return <svg {...shared}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
    return <svg {...shared}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>
  }

  return (
    <>
      {/* Hero copy */}
      <div style={{ padding: '36px 40px 32px' }}>
        <h2 style={{
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          fontSize: '30px',
          lineHeight: 1.2,
          color: c.fg,
          margin: '0 0 16px',
        }}>
          Everything about your club in one place
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '15px',
          lineHeight: 1.65,
          color: c.dim,
          margin: 0,
        }}>
          The best articles, podcasts, social reactions, and analysis curated just for you. We vet all sources, filter out the clickbait, and let you decide how you want to experience your club.
        </p>
      </div>

      <SectionRule c={c} />

      {/* How to */}
      <div style={{ padding: '32px 40px' }}>
        <h2 style={{
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: 1.2,
          color: c.fg,
          margin: '0 0 24px',
        }}>
          How to get the most out of Sideline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {f.icon && (
                <div style={{
                  color: c.fg,
                  flexShrink: 0,
                  marginTop: '1px',
                  opacity: 0.85,
                }}>
                  {f.icon}
                </div>
              )}
              <div>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  color: c.fg,
                  margin: '0 0 5px',
                }}>
                  {f.title}
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: c.dim,
                  margin: 0,
                }}>
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionRule c={c} />

      {/* Why fans love */}
      <div style={{ padding: '32px 40px 40px' }}>
        <h2 style={{
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: 1.2,
          color: c.fg,
          margin: '0 0 20px',
        }}>
          Why fans love Sideline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reasons.map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ color: c.fg, flexShrink: 0, opacity: 0.85 }}>
                <ReasonIcon index={i} />
              </div>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                lineHeight: 1.55,
                color: c.dim,
              }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#0d0d0d',
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* Colored wordmark */}
        <div style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 900,
          fontSize: '32px',
          lineHeight: 1,
          letterSpacing: '-1px',
          userSelect: 'none',
        }}>
          <span style={{ color: '#E8C442' }}>Side</span>
          <span style={{ color: '#ffffff' }}>line</span>
        </div>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
            { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
            { label: 'Instagram', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
            { label: 'LinkedIn', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
          ].map(({ label, path }) => (
            <div key={label} style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d={path} />
              </svg>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          color: '#555',
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          © 2026 Sideline · <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Unsubscribe</span> · <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      </div>
    </>
  )
}

function Template3() {
  const [isDark, setIsDark] = useState(false)
  const c = isDark ? dark() : light()

  return (
    <div>
      <div style={{
        background: c.bg,
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 2px 20px rgba(0,0,0,0.13)',
        transition: 'background 0.2s',
      }}>
        {/* Masthead */}
        {!isDark ? (
          <img src={emailHeaderWelcomeImg} alt="Sideline — Welcome to Sideline" style={{ display: 'block', width: '100%' }} />
        ) : (
          <div style={{ padding: '32px 40px 0' }}>
            <DoubleRule color={c.rule} />
            <Wordmark color={c.fg} />
            <DoubleRule color={c.rule} />
            <div style={{ padding: '11px 0 28px' }}>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: c.fg,
              }}>
                Welcome to Sideline
              </span>
            </div>
          </div>
        )}

        <PhoneMockups />
        <MarketingBody c={c} />
      </div>
      <ModeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
    </div>
  )
}

function ModeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: isDark ? '#ccc' : '#555',
        background: isDark ? '#1a1a1a' : '#fff',
        border: '1px solid',
        borderColor: isDark ? '#333' : '#d0d0d0',
        borderRadius: '100px',
        padding: '6px 16px',
        cursor: 'pointer',
      }}
    >
      {isDark ? '◑  Light mode' : '◐  Dark mode'}
    </button>
  )
}

function Template1({ isDark }: { isDark: boolean }) {
  const c = isDark ? dark() : light()

  return (
    <div>
      <div style={{
        background: c.bg,
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 2px 20px rgba(0,0,0,0.13)',
        transition: 'background 0.2s',
      }}>
        <div style={{ padding: '32px 40px 0' }}>
          <DoubleRule color={c.rule} />
          <Wordmark color={c.fg} />
          <DoubleRule color={c.rule} />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '11px 0 28px',
            fontFamily: "'Inter', sans-serif",
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: c.fg,
            }}>
              The Weekly Digest
            </span>
            <span style={{
              fontSize: '11px',
              color: c.dim,
              letterSpacing: '0.04em',
            }}>
              Wed 13 Aug 2026 · No. 47
            </span>
          </div>
        </div>

        <ArticleSection
          c={c}
          headline="The Quiet Revolution: How Arne Slot Has Rebuilt Liverpool's Engine Room"
          author="Jonathan Wilson · The Sideline"
        />
        <StoriesSection title="Top Stories Today" articles={TODAY_ARTICLES} c={c} />
        <StoriesSection title="Top Stories This Week" articles={WEEK_ARTICLES} c={c} />
      </div>
    </div>
  )
}

function Template2({ isDark, club }: { isDark: boolean; club: Club }) {
  const c = isDark ? dark() : light()

  return (
    <div>
      <div style={{
        background: c.bg,
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 2px 20px rgba(0,0,0,0.13)',
        transition: 'background 0.2s',
      }}>
        {/* Club color band */}
        <div style={{
          background: club.color,
          padding: '11px 40px',
          transition: 'background 0.18s',
        }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: club.onColor,
            transition: 'color 0.18s',
          }}>
            {club.newsletter}
          </span>
        </div>

        {/* Masthead */}
        <div style={{ padding: '24px 40px 0' }}>
          <DoubleRule color={c.rule} />
          <Wordmark color={c.fg} />
          <DoubleRule color={c.rule} />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '11px 0 28px',
            fontFamily: "'Inter', sans-serif",
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: c.fg,
            }}>
              {club.name} · Issue 12
            </span>
            <span style={{
              fontSize: '11px',
              color: c.dim,
              letterSpacing: '0.04em',
            }}>
              Wed 13 Aug 2026
            </span>
          </div>
        </div>

        <ArticleSection
          c={c}
          headline={`Arteta's Blueprint: The Tactical Shift That Changes Everything at the Emirates`}
          author="Amy Lawrence · The Sideline"
        />
        <StoriesSection title="Top Stories Today" articles={CLUB_TODAY} c={c} accentColor={club.color} />
        <StoriesSection title="Top Stories This Week" articles={CLUB_WEEK} c={c} accentColor={club.color} />
      </div>

    </div>
  )
}

function SignaturePreview({
  name, title, email, phone, club,
}: {
  name: string; title: string; email: string; phone: string; club: Club
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
      {/* Club color double-rule (mirrors the thick+thin horizontal motif, rendered vertically) */}
      <div style={{ display: 'flex', gap: '2px', flexShrink: 0, alignSelf: 'stretch' }}>
        <div style={{ width: '3px', background: club.color, transition: 'background 0.18s' }} />
        <div style={{ width: '1.5px', background: club.color, transition: 'background 0.18s' }} />
      </div>
      <div style={{ width: '8px', flexShrink: 0 }} />

      {/* Wordmark */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        paddingRight: '20px',
        borderRight: '1px solid #e0e0e0',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 900,
          fontSize: '22px',
          letterSpacing: '-0.5px',
          color: '#0a0a0a',
          lineHeight: 1,
          userSelect: 'none',
        }}>Sideline</span>
      </div>

      <div style={{ width: '20px', flexShrink: 0 }} />

      {/* Contact info */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px' }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          fontWeight: 700,
          color: '#0a0a0a',
          lineHeight: 1.2,
        }}>
          {name || 'Your Name'}
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: '#666',
        }}>
          {title || 'Job Title'}
        </div>
        <div style={{ height: '1px', background: '#e0e0e0', margin: '4px 0' }} />
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          color: '#555',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {email && <span>{email}</span>}
          {email && phone && <span style={{ color: '#ccc' }}>·</span>}
          {phone && <span>{phone}</span>}
        </div>
        <a
          href="https://the-sideline-web.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            color: club.color,
            fontWeight: 600,
            transition: 'color 0.18s',
            textDecoration: 'none',
          }}
        >
          DOWNLOAD APP
        </a>
      </div>
    </div>
  )
}

function generateSignatureHtml(name: string, title: string, email: string, phone: string, club: Club) {
  const contact = [email, phone].filter(Boolean).join(' &nbsp;·&nbsp; ')
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding:0;width:3px;background:${club.color};">&nbsp;</td>
    <td style="padding:0;width:2px;"></td>
    <td style="padding:0;width:2px;background:${club.color};">&nbsp;</td>
    <td style="width:8px;padding:0;"></td>
    <td style="vertical-align:middle;padding:0 20px 0 0;border-right:1px solid #e0e0e0;white-space:nowrap;">
      <span style="font-family:Arial Black,Arial,sans-serif;font-weight:900;font-size:20px;color:#0a0a0a;letter-spacing:-0.5px;line-height:1;">Sideline</span>
    </td>
    <td style="width:20px;padding:0;"></td>
    <td style="vertical-align:middle;padding:4px 0;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#0a0a0a;margin:0 0 2px 0;">${name}</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#666666;margin:0 0 6px 0;">${title}</div>
      <div style="height:1px;background:#e0e0e0;margin:0 0 6px 0;"></div>
      ${contact ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#555555;margin:0 0 2px 0;">${contact}</div>` : ''}
      <a href="https://the-sideline-web.vercel.app/" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:${club.color};text-decoration:none;display:block;letter-spacing:0.08em;">DOWNLOAD APP</a>
    </td>
  </tr>
</table>`
}

function EmailSignatureBuilder() {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [club, setClub] = useState<Club>(CLUBS.find(c => c.id === 'che')!)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const sigRef = useRef<HTMLDivElement>(null)

  async function downloadPng() {
    setDownloading(true)
    try {
      await document.fonts.ready

      const scale = 2
      const pad = 0
      const barW = 4
      const totalHeight = 96

      // Measure text widths to correctly size the canvas
      const mCtx = document.createElement('canvas').getContext('2d')!
      mCtx.font = "900 22px 'Figtree', 'Arial Black'"
      const wordmarkW = mCtx.measureText('Sideline').width

      const nameText = name || 'Your Name'
      const titleText = title || 'Job Title'
      const contactLine = [email, phone].filter(Boolean).join(' · ')

      mCtx.font = "700 14px 'Inter', Arial"
      const nameW = mCtx.measureText(nameText).width
      mCtx.font = "400 12px 'Inter', Arial"
      const titleW = mCtx.measureText(titleText).width
      mCtx.font = "400 11px 'Inter', Arial"
      const contactW = mCtx.measureText(contactLine).width
      mCtx.font = "700 11px 'Inter', Arial"
      const dlW = mCtx.measureText('DOWNLOAD APP').width

      const contactColW = Math.max(nameW, titleW, contactW, dlW) + 4
      const totalWidth = barW + 8 + wordmarkW + 20 + 1 + 20 + contactColW

      const canvas = document.createElement('canvas')
      canvas.width = (totalWidth + pad * 2) * scale
      canvas.height = (totalHeight + pad * 2) * scale

      const ctx = canvas.getContext('2d')!
      ctx.scale(scale, scale)

      // White background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, totalWidth + pad * 2, totalHeight + pad * 2)

      const ox = pad
      const oy = pad

      // Club color bar
      ctx.fillStyle = club.color
      ctx.fillRect(ox, oy, barW, totalHeight)

      // "Sideline" wordmark — uses Figtree from document fonts
      ctx.font = "900 22px 'Figtree', 'Arial Black', sans-serif"
      ctx.fillStyle = '#0a0a0a'
      ctx.textBaseline = 'middle'
      ctx.fillText('Sideline', ox + barW + 8, oy + totalHeight / 2)

      // Vertical divider
      const divX = ox + barW + 8 + wordmarkW + 20
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(divX, oy)
      ctx.lineTo(divX, oy + totalHeight)
      ctx.stroke()

      // Contact column
      const cX = divX + 1 + 20
      let cY = oy + 10
      ctx.textBaseline = 'top'

      ctx.font = "700 14px 'Inter', Arial, sans-serif"
      ctx.fillStyle = '#0a0a0a'
      ctx.fillText(nameText, cX, cY)
      cY += 20

      ctx.font = "400 12px 'Inter', Arial, sans-serif"
      ctx.fillStyle = '#666666'
      ctx.fillText(titleText, cX, cY)
      cY += 18 + 6

      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cX, cY)
      ctx.lineTo(cX + contactColW, cY)
      ctx.stroke()
      cY += 8

      if (contactLine) {
        ctx.font = "400 11px 'Inter', Arial, sans-serif"
        ctx.fillStyle = '#555555'
        ctx.fillText(contactLine, cX, cY)
        cY += 16
      }

      ctx.font = "700 11px 'Inter', Arial, sans-serif"
      ctx.fillStyle = club.color
      ctx.fillText('DOWNLOAD APP', cX, cY)

      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `sideline-signature-${(name || 'signature').toLowerCase().replace(/\s+/g, '-')}.png`
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  function copyHtml() {
    navigator.clipboard.writeText(generateSignatureHtml(name, title, email, phone, club))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#111',
    background: '#fff',
    border: '1px solid #d8d7d4',
    borderRadius: '4px',
    padding: '8px 11px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#888',
    display: 'block',
    marginBottom: '5px',
  }

  return (
    <div className="sig-builder-wrap" style={{ padding: '48px 32px 80px', maxWidth: '1360px', margin: '0 auto' }}>
      <div>

        {/* Section header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: '17px', fontWeight: 600, color: '#111', margin: '0 0 6px' }}>
            Email Signature Builder
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.55 }}>
            Fill in your details, pick your club, and copy the HTML directly into your email client signature settings.
          </p>
        </div>

        <div className="sig-builder-grid">

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Nick Lapworth" />
            </div>
            <div>
              <label style={labelStyle}>Job Title</label>
              <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Founder, CEO" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="Nick@sideline.global" />
            </div>
            <div>
              <label style={labelStyle}>Phone (optional)</label>
              <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="508.665.8744" />
            </div>

            {/* Club selector */}
            <div>
              <label style={labelStyle}>Favourite Club</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                {CLUBS.map(cl => {
                  const active = cl.id === club.id
                  return (
                    <button
                      key={cl.id}
                      onClick={() => setClub(cl)}
                      title={cl.name}
                      style={{
                        background: cl.color,
                        border: active ? '3px solid #fff' : '3px solid transparent',
                        outline: active ? '2px solid #000' : '2px solid transparent',
                        borderRadius: '3px',
                        padding: '6px 4px',
                        cursor: 'pointer',
                        transition: 'outline 0.1s',
                      }}
                    >
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: 700, color: cl.onColor, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cl.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Preview + export */}
          <div>
            <label style={labelStyle}>Preview</label>

            {/* Mock email context */}
            <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
              {/* Email chrome */}
              <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e8e8e8', padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e8e8e8' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e8e8e8' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e8e8e8' }} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#aaa', marginLeft: '8px' }}>New Message</span>
              </div>

              {/* Email body */}
              <div style={{ padding: '24px' }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#aaa', margin: '0 0 20px', lineHeight: 1.6 }}>
                  Hi there, just wanted to follow up on…
                </p>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#aaa', margin: '0 0 24px' }}>
                  Best,
                </p>
                {/* Divider */}
                <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '20px' }}>
                  <div ref={sigRef} style={{ display: 'inline-block' }}>
                    <SignaturePreview name={name} title={title} email={email} phone={phone} club={club} />
                  </div>
                </div>
              </div>
            </div>

            {/* Export buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={downloadPng}
                disabled={downloading}
                style={{
                  flex: 1,
                  fontFamily: "'Inter',sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#111',
                  background: '#f2f1ee',
                  border: '1.5px solid #d8d7d4',
                  borderRadius: '4px',
                  padding: '10px 0',
                  cursor: downloading ? 'default' : 'pointer',
                  opacity: downloading ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {downloading ? 'Exporting…' : '↓ Download PNG'}
              </button>
              <button
                onClick={copyHtml}
                style={{
                  flex: 1,
                  fontFamily: "'Inter',sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: copied ? '#2a7a2a' : '#fff',
                  background: copied ? '#e8f5e8' : '#0a0a0a',
                  border: `1.5px solid ${copied ? '#a8d8a8' : '#0a0a0a'}`,
                  borderRadius: '4px',
                  padding: '10px 0',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy HTML'}
              </button>
            </div>

            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#999', margin: '10px 0 0', lineHeight: 1.5 }}>
              Gmail: Settings → See all settings → General → Signature. Outlook: File → Options → Mail → Signatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmailTemplatesTab() {
  const [template, setTemplate] = useState<'weekly' | 'club'>('weekly')
  const [isDark, setIsDark] = useState(false)
  const isMobile = useIsMobile()
  const [club, setClub] = useState<Club>(CLUBS[0])

  const btnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: active ? '#fff' : '#888',
    background: active ? '#0a0a0a' : 'transparent',
    border: '1px solid',
    borderColor: active ? '#0a0a0a' : '#d0d0d0',
    borderRadius: '100px',
    padding: '7px 20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: isMobile ? '20px 16px 16px' : '28px 32px 24px', flexWrap: 'wrap' }}>
        <button style={btnStyle(template === 'weekly')} onClick={() => setTemplate('weekly')}>Weekly Digest</button>
        <button style={btnStyle(template === 'club')} onClick={() => setTemplate('club')}>Club Newsletter</button>
        <div style={{ width: '1px', height: '22px', background: '#d0d0d0', margin: '0 4px' }} />
        <ModeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
      </div>

      {/* Club selector — only shown for Club Newsletter */}
      {template === 'club' && (
        <div style={{ maxWidth: '600px', margin: '0 auto 24px', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {CLUBS.map(cl => {
              const active = cl.id === club.id
              return (
                <button
                  key={cl.id}
                  onClick={() => setClub(cl)}
                  title={cl.name}
                  style={{
                    background: cl.color,
                    border: active ? '3px solid #fff' : '3px solid transparent',
                    outline: active ? '2px solid #000' : '2px solid transparent',
                    borderRadius: '3px',
                    padding: '7px 8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'outline 0.1s',
                  }}
                >
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: cl.onColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}>
                    {cl.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {template === 'weekly' && <Template1 isDark={isDark} />}
      {template === 'club' && <Template2 isDark={isDark} club={club} />}
    </div>
  )
}

// 9-post launch grid per strategy doc — types: brand | product | editorial | conversation
const LAUNCH_POSTS: {
  n: number; type: 'brand' | 'product' | 'editorial' | 'conversation'
  bg: string; fg: string; label: string; heading: string; body: string; pinned?: boolean; accent?: string; asset?: string; assetFit?: 'cover' | 'contain'; assetPos?: string
}[] = [
  // Post 1 — Brand Statement (pinned): oversized wordmark + tagline, black ground
  { n: 1, type: 'brand', bg: '#000', fg: '#fff', label: '', heading: 'Your club.\nYour news.', body: 'Now on the App Store', pinned: true },
  // Post 2 — Product Frame (pinned): app screens, white field
  { n: 2, type: 'product', bg: '#fff', fg: '#000', label: '', heading: '', body: '', pinned: true, asset: engageDiscoverImg, assetFit: 'contain', assetPos: 'center bottom' },
  // Post 3 — Editorial Card (pinned): Liverpool analysis, red accent band
  { n: 3, type: 'editorial', bg: '#0a0a0a', fg: '#fff', label: 'Liverpool · Analysis', heading: 'The tactical shift making Liverpool impossible to press', body: '', pinned: true, accent: '#C8102E' },
  // Post 4 — Conversation: bold question, white ground
  { n: 4, type: 'conversation', bg: '#fff', fg: '#000', label: '', heading: 'Who wins the league this season?', body: 'Drop your pick ↓', pinned: false },
  // Post 5 — Brand Statement: "One app. Every club." black ground
  { n: 5, type: 'brand', bg: '#0a0a0a', fg: '#fff', label: '', heading: 'One app.\nEvery club.', body: '', pinned: false },
  // Post 6 — Editorial Card: Arsenal tactics, red accent band
  { n: 6, type: 'editorial', bg: '#0a0a0a', fg: '#fff', label: 'Arsenal · Tactics', heading: "Arteta's blueprint is working. Here is why.", body: '', pinned: false, accent: '#EF0107' },
  // Post 7 — Product Frame: app screenshot, dark field
  { n: 7, type: 'product', bg: '#111', fg: '#fff', label: '', heading: '', body: '', pinned: false, asset: appScreenshotPng, assetFit: 'contain', assetPos: 'center bottom' },
  // Post 8 — Conversation: fan participation, white ground
  { n: 8, type: 'conversation', bg: '#fff', fg: '#000', label: '', heading: 'Most underrated signing this window?', body: 'Tell us below ↓', pinned: false },
  // Post 9 — Brand Statement: full wordmark, black ground
  { n: 9, type: 'brand', bg: '#000', fg: '#fff', label: '', heading: 'Sideline', body: 'Available on iOS & Android', pinned: false },
]

const CONTENT_TYPES: { type: string; desc: string; bg: string; fg: string; accent?: string }[] = [
  { type: 'Brand Statement', desc: 'Oversized wordmark + one short line of copy. Black ground, white type.', bg: '#000', fg: '#fff' },
  { type: 'Product Frame',   desc: 'App screen inside a clean black or white field. Honest, no embellishment.', bg: '#fff', fg: '#000' },
  { type: 'Editorial Card',  desc: 'Headline + small corner signature + club-color accent band. Lora serif.', bg: '#0a0a0a', fg: '#fff', accent: '#C8102E' },
  { type: 'Conversation',    desc: 'Bold question, minimal graphics. Invite participation. White ground.', bg: '#fff', fg: '#000' },
]

function SocialMoodboard() {
  const [activePost, setActivePost] = useState<number | null>(null)
  const isMobile = useIsMobile()

  function PostTile({ p }: { p: typeof LAUNCH_POSTS[0] }) {
    const isActive = activePost === p.n
    const onDark = p.bg === '#000' || p.bg === '#0a0a0a' || p.bg === '#111'

    return (
      <div
        onClick={() => setActivePost(isActive ? null : p.n)}
        style={{ aspectRatio: '1', background: p.bg, position: 'relative', overflow: 'hidden', cursor: 'pointer', outline: isActive ? '3px solid #fff' : 'none', outlineOffset: '-3px' }}
      >
        {/* BRAND STATEMENT — oversized wordmark or type, centered */}
        {p.type === 'brand' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', gap: '6px' }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: p.heading === 'Sideline' ? '22px' : '17px', color: p.fg, lineHeight: 1.1, letterSpacing: '-0.5px', whiteSpace: 'pre-line' }}>{p.heading || 'Sideline'}</div>
            {p.body && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '7px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: onDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)', marginTop: '2px' }}>{p.body}</div>}
          </div>
        )}

        {/* PRODUCT FRAME — app asset fills the field cleanly */}
        {p.type === 'product' && p.asset && (
          <img src={p.asset} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: p.assetFit ?? 'contain', objectPosition: p.assetPos ?? 'center' }} />
        )}

        {/* EDITORIAL CARD — Lora headline anchored to bottom, accent band */}
        {p.type === 'editorial' && (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)' }} />
            <div style={{ position: 'absolute', bottom: p.accent ? '7px' : '0', left: 0, right: 0, padding: '0 10px 10px', zIndex: 2 }}>
              {p.label && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '6.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.accent ?? 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '4px' }}>{p.label}</span>}
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '11px', color: '#fff', lineHeight: 1.3 }}>{p.heading}</div>
            </div>
            {p.accent && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: p.accent, zIndex: 2 }} />}
          </>
        )}

        {/* CONVERSATION — bold question centered, invitation below */}
        {p.type === 'conversation' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px', textAlign: 'center', gap: '8px' }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '12px', color: p.fg, lineHeight: 1.2, letterSpacing: '-0.3px' }}>{p.heading}</div>
            {p.body && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '7.5px', fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.04em' }}>{p.body}</div>}
          </div>
        )}

        {/* Post number — always */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', fontFamily: "'Inter', sans-serif", fontSize: '7px', fontWeight: 700, color: onDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)', letterSpacing: '0.08em', zIndex: 3 }}>{String(p.n).padStart(2, '0')}</div>

        {/* Pinned dot */}
        {p.pinned && <div style={{ position: 'absolute', top: '8px', left: '8px', width: '5px', height: '5px', borderRadius: '50%', background: onDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.25)', zIndex: 3 }} />}

        {/* Corner wordmark — editorial + conversation only */}
        {(p.type === 'editorial' || p.type === 'conversation') && (
          <div style={{ position: 'absolute', top: p.pinned ? '20px' : '8px', left: '9px', fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '7.5px', color: onDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)', letterSpacing: '-0.2px', zIndex: 3 }}>Sideline</div>
        )}
      </div>
    )
  }

  const active = activePost ? LAUNCH_POSTS.find(p => p.n === activePost) : null

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '32px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '6px' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>Social</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '17px', fontWeight: 600, color: '#111' }}>Instagram Launch Plan</span>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.55, maxWidth: '600px' }}>
          9-post launch grid published over 10–14 days. Black and white primary palette, yellow as a connective accent, club colors for club-specific content. Posts 1–3 are pinned.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? '28px' : '40px', alignItems: 'start' }}>
        {/* Left: profile + grid */}
        <div>
          {/* Instagram profile */}
          <div style={{ background: '#fff', border: '1px solid #dbdbdb', borderRadius: '8px 8px 0 0', padding: '24px 28px', borderBottom: 'none' }}>
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0, outline: '2px solid #E8C442', outlineOffset: '3px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={appIconDarkImg} alt="Sideline" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', gap: '36px' }}>
                {[{ n: '9', l: 'posts' }, { n: '—', l: 'followers' }, { n: '—', l: 'following' }].map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '15px', color: '#0a0a0a' }}>{s.n}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#888' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '13px', color: '#0a0a0a', marginBottom: '3px' }}>@sidelineapp</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#444', lineHeight: 1.5, marginBottom: '2px' }}>Your club. Your news. One Sideline.</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#444', lineHeight: 1.5, marginBottom: '4px' }}>A personalized Premier League experience.</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#0095f6' }}>Now on the App Store ↓</div>
          </div>

          {/* Story highlights */}
          <div style={{ background: '#fff', border: '1px solid #dbdbdb', borderBottom: 'none', padding: '14px 28px', display: 'flex', gap: '18px', overflowX: 'auto' }}>
            {['Matchday', 'Product', 'Arsenal', 'Liverpool', 'Chelsea', 'Tactics'].map(h => (
              <div key={h} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#0a0a0a', border: '2px solid #0a0a0a', padding: '2px', boxSizing: 'border-box' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0a0a0a' }} />
                  </div>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', color: '#0a0a0a', maxWidth: '52px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>{h}</span>
              </div>
            ))}
          </div>

          {/* 9-post grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', border: '1px solid #dbdbdb', background: '#dbdbdb', borderTop: 'none' }}>
            {LAUNCH_POSTS.map(p => <PostTile key={p.n} p={p} />)}
          </div>

          {/* Active post detail */}
          {active && (
            <div style={{ marginTop: '16px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '20px', alignItems: 'start' }}>
              <div style={{ width: '80px', height: '80px', background: active.bg, borderRadius: '4px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '8px', position: 'relative' }}>
                {active.pinned && <div style={{ position: 'absolute', top: '6px', left: '6px', width: '5px', height: '5px', borderRadius: '50%', background: '#E8C442' }} />}
                <div style={{ fontFamily: active.type === 'brand' || active.type === 'product' ? "'Figtree', sans-serif" : "'Lora', serif", fontWeight: 700, fontSize: '9px', color: active.fg, lineHeight: 1.2 }}>{active.heading}</div>
                {active.accent && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: active.accent }} />}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Post {String(active.n).padStart(2, '0')}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0a0a0a', background: '#f2f2f0', borderRadius: '3px', padding: '2px 6px' }}>{active.type}</span>
                  {active.pinned && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b88a00', background: '#fdf8e1', borderRadius: '3px', padding: '2px 6px' }}>Pinned</span>}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600, color: '#0a0a0a', marginBottom: '4px' }}>{active.heading}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#666' }}>{active.body}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: strategy panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: isMobile ? 'static' : 'sticky', top: '72px' }}>

          {/* Color system */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '14px' }}>Color System</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {[
                { color: '#000', label: 'Primary', text: '#fff' },
                { color: '#fff', label: 'Primary', text: '#000', border: true },
                { color: '#E8C442', label: 'Accent', text: '#000' },
              ].map(s => (
                <div key={s.label + s.color} style={{ flex: 1, background: s.color, border: s.border ? '1px solid #e0e0e0' : 'none', borderRadius: '4px', padding: '10px 8px' }}>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '11px', color: s.text, letterSpacing: '-0.2px' }}>S</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '8px', fontWeight: 600, color: s.text === '#fff' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', marginTop: '4px' }}>{s.color}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#666', lineHeight: 1.5 }}>
              Club colors introduced only when content concerns a specific club.
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
              {CLUBS.slice(0, 6).map(cl => (
                <div key={cl.id} style={{ width: '20px', height: '20px', background: cl.color, borderRadius: '2px' }} title={cl.name} />
              ))}
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#aaa', display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>+15 more</div>
            </div>
          </div>

          {/* 4 content templates */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '14px' }}>Content Templates</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {CONTENT_TYPES.map(ct => (
                <div key={ct.type} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', background: ct.bg, border: ct.bg === '#fff' ? '1px solid #e0e0e0' : 'none', borderRadius: '3px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                    {ct.accent && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: ct.accent }} />}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '11px', color: ct.fg }}>S</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, color: '#0a0a0a', marginBottom: '2px' }}>{ct.type}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#888', lineHeight: 1.45 }}>{ct.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo behavior */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '14px' }}>Logo Behavior</div>
            {[
              { usage: 'Full wordmark', when: 'Launch announcements, major brand posts' },
              { usage: 'Corner signature', when: 'Editorial and conversation posts' },
              { usage: '"S" icon', when: 'Avatar, story highlights, watermarks' },
            ].map(r => (
              <div key={r.usage} style={{ marginBottom: '10px' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, color: '#0a0a0a' }}>{r.usage}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#888' }}>{r.when}</div>
              </div>
            ))}
          </div>

          {/* Content principles */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '14px' }}>Every Post Should…</div>
            {[
              'Explain the product',
              'Express a recognizable point of view',
              'Invite supporter participation',
              'Show Sideline is actively improving',
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#E8C442', flexShrink: 0, marginTop: '5px' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#444', lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

type FeedLead = { tag: string; color: string; headline: string; body: string; source: string; time: string; img: string }
type FeedStory = { tag: string; color: string; headline: string; source: string; time: string; img?: string; body?: string }
type FeedSet = { lead: FeedLead; secondary: FeedStory[]; grid: FeedStory[] }

const FEED_BY_CLUB: Record<string, FeedSet> = {
  liv: {
    lead: { tag: 'Liverpool · Analysis', color: '#C8102E', headline: 'The tactical shift that is making Liverpool impossible to press', body: "Slot's side have quietly adjusted their build-up shape over the last six weeks. The numbers tell a story most fans haven't noticed yet.", source: 'The Athletic', time: '12 min read', img: 'https://images.unsplash.com/photo-1761315191206-a592f6bdb523?w=800&h=450&fit=crop&auto=format' },
    secondary: [
      { tag: 'Liverpool · Transfer', color: '#C8102E', headline: "Why Liverpool's quiet window was actually their smartest yet", source: 'Sky Sports', time: '7 min read', img: 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=120&h=90&fit=crop&auto=format', body: "No flashy signings, no panic buys. Slot's recruitment team played a long game — and the early results suggest it's paying off." },
      { tag: 'Liverpool · Interview', color: '#C8102E', headline: '"This group can be something special" — Salah on the season ahead', source: 'BBC Sport', time: '5 min read', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&h=90&fit=crop&auto=format', body: "The Egyptian King is entering his eighth season at Anfield with more hunger than ever. We spoke to him about legacy, longevity, and Liverpool." },
      { tag: 'Liverpool · Match Report', color: '#C8102E', headline: 'Anfield roared and Liverpool delivered. Here is how they won.', source: 'The Guardian', time: '4 min read', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=120&h=90&fit=crop&auto=format', body: "A scrappy win, but three points that could matter enormously come May. The atmosphere did what it always does at this ground." },
    ],
    grid: [
      { tag: 'Liverpool · Podcast', color: '#C8102E', headline: 'Is this the best Liverpool squad Slot has had at his disposal?', source: 'The Anfield Wrap', time: '52 min', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&h=90&fit=crop&auto=format', body: "Depth, quality, balance — the squad has it all this season. But does it have enough to finally go the distance in Europe?" },
      { tag: 'Liverpool · Data', color: '#C8102E', headline: "Liverpool's xG numbers are quietly extraordinary", source: 'Opta Analyst', time: '5 min read' },
      { tag: 'Liverpool · Opinion', color: '#C8102E', headline: 'Trent Alexander-Arnold deserves more credit than he gets', source: 'The Athletic', time: '6 min read' },
      { tag: 'Liverpool · History', color: '#C8102E', headline: "Istanbul revisited: what that night still means to the game", source: 'FourFourTwo', time: '8 min read' },
    ],
  },
  ars: {
    lead: { tag: 'Arsenal · Tactics', color: '#EF0107', headline: "Arteta's formation shift: the change that could define Arsenal's season", body: "The Gunners have quietly moved away from their trademark high press. Here's what it means for the title race.", source: 'The Athletic', time: '10 min read', img: arsenalImg },
    secondary: [
      { tag: 'Arsenal · Transfer', color: '#EF0107', headline: "Arsenal's summer business rated: every signing assessed", source: 'Sky Sports', time: '8 min read', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=120&h=90&fit=crop&auto=format', body: "From the marquee arrivals to the quiet departures, we grade every piece of Arsenal's window and ask what it tells us about their ambitions." },
      { tag: 'Arsenal · Interview', color: '#EF0107', headline: '"We believe we can win it this time" — Arteta on the title challenge', source: 'BBC Sport', time: '5 min read', img: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=120&h=90&fit=crop&auto=format', body: "Mikel Arteta sat down ahead of the new season with more calm and conviction than we've seen from him in years. Something has shifted." },
      { tag: 'Arsenal · Match Report', color: '#EF0107', headline: 'Ten-man Arsenal held their nerve. Here is how they did it.', source: 'The Guardian', time: '4 min read', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=120&h=90&fit=crop&auto=format', body: "Down to ten with twenty minutes left, the Gunners dug in. A masterclass in game management from a side that has finally learned to suffer." },
    ],
    grid: [
      { tag: 'Arsenal · Podcast', color: '#EF0107', headline: 'Is Gabriel the best centre-back in the Premier League right now?', source: 'Arseblog', time: '45 min', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=120&h=90&fit=crop&auto=format', body: "The Brazilian has been quietly extraordinary. We make the case that he's the best in the league — and ask why he isn't getting more credit." },
      { tag: 'Arsenal · Data', color: '#EF0107', headline: "The numbers behind Arsenal's title credentials", source: 'Opta Analyst', time: '5 min read' },
      { tag: 'Arsenal · History', color: '#EF0107', headline: "Invincibles revisited: what that 2004 side still teaches the game", source: 'FourFourTwo', time: '9 min read' },
      { tag: 'Arsenal · Opinion', color: '#EF0107', headline: 'Saka is already one of the best players in Europe', source: 'The Athletic', time: '6 min read' },
    ],
  },
  che: {
    lead: { tag: 'Chelsea · Analysis', color: '#034694', headline: "Why Chelsea's recruitment model is finally starting to make sense", body: "After three seasons of expensive confusion, the threads are beginning to connect at Stamford Bridge.", source: 'Sky Sports', time: '9 min read', img: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=450&fit=crop&auto=format' },
    secondary: [
      { tag: 'Chelsea · Transfer', color: '#034694', headline: "The £600m question: are Chelsea's signings finally clicking?", source: 'The Athletic', time: '8 min read' },
      { tag: 'Chelsea · Interview', color: '#034694', headline: '"We are building something different" — Maresca on his vision', source: 'BBC Sport', time: '5 min read' },
      { tag: 'Chelsea · Match Report', color: '#034694', headline: 'Enzo Fernandez ran the show. Chelsea win again.', source: 'The Guardian', time: '4 min read' },
    ],
    grid: [
      { tag: 'Chelsea · Podcast', color: '#034694', headline: 'Is Maresca the right fit for Chelsea long-term?', source: 'The Athletic', time: '40 min' },
      { tag: 'Chelsea · Data', color: '#034694', headline: "Chelsea's passing stats are genuinely elite. Here's the evidence.", source: 'Opta Analyst', time: '5 min read' },
      { tag: 'Chelsea · History', color: '#034694', headline: "Roman's reign: how Chelsea became a European superclub", source: 'FourFourTwo', time: '11 min read' },
      { tag: 'Chelsea · Opinion', color: '#034694', headline: "Cole Palmer is Chelsea's most important player in a decade", source: 'Sky Sports', time: '6 min read' },
    ],
  },
  mci: {
    lead: { tag: 'Man City · Analysis', color: '#6CABDD', headline: 'Is this the most complete Guardiola squad ever assembled at City?', body: "A look at how City's depth has transformed their title hopes, even amid ongoing legal challenges at the Premier League.", source: 'The Overlap', time: '14 min read', img: 'https://images.unsplash.com/photo-1540589159527-5059c5c0e91e?w=800&h=450&fit=crop&auto=format' },
    secondary: [
      { tag: 'Man City · Transfer', color: '#6CABDD', headline: "City's summer moves: understated but potentially decisive", source: 'The Athletic', time: '7 min read' },
      { tag: 'Man City · Interview', color: '#6CABDD', headline: '"Winning is never taken for granted here" — Guardiola', source: 'BBC Sport', time: '5 min read' },
      { tag: 'Man City · Match Report', color: '#6CABDD', headline: 'Rodri pulls the strings as City put four past another side', source: 'The Guardian', time: '4 min read' },
    ],
    grid: [
      { tag: 'Man City · Podcast', color: '#6CABDD', headline: 'Can any team in Europe stop Guardiola this year?', source: 'The Overlap', time: '48 min' },
      { tag: 'Man City · Data', color: '#6CABDD', headline: "Haaland's expected goals record is statistically remarkable", source: 'Opta Analyst', time: '6 min read' },
      { tag: 'Man City · History', color: '#6CABDD', headline: "From relegation to dynasty: how City rewrote English football", source: 'FourFourTwo', time: '10 min read' },
      { tag: 'Man City · Opinion', color: '#6CABDD', headline: 'The Premier League without Guardiola is unthinkable now', source: 'The Athletic', time: '5 min read' },
    ],
  },
  mun: {
    lead: { tag: 'Man United · Feature', color: '#DA291C', headline: "Old Trafford's next chapter: what the rebuild really means", body: "With a new stadium on the horizon and a new manager in the dugout, United are at an inflection point unlike anything since Fergie.", source: 'FourFourTwo', time: '11 min read', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop&auto=format' },
    secondary: [
      { tag: 'Man United · Transfer', color: '#DA291C', headline: "United's rebuild: every signing from the last 18 months rated", source: 'The Athletic', time: '9 min read' },
      { tag: 'Man United · Interview', color: '#DA291C', headline: '"We are going in the right direction" — the new era begins', source: 'BBC Sport', time: '5 min read' },
      { tag: 'Man United · Match Report', color: '#DA291C', headline: 'A gritty win at Old Trafford. United are starting to believe.', source: 'The Guardian', time: '4 min read' },
    ],
    grid: [
      { tag: 'Man United · Podcast', color: '#DA291C', headline: 'Is the rebuild finally working at Old Trafford?', source: 'The United Stand', time: '55 min' },
      { tag: 'Man United · Data', color: '#DA291C', headline: "United's defensive numbers tell a story of genuine improvement", source: 'Opta Analyst', time: '5 min read' },
      { tag: 'Man United · History', color: '#DA291C', headline: "Fergie's treble: the night that defined a generation", source: 'FourFourTwo', time: '8 min read' },
      { tag: 'Man United · Opinion', color: '#DA291C', headline: "Bruno Fernandes is still the most important player at the club", source: 'The Athletic', time: '6 min read' },
    ],
  },
  tot: {
    lead: { tag: 'Spurs · Opinion', color: '#132257', headline: 'Postecoglou deserves more time. The evidence is mounting.', body: "A second season in, the Australian's ideas are beginning to take root at Tottenham Hotspur Stadium.", source: 'The Athletic', time: '7 min read', img: 'https://images.unsplash.com/photo-1559628233-100c798642d3?w=800&h=450&fit=crop&auto=format' },
    secondary: [
      { tag: 'Spurs · Transfer', color: '#132257', headline: "Spurs' summer business: understated but potentially smart", source: 'Sky Sports', time: '7 min read' },
      { tag: 'Spurs · Interview', color: '#132257', headline: '"We want to attack and entertain" — Postecoglou on the season', source: 'BBC Sport', time: '4 min read' },
      { tag: 'Spurs · Match Report', color: '#132257', headline: 'Son at his brilliant best as Spurs climb the table', source: 'The Guardian', time: '4 min read' },
    ],
    grid: [
      { tag: 'Spurs · Podcast', color: '#132257', headline: 'Is this a genuine turning point for Tottenham?', source: 'Gold & Guest', time: '42 min' },
      { tag: 'Spurs · Data', color: '#132257', headline: "Spurs' attacking numbers are legitimately title-contender quality", source: 'Opta Analyst', time: '5 min read' },
      { tag: 'Spurs · History', color: '#132257', headline: "1961 and all that: Spurs' greatest ever season revisited", source: 'FourFourTwo', time: '8 min read' },
      { tag: 'Spurs · Opinion', color: '#132257', headline: "Son Heung-min is one of the Premier League's great servants", source: 'The Athletic', time: '6 min read' },
    ],
  },
  new: {
    lead: { tag: 'Newcastle · Interview', color: '#241F20', headline: '"We believe we can win the league" — Howe on Newcastle\'s moment', body: "The Magpies manager speaks candidly about ambition, investment, and whether St. James' Park is ready to host title football.", source: 'BBC Sport', time: '8 min read', img: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&h=450&fit=crop&auto=format' },
    secondary: [
      { tag: 'Newcastle · Transfer', color: '#241F20', headline: "Saudi money, smart recruitment: how Newcastle found balance", source: 'The Athletic', time: '8 min read' },
      { tag: 'Newcastle · Tactics', color: '#241F20', headline: "Howe's system is the most progressive in the division", source: 'The Athletic', time: '6 min read' },
      { tag: 'Newcastle · Match Report', color: '#241F20', headline: "St. James' roars again as the Magpies go top", source: 'The Guardian', time: '4 min read' },
    ],
    grid: [
      { tag: 'Newcastle · Podcast', color: '#241F20', headline: "Is this Newcastle's best squad since the Shearer era?", source: 'True Faith', time: '50 min' },
      { tag: 'Newcastle · Data', color: '#241F20', headline: "Newcastle's pressing intensity is elite-level. The numbers confirm it.", source: 'Opta Analyst', time: '5 min read' },
      { tag: 'Newcastle · History', color: '#241F20', headline: "Shearer, Beardsley, Keegan: a love letter to Tyneside's golden years", source: 'FourFourTwo', time: '9 min read' },
      { tag: 'Newcastle · Opinion', color: '#241F20', headline: "Eddie Howe is the best English manager working today", source: 'The Athletic', time: '5 min read' },
    ],
  },
}

function genericFeed(club: Club): FeedSet {
  return {
    lead: {
      tag: `${club.name} · Analysis`,
      color: club.color,
      headline: `What ${club.name}'s season tells us about the Premier League`,
      body: `A deep dive into the tactical and cultural trends shaping ${club.name}'s campaign — and what it means for the table.`,
      source: 'The Athletic',
      time: '10 min read',
      img: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=450&fit=crop&auto=format',
    },
    secondary: [
      { tag: `${club.name} · Transfer`, color: club.color, headline: `${club.name}'s recruitment rated: the good, the uncertain, the inspired`, source: 'Sky Sports', time: '7 min read', img: 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=120&h=90&fit=crop&auto=format', body: `No flashy signings, no panic buys — just a squad being quietly and methodically built for the long haul.` },
      { tag: `${club.name} · Interview`, color: club.color, headline: "The manager sets out the vision for the season ahead", source: 'BBC Sport', time: '5 min read', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&h=90&fit=crop&auto=format', body: `He spoke with unusual candour about targets, squad depth, and why this group feels different from the ones before it.` },
      { tag: `${club.name} · Match Report`, color: club.color, headline: `A vital three points. Here is what the win means for ${club.name}.`, source: 'The Guardian', time: '4 min read', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=120&h=90&fit=crop&auto=format', body: `Not pretty, but utterly professional. Three points that could look very important when the table is tallied in May.` },
    ],
    grid: [
      { tag: `${club.name} · Podcast`, color: club.color, headline: `Breaking down ${club.name}'s season so far`, source: 'The Athletic', time: '45 min', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=120&h=90&fit=crop&auto=format', body: `Halfway through the campaign, we take stock of what's working, what isn't, and where the season goes from here.` },
      { tag: `${club.name} · Data`, color: club.color, headline: `The statistics quietly defining ${club.name}'s campaign`, source: 'Opta Analyst', time: '5 min read' },
      { tag: `${club.name} · Opinion`, color: club.color, headline: `Why ${club.name} deserve more recognition than they get`, source: 'FourFourTwo', time: '6 min read' },
      { tag: `${club.name} · History`, color: club.color, headline: `The moments that made ${club.name} who they are`, source: 'FourFourTwo', time: '8 min read' },
    ],
  }
}

type AppStep = { n: string; title: string; body: string; img: string }

const APP_STEPS = [
  {
    id: 'club',
    label: 'Choose Your Club',
    headline: 'Start with\nyour club.',
    body: "Choose your Premier League club and everything else falls into place—its stories, matches, history, culture and the voices and perspectives of the people who live it with you.",
    detail: ['All 20 Premier League clubs', 'Instant feed personalisation', 'Club colours & branding', 'Switch clubs any time'],
    accent: '#c8102e',
    img: chooseYourClubImg,
  },
  {
    id: 'sources',
    label: 'Select Your Sources',
    headline: 'Shape your\ncoverage.',
    body: "Choose the publications, podcasts, channels and feeds you trust to keep you informed. Then, set your preferences to see more of what you want and filter out what you don't to make it truly yours.",
    detail: ['50+ premium publishers', 'Independent journalists', 'Podcast networks', 'Social accounts'],
    accent: '#c8102e',
    img: chooseSourcesImg,
  },
  {
    id: 'feed',
    label: 'Discover Your Feed',
    headline: 'Never miss\nwhat matters.',
    body: "Stay on top of everything happening around your club while keeping a pulse on the stories, rivals and developments shaping the league, curated from 600+ trusted sources.",
    detail: ['Content type preferences', 'Read-time filters', 'Smart ranking', 'Save for later'],
    accent: '#c8102e',
    img: engageDiscoverImg,
  },
  {
    id: 'way',
    label: 'Explore It All',
    headline: 'Get closer to\nyour club.',
    body: "Give your fandom a home with the analysis, stats, and history that help you know more, go deeper and bring more to every conversation.",
    detail: ['Zero algorithmic interference', 'Chronological or ranked', 'Offline reading', 'Daily digest mode'],
    accent: '#c8102e',
    img: discoverImg,
  },
]

const MATCH_PHASES = [
  {
    id: 'buildup',
    label: 'Matchweek Buildup',
    n: 'BETWEEN MATCHES',
    title: 'Your week starts here.',
    body: 'Follow the news, injuries, transfer talk and developing stories that shape the week ahead.',
    img: screenImg1,
  },
  {
    id: 'pre',
    label: 'Pre-Match',
    n: 'PRE-MATCH',
    title: 'Come ready.',
    body: 'Get the press conference, lineups, predictions and all the talking points before kick-off.',
    img: screenImg2,
  },
  {
    id: 'live',
    label: 'Live Match',
    n: 'IN-MATCH',
    title: 'Watch. Track. React.',
    body: 'Stay on top of the score and key moments while tracking lineups, player stats and in-game insights alongside the action.',
    img: screenImg6,
  },
  {
    id: 'post',
    label: 'Post-Match',
    n: 'POST-MATCH',
    title: 'Break it all down.',
    body: 'Grade the players, watch the highlights and dig into the stats and reactions from every angle.',
    img: screenImg5,
  },
]

function TheAppSection({ px, isMobile, accentColor }: { px: string; isMobile: boolean; accentColor: string }) {
  const [active, setActive] = useState(0)
  const [textVisible, setTextVisible] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeRef = useRef(0)
  const stepLockRef = useRef(false)
  const exitedDownRef = useRef(false)
  const exitedUpRef = useRef(false)
  const lockedRef = useRef(false)
  const step = APP_STEPS[active]

  const goTo = (i: number, { animate = true }: { animate?: boolean } = {}) => {
    const next = Math.min(APP_STEPS.length - 1, Math.max(0, i))
    if (next === activeRef.current) return
    if (animate) {
      setTextVisible(false)
      setTimeout(() => {
        setActive(next)
        activeRef.current = next
        setTextVisible(true)
      }, 160)
    } else {
      setActive(next)
      activeRef.current = next
      setTextVisible(true)
    }
  }

  // Scroll active tab into view in the horizontal nav
  useEffect(() => {
    const tab = tabRefs.current[active]
    const nav = navRef.current
    if (!tab || !nav) return
    const tabLeft = tab.offsetLeft
    const tabWidth = tab.offsetWidth
    const navWidth = nav.offsetWidth
    nav.scrollTo({ left: tabLeft - navWidth / 2 + tabWidth / 2, behavior: 'smooth' })
  }, [active])

  // Lock scroll while the user steps through all four panels
  useEffect(() => {
    const SNAP_PX = 12
    const last = APP_STEPS.length - 1
    let lastScrollY = window.scrollY
    let pinRaf = 0

    const getRect = () => sectionRef.current?.getBoundingClientRect() ?? null

    const isNearPinned = (rect: DOMRect) =>
      Math.abs(rect.top) <= SNAP_PX && rect.bottom > SNAP_PX

    const isInLockZone = (rect: DOMRect) => {
      const vh = window.innerHeight
      if (rect.bottom <= 0 || rect.top >= vh) return false
      if (isNearPinned(rect)) return true
      // Fast scroll overshoot — section top passed viewport top but section still visible
      if (rect.top < -SNAP_PX && rect.bottom > vh * 0.45) return true
      // Nearly pinned — catches fast scroll that lands slightly below the pin point
      if (rect.top > SNAP_PX && rect.top < vh * 0.2) return true
      return false
    }

    const snapToSectionTop = () => {
      const rect = getRect()
      if (!rect || Math.abs(rect.top) <= 1) return
      window.scrollTo({ top: window.scrollY + rect.top })
    }

    const stopPinLoop = () => {
      if (pinRaf) {
        cancelAnimationFrame(pinRaf)
        pinRaf = 0
      }
    }

    const startPinLoop = () => {
      if (pinRaf) return
      const loop = () => {
        if (!lockedRef.current) {
          stopPinLoop()
          return
        }
        const rect = getRect()
        if (rect && Math.abs(rect.top) > 1) {
          window.scrollTo({ top: window.scrollY + rect.top })
        }
        pinRaf = requestAnimationFrame(loop)
      }
      pinRaf = requestAnimationFrame(loop)
    }

    const canIntercept = (goingDown: boolean) => {
      if (goingDown && exitedDownRef.current) return false
      if (!goingDown && exitedUpRef.current) return false
      return true
    }

    const tryExit = (goingDown: boolean) => {
      const cur = activeRef.current
      if (goingDown && cur === last) {
        exitedDownRef.current = true
        lockedRef.current = false
        stopPinLoop()
        return true
      }
      if (!goingDown && cur === 0) {
        exitedUpRef.current = true
        lockedRef.current = false
        stopPinLoop()
        return true
      }
      return false
    }

    const beginLock = (goingDown: boolean) => {
      if (lockedRef.current) return false
      lockedRef.current = true
      goTo(goingDown ? 0 : last, { animate: false })
      snapToSectionTop()
      startPinLoop()
      return true
    }

    const advanceStep = (goingDown: boolean) => {
      if (stepLockRef.current) return
      const cur = activeRef.current
      if (goingDown && cur < last) {
        stepLockRef.current = true
        goTo(cur + 1)
        setTimeout(() => { stepLockRef.current = false }, 700)
      } else if (!goingDown && cur > 0) {
        stepLockRef.current = true
        goTo(cur - 1)
        setTimeout(() => { stepLockRef.current = false }, 700)
      }
    }

    const handleLockInput = (goingDown: boolean, delta: number, preventDefault?: () => void) => {
      const rect = getRect()
      if (!rect || !isInLockZone(rect)) {
        if (!isNearPinned(rect)) lockedRef.current = false
        return false
      }
      if (!canIntercept(goingDown)) return false
      if (tryExit(goingDown)) return true
      preventDefault?.()
      snapToSectionTop()
      if (beginLock(goingDown)) return true
      if (Math.abs(delta) < 8) return true
      advanceStep(goingDown)
      return true
    }

    const onScroll = () => {
      const rect = getRect()
      if (!rect) return
      const scrollY = window.scrollY
      const goingDown = scrollY > lastScrollY
      lastScrollY = scrollY

      if (!isInLockZone(rect)) {
        if (!isNearPinned(rect)) lockedRef.current = false
        return
      }
      if (!canIntercept(goingDown)) return

      // Catch momentum / fast scroll that skips the narrow pin window
      if (!isNearPinned(rect)) {
        snapToSectionTop()
        beginLock(goingDown)
        return
      }

      if (lockedRef.current) snapToSectionTop()
    }

    const onWheel = (e: WheelEvent) => {
      handleLockInput(e.deltaY > 0, e.deltaY, () => {
        e.preventDefault()
        e.stopImmediatePropagation()
      })
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        exitedDownRef.current = false
        exitedUpRef.current = false
        lockedRef.current = false
        stopPinLoop()
      }
    }, { threshold: 0 })
    if (sectionRef.current) observer.observe(sectionRef.current)

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0]?.clientY ?? touchStartY
      const goingDown = touchStartY - touchY > 0
      const rect = getRect()
      if (!rect || !isInLockZone(rect)) return
      if (!canIntercept(goingDown)) return
      if (tryExit(goingDown)) return
      e.preventDefault()
      snapToSectionTop()
    }
    const onTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(deltaY) < 40) return
      handleLockInput(deltaY > 0, deltaY)
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true, capture: true })

    return () => {
      observer.disconnect()
      stopPinLoop()
      window.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart, { capture: true } as EventListenerOptions)
      window.removeEventListener('touchmove', onTouchMove, { capture: true } as EventListenerOptions)
      window.removeEventListener('touchend', onTouchEnd, { capture: true } as EventListenerOptions)
    }
  }, [])

  return (
    <section
      id="sl-how-it-works"
      className="sl-how-it-works sl-section"
      ref={sectionRef}
      style={{
        marginTop: '40px',
        background: '#111',
        padding: `52px ${px} 0`,
        position: 'relative',
        overflow: 'hidden',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'absolute', top: '-80px', right: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`, pointerEvents: 'none', transition: 'background 0.6s ease' }} />

      {/* Eyebrow */}
      <div className="sl-section-eyebrow-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0', flexShrink: 0 }}>
        <span id="sl-how-it-works-eyebrow" className="sl-section-eyebrow" style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>How It Works</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      </div>

      {/* Horizontal scrolling nav — same on mobile and desktop, auto-scrolls to active */}
      <div
        id="sl-how-it-works-nav"
        className="sl-how-it-works-nav"
        ref={navRef}
        style={{ margin: '8px 0 0', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="sl-how-it-works-nav-list" style={{ display: 'flex', gap: '0', minWidth: 'max-content' }}>
          {APP_STEPS.map((s, i) => (
            <button
              key={s.id}
              id={`sl-howitworks-tab-${s.id}`}
              className={`sl-howitworks-tab${active === i ? ' is-active' : ''}`}
              ref={el => { tabRefs.current[i] = el }}
              onClick={() => goTo(i)}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em', color: active === i ? '#fff' : 'rgba(255,255,255,0.3)', background: 'none', border: 'none', padding: '12px 28px 12px 0', cursor: 'pointer', transition: 'color 0.2s', textAlign: 'left', flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              <span style={{ borderBottom: `2px solid ${active === i ? accentColor : 'transparent'}`, paddingBottom: '12px', transition: 'border-color 0.2s', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, opacity: 0.4, letterSpacing: '0.05em' }}>0{i + 1}</span>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content — desktop: side by side; mobile: phone on top, text below */}
      <div id="sl-how-it-works-panel" className="sl-how-it-works-panel" data-step={step.id} style={{ flex: 1, display: 'contents' }}>
      {isMobile ? (
        <div className="sl-how-it-works-mobile" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Text — top, centered */}
          <div id="sl-howitworks-content" className="sl-howitworks-content" style={{ flexShrink: 0, padding: '20px 0 8px', textAlign: 'center', opacity: textVisible ? 1 : 0, transform: textVisible ? 'translateY(8%)' : 'translateY(calc(8% + 12px))', transition: 'opacity 0.2s ease, transform 0.2s ease' }}>
            <h2 id="sl-howitworks-title" className="sl-howitworks-title" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '32px', color: '#fff', margin: '0 0 10px', lineHeight: 1.05, letterSpacing: '-0.5px' }}>{step.headline}</h2>
            <p id="sl-howitworks-body" className="sl-howitworks-body" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.7 }}>{step.body}</p>
          </div>
          {/* Phone — large, offset down so only the top of the screen shows */}
          <div className="sl-howitworks-media" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflow: 'hidden', paddingTop: '0', opacity: textVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}>
            <img
              id="sl-howitworks-phone"
              className="sl-howitworks-phone"
              src={step.img}
              alt={step.label}
              style={{ height: 'min(750px, 76vh)', width: 'auto', maxWidth: 'none', objectFit: 'contain', objectPosition: 'top', display: 'block', flexShrink: 0 }}
            />
          </div>
        </div>
      ) : (
        <div className="sl-how-it-works-desktop" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', minHeight: 0 }}>
          {/* Left — text */}
          <div id="sl-howitworks-content" className="sl-howitworks-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px 0 8px', paddingLeft: '135px', opacity: textVisible ? 1 : 0, transform: textVisible ? 'translateY(-12%)' : 'translateY(calc(-12% + 12px))', transition: 'opacity 0.2s ease, transform 0.2s ease' }}>
            <h2 id="sl-howitworks-title" className="sl-howitworks-title" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '54px', color: '#fff', margin: '0 0 24px', lineHeight: 1.05, whiteSpace: 'pre-line', letterSpacing: '-0.5px' }}>{step.headline}</h2>
            <p id="sl-howitworks-body" className="sl-howitworks-body" style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.8, maxWidth: '380px' }}>{step.body}</p>
          </div>
          {/* Phone mockup — centered */}
          <div className="sl-howitworks-media" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <img id="sl-howitworks-phone" className="sl-howitworks-phone" src={step.img} alt={step.label} style={{ maxHeight: 'min(70vh, 750px)', maxWidth: '100%', width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>
      )}
      </div>

      {/* Progress dots — desktop only */}
      {!isMobile && (
        <div id="sl-howitworks-dots" className="sl-howitworks-dots" style={{ position: 'absolute', right: px, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {APP_STEPS.map((s, i) => (
            <div key={i} id={`sl-howitworks-dot-${s.id}`} className={`sl-howitworks-dot${i === active ? ' is-active' : ''}`} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === active ? '#fff' : 'rgba(255,255,255,0.2)', transition: 'background 0.3s' }} />
          ))}
        </div>
      )}
    </section>
  )
}

function MatchDaySection({ px, isMobile }: { px: string; isMobile: boolean }) {
  const doubleRule = <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}><div style={{ height: '2px', background: '#0a0a0a' }} /><div style={{ height: '1px', background: '#0a0a0a' }} /></div>
  return (
    <section id="sl-matchday" className="sl-matchday sl-section" style={{ padding: `32px ${px} 0` }}>
      <div className="sl-section-eyebrow-row" style={{ padding: '0', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span id="sl-matchday-eyebrow" className="sl-section-eyebrow" style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>Match Experience</span>
      </div>
      <h2 id="sl-matchday-title" className="sl-section-title" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '28px' : '42px', color: '#0a0a0a', margin: '0 0 32px', lineHeight: 1.1, letterSpacing: '-0.4px' }}>
        Your daily club companion.
      </h2>
      <div id="sl-matchday-grid" className="sl-matchday-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '0' }}>
        {MATCH_PHASES.map((f, i) => {
          const borderRight = !isMobile && i % 2 === 0 ? '1px solid #e0e0e0' : 'none'
          const borderTop = isMobile ? (i > 0 ? '1px solid #e0e0e0' : 'none') : (i >= 2 ? '1px solid #e0e0e0' : 'none')
          return (
            <div key={i} id={`sl-matchday-${f.id}`} className="sl-matchday-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', borderRight, borderTop, paddingTop: '24px', paddingBottom: '24px', paddingLeft: isMobile ? '0' : (i % 2 === 1 ? '40px' : '0'), paddingRight: isMobile ? '0' : '40px' }}>
              <div style={{ flex: 1, minWidth: 0, maxWidth: '360px' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#bbb', marginBottom: '16px' }}>{f.n}</div>
                <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '18px' : '20px', color: '#0a0a0a', margin: '0 0 10px', lineHeight: 1.25 }}>{f.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#666', margin: 0, lineHeight: 1.75, maxWidth: '280px' }}>{f.body}</p>
              </div>
              <div style={{ flexShrink: 0, width: isMobile ? '148px' : '200px', height: isMobile ? '148px' : '200px' }}>
                <img src={f.img} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.14)' }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function AppCarousel({ steps, px, isMobile }: { steps: AppStep[]; px: string; isMobile: boolean }) {
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const startX = useRef(0)
  const isDragging = useRef(false)

  function advance(dir: 1 | -1) {
    setActive(a => {
      const next = Math.max(0, Math.min(steps.length - 1, a + dir))
      activeRef.current = next
      return next
    })
  }

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX
    isDragging.current = true
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!isDragging.current) return
    isDragging.current = false
    const dx = e.clientX - startX.current
    if (dx < -40) advance(1)
    else if (dx > 40) advance(-1)
  }

  return (
    <div style={{ margin: `40px 0 0`, background: '#0a0a0a', padding: `28px ${px} 32px`, userSelect: 'none' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>The App</span>
        <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '22px' : '32px', color: '#fff', margin: '8px 0 0', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
          Built around your club from the moment you open it.
        </h2>
      </div>

      {/* Carousel track */}
      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ overflow: 'hidden', cursor: 'grab' }}
      >
        <div style={{ display: 'flex', transition: 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)', transform: `translateX(${active * -100}%)` }}>
          {steps.map((f, i) => (
            <div key={i} style={{ minWidth: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '24px' : '80px', alignItems: 'center' }}>
              {/* Text */}
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>{f.n} / 03</div>
                <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '22px' : '28px', color: '#fff', margin: '0 0 12px', lineHeight: 1.15 }}>{f.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: '0 0 20px', lineHeight: 1.7 }}>{f.body}</p>
                {/* Arrow — only on the visible slide, hidden on last */}
                {i < steps.length - 1 && (
                  <button onClick={() => advance(1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.4 }}>
                      <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="1.5" />
                      <path d="M13 10l6 6-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
              {/* Phone image */}
              {!isMobile && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={f.img} alt={f.title} style={{ width: '52%', maxWidth: '180px', height: 'auto', display: 'block', objectFit: 'contain', borderRadius: '28px', boxShadow: '0 0 40px rgba(255,255,255,0.08), 0 16px 40px rgba(0,0,0,0.5)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const APP_STORE_URL = 'https://apps.apple.com/us/app/sideline-club/id6789336406'

const FEED_LOADING_SECTIONS = ['Posts', 'Podcasts', 'Social', 'Videos'] as const

function ClubFeedLoadingNotice({ clubName, accentColor }: { clubName: string; accentColor: string }) {
  const [sectionIndex, setSectionIndex] = useState(0)

  useEffect(() => {
    setSectionIndex(0)
  }, [clubName])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSectionIndex((i) => (i + 1) % FEED_LOADING_SECTIONS.length)
    }, 900)
    return () => window.clearInterval(timer)
  }, [])

  const section = FEED_LOADING_SECTIONS[sectionIndex]

  return (
    <div
      id="sl-club-feed-loading"
      className="sl-club-feed-loading"
      role="status"
      aria-live="polite"
      aria-label={`Getting latest ${clubName} ${section.toLowerCase()}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '13%',
        background: 'rgba(255,255,255,0.86)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div className="sl-club-feed-loading-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '24px', textAlign: 'center', position: 'sticky', top: '20px' }}>
        <div
          className="sl-club-feed-loading-spinner"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: `2.5px solid ${accentColor}22`,
            borderTopColor: accentColor,
            animation: 'sl-feed-spin 0.8s linear infinite',
          }}
        />
        <p className="sl-club-feed-loading-text" style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0a0a0a', margin: 0, letterSpacing: '0.01em' }}>
          Getting latest {clubName} {section.toLowerCase()}…
        </p>
      </div>
    </div>
  )
}

const CLUB_PICKER_SETS = 3

function InfiniteClubPicker({
  activeClubId,
  hoveredClubId,
  onSelect,
  onHover,
  onLeave,
}: {
  activeClubId: string
  hoveredClubId: string | null
  onSelect: (club: Club) => void
  onHover: (clubId: string) => void
  onLeave: () => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const segmentWidthRef = useRef(0)
  const initializedRef = useRef(false)
  const [showMore, setShowMore] = useState(false)

  const extendedClubs = useMemo(
    () =>
      Array.from({ length: CLUB_PICKER_SETS }, (_, setIdx) =>
        CLUBS.map(cl => ({ ...cl, pickerKey: `${setIdx}-${cl.id}` })),
      ).flat(),
    [],
  )

  const updateMetrics = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    segmentWidthRef.current = el.scrollWidth / CLUB_PICKER_SETS
    setShowMore(segmentWidthRef.current > el.clientWidth + 4)
  }, [])

  const normalizeScroll = useCallback(() => {
    const el = scrollRef.current
    const setWidth = segmentWidthRef.current
    if (!el || setWidth <= 0) return
    if (el.scrollLeft >= setWidth * 2) {
      el.scrollLeft -= setWidth
    } else if (el.scrollLeft < setWidth) {
      el.scrollLeft += setWidth
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const initScroll = () => {
      updateMetrics()
      const setWidth = segmentWidthRef.current
      if (setWidth > 0 && !initializedRef.current) {
        el.scrollLeft = setWidth
        initializedRef.current = true
      }
    }

    initScroll()
    el.addEventListener('scroll', normalizeScroll, { passive: true })

    const ro = new ResizeObserver(() => {
      updateMetrics()
      normalizeScroll()
    })
    ro.observe(el)
    const list = el.querySelector('.sl-club-picker-list')
    if (list) ro.observe(list)
    window.addEventListener('resize', initScroll)

    return () => {
      el.removeEventListener('scroll', normalizeScroll)
      window.removeEventListener('resize', initScroll)
      ro.disconnect()
    }
  }, [normalizeScroll, updateMetrics])

  const scrollMore = () => {
    scrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' })
  }

  return (
    <div id="sl-club-picker" className="sl-club-picker" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <div
          id="sl-club-picker-scroll"
          className="sl-club-picker-scroll"
          ref={scrollRef}
          style={{ overflowX: 'auto', overflowY: 'visible', scrollbarWidth: 'none' }}
        >
          <div
            id="sl-club-picker-list"
            className="sl-club-picker-list"
            style={{ display: 'flex', gap: '12px', paddingBottom: '6px', paddingTop: '6px', paddingRight: '4px', alignItems: 'center' }}
          >
            {extendedClubs.map((cl, idx) => {
              const setIdx = Math.floor(idx / CLUBS.length)
              const active = cl.id === activeClubId
              const hovered = hoveredClubId === cl.id
              return (
                <button
                  key={cl.pickerKey}
                  id={setIdx === 1 ? `sl-club-btn-${cl.id}` : undefined}
                  className={`sl-club-btn${active ? ' is-active' : ''}`}
                  onClick={() => onSelect(cl)}
                  onMouseEnter={() => onHover(cl.id)}
                  onMouseLeave={onLeave}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px 5px 6px',
                    borderRadius: '100px',
                    border: active ? `1.5px solid ${cl.color}` : `1.5px solid ${hovered ? cl.color + '88' : '#e0e0e0'}`,
                    background: active ? cl.color : hovered ? `${cl.color}10` : '#fff',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                >
                  <img
                    src={cl.logo}
                    alt={cl.name}
                    className="sl-club-btn-logo"
                    style={{
                      width: '18px',
                      height: '18px',
                      objectFit: 'contain',
                      flexShrink: 0,
                      background: active ? 'rgba(255,255,255,0.95)' : 'transparent',
                      borderRadius: '50%',
                      padding: active ? '1px' : 0,
                    }}
                  />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, color: active ? cl.onColor : hovered ? cl.color : '#444', whiteSpace: 'nowrap', letterSpacing: '0.01em', transition: 'color 0.15s' }}>
                    {cl.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        {showMore && (
          <div
            className="sl-club-picker-fade"
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '40px',
              background: 'linear-gradient(to right, transparent, #fff 85%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      {showMore && (
        <span
          id="sl-club-picker-more"
          className="sl-club-picker-more"
          onClick={scrollMore}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            color: '#666',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0,
            paddingLeft: '2px',
          }}
        >
          more →
        </span>
      )}
    </div>
  )
}

function AppStoreBadge({ id, className, height }: { id: string; className: string; height: number }) {
  return (
    <a
      id={id}
      className={className}
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download on the App Store"
      style={{ display: 'inline-flex', lineHeight: 0 }}
    >
      <img src={appleStoreBadgeImg} alt="" style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', display: 'block' }} />
    </a>
  )
}

function GooglePlayBadge({ id, className, height }: { id: string; className: string; height: number }) {
  return (
    <span
      id={id}
      className={className}
      aria-label="Get it on Google Play (coming soon)"
      aria-disabled="true"
      style={{ display: 'inline-flex', lineHeight: 0, opacity: 0.45, cursor: 'default', pointerEvents: 'none' }}
    >
      <img src={googlePlayBadgeImg} alt="" style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', display: 'block' }} />
    </span>
  )
}

function HomepageMockup() {
  const [feedClub, setFeedClub] = useState<Club>(CLUBS.find(c => c.id === 'ars')!)
  const [hoveredClub, setHoveredClub] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const isWide = useIsWide()
  const px = isMobile ? '20px' : '48px'
  const videoCardWidth = isMobile ? '280px' : '350px'
  const { loading: feedLoading, articles: liveArticles, podcasts: livePodcasts, social: liveSocial, videos: liveVideos } = useClubFeed(feedClub.id, feedClub.color)
  const mockFeed = FEED_BY_CLUB[feedClub.id] ?? genericFeed(feedClub)
  const articleFeed = liveArticles ?? mockFeed
  const mockPodcasts = [
    { title: `${feedClub.name} Debrief — Matchday Review`, show: 'The Athletic FC Podcast', duration: '48 min', date: '8 Sep 2026', thumb: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=120&h=120' },
    { title: `Transfer Window Special: ${feedClub.name} in Focus`, show: 'Sky Sports Football Podcast', duration: '35 min', date: '7 Sep 2026', thumb: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=120&h=120' },
    { title: `Can ${feedClub.name} Go All the Way This Season?`, show: 'Football Weekly', duration: '62 min', date: '6 Sep 2026', thumb: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=120&h=120' },
    { title: `${feedClub.name} vs. The Rest: Season Verdict So Far`, show: 'The Anfield Wrap', duration: '41 min', date: '5 Sep 2026', thumb: 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=120&h=120' },
  ]
  const podcastItems = livePodcasts.length ? livePodcasts : mockPodcasts
  const mockVideos = [
    { title: `${feedClub.name} vs. The Title Contenders — Tactical Breakdown`, channel: 'The Overlap', channelInitial: 'O', date: '8 Sep 2026', duration: '18:42', thumbnailUrl: null as string | null },
    { title: `Every ${feedClub.name} Goal This Season — Compiled`, channel: 'Premier League', channelInitial: 'PL', date: '7 Sep 2026', duration: '12:05', thumbnailUrl: null },
    { title: `${feedClub.name} Transfer Window: What Went Right?`, channel: 'Sky Sports', channelInitial: 'SS', date: '6 Sep 2026', duration: '9:30', thumbnailUrl: null },
    { title: `The Manager Interview: What's Next for ${feedClub.name}`, channel: 'The Athletic', channelInitial: 'A', date: '5 Sep 2026', duration: '22:17', thumbnailUrl: null },
    { title: `${feedClub.name} Fan Reactions — Matchday Vlog`, channel: 'Football Daily', channelInitial: 'FD', date: '4 Sep 2026', duration: '8:54', thumbnailUrl: null },
    { title: `Can ${feedClub.name} Win It? Season Prediction`, channel: 'Football Daily', channelInitial: 'FD', date: '3 Sep 2026', duration: '15:11', thumbnailUrl: null },
  ]
  const videoItems = liveVideos.length ? liveVideos : mockVideos
  const footerLinks = [
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms-of-service' },
  ]

  const rule2 = (color = '#0a0a0a') => (
    <div>
      <div style={{ height: '2px', background: color }} />
      <div style={{ height: '1px', background: color, marginTop: '3px' }} />
    </div>
  )

  return (
    <div id="sl-homepage" className="sl-homepage sl-page" style={{ background: '#fff', overflowX: 'hidden' }}>

      {/* ── Top band ── */}
      <div id="sl-top-band" className="sl-top-band" style={{ background: '#0a0a0a', padding: `14px ${px}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span id="sl-top-band-label" className="sl-top-band-label" style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>
          Sideline · Premier League Edition
        </span>
        {!isMobile && (
          <nav id="sl-top-nav" className="sl-top-nav" aria-label="Top navigation" style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'Why Sideline', id: 'why-sideline', href: '#sl-why' },
              { label: 'Latest News', id: 'latest-news', href: '#sl-club-hub' },
              { label: 'How It Works', id: 'how-it-works', href: '#sl-how-it-works' },
              { label: 'Match Experience', id: 'match-experience', href: '#sl-matchday' },
              { label: 'Contact Us', id: 'contact-us', href: '/contact-us' },
            ].map(({ label, id, href }) => (
              <a
                key={id}
                id={`sl-top-nav-${id}`}
                className="sl-top-nav-link"
                href={href}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', textDecoration: 'none' }}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* ── Masthead ── */}
      <header id="sl-masthead" className="sl-masthead sl-header" style={{ padding: `20px ${px} 0` }}>
        {rule2()}
        <div className="sl-masthead-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '10px 0 8px' }}>
          <div id="sl-brand-wordmark" className="sl-brand-wordmark" style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: isMobile ? '44px' : '80px', lineHeight: 1, letterSpacing: isMobile ? '-1.5px' : '-3px', color: '#0a0a0a', userSelect: 'none', paddingLeft: '5px', paddingRight: '15px' }}>
            Sideline
          </div>
          {isMobile ? (
            <div id="sl-masthead-downloads" className="sl-masthead-downloads sl-download-badges" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <AppStoreBadge id="sl-download-ios-masthead" className="sl-download-ios" height={28} />
              <GooglePlayBadge id="sl-download-android-masthead" className="sl-download-android" height={28} />
            </div>
          ) : (
            <div id="sl-masthead-downloads" className="sl-masthead-downloads sl-download-badges" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginBottom: '14px', flexShrink: 0 }}>
              <span className="sl-download-label" style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>Download for free now</span>
              <div className="sl-download-badge-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <AppStoreBadge id="sl-download-ios-masthead" className="sl-download-ios" height={36} />
                <GooglePlayBadge id="sl-download-android-masthead" className="sl-download-android" height={36} />
              </div>
            </div>
          )}
        </div>
        {rule2()}
        <div className="sl-masthead-tagline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0 0' }}>
          <span id="sl-masthead-tagline" className="sl-masthead-tagline" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0a0a0a' }}>Your Club. all in one place.</span>
        </div>
      </header>

      {/* ── Hero: 35/65 on wide screens, stacked otherwise ── */}
      <section id="sl-hero" className="sl-hero sl-section" style={{
        margin: `20px ${px} 0`,
        display: 'grid',
        gridTemplateColumns: isWide ? '40fr 60fr' : '1fr',
        alignItems: 'stretch',
        minHeight: isWide ? '460px' : undefined,
      }}>
        {/* Text: left on wide, below video otherwise */}
        <div id="sl-hero-content" className="sl-hero-content" style={{
          order: isWide ? 1 : 2,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: isMobile ? '28px 0 8px' : isWide ? '48px 120px 48px 0' : '36px 0 8px',
        }}>
          <h1 id="sl-hero-title" className="sl-hero-title" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '32px' : '44px', lineHeight: 1.1, color: '#0a0a0a', margin: '0 0 20px', letterSpacing: '-0.5px' }}>
            Everything about your club in one place.
          </h1>
          <p id="sl-hero-body" className="sl-hero-body" style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? '14px' : '16px', lineHeight: 1.7, color: '#444', margin: '0 0 28px' }}>
            Stop chasing your Premier League club across the internet and take control of your fandom.
          </p>
          <div id="sl-hero-downloads" className="sl-hero-downloads sl-download-links" style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'nowrap' }}>
            <a id="sl-download-ios-hero" className="sl-download-ios-link" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '0.04em', cursor: 'pointer', borderBottom: '1.5px solid #0a0a0a', paddingBottom: '1px', whiteSpace: 'nowrap', textDecoration: 'none' }}>Download for iOS →</a>
            <span id="sl-download-android-hero" className="sl-download-android-link" aria-disabled="true" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 700, color: 'rgba(10,10,10,0.45)', letterSpacing: '0.04em', cursor: 'default', borderBottom: '1.5px solid rgba(10,10,10,0.25)', paddingBottom: '1px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>Download for Android →</span>
            {!isMobile && <img id="sl-hero-qr" className="sl-hero-qr sl-download-qr" src={qrDarkImg} alt="Scan to download Sideline" style={{ width: '72px', height: '72px', objectFit: 'contain', display: 'block', flexShrink: 0 }} />}
          </div>
        </div>

        {/* Video: right on wide, top otherwise */}
        <div id="sl-hero-media" className="sl-hero-media" style={{
          order: isWide ? 2 : 1,
          position: 'relative', overflow: 'hidden',
          aspectRatio: isMobile ? '4/3' : isWide ? undefined : '16/7',
          minHeight: isMobile ? '260px' : undefined,
          background: '#000',
        }}>
          <video
            id="sl-hero-video"
            className="sl-hero-video"
            ref={(el) => { if (el) { el.src = heroVideoSrc; el.load(); el.play().catch(() => {}); } }}
            autoPlay loop muted playsInline preload="auto"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
          />
          <div className="sl-hero-video-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.35) 100%)' }} />
          <img
            id="sl-hero-phone"
            className="sl-hero-phone"
            src={appScreenshotPng}
            alt="Sideline app screens"
            style={{ position: 'absolute', right: '24px', bottom: '32px', maxHeight: 'calc(100% - 32px)', width: 'auto', display: 'block' }}
          />
          <div id="sl-hero-download-bar" className="sl-hero-download-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#000', padding: '9px 18px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>
              Available For Free Now
            </span>
          </div>
        </div>
      </section>

      {/* ── Why Sideline ── */}
      <section id="sl-why" className="sl-why sl-section" style={{ padding: `28px ${px} 48px` }}>
        {rule2()}
        <div className="sl-section-eyebrow-row" style={{ padding: '10px 0 0', marginBottom: '16px' }}>
          <span id="sl-why-eyebrow" className="sl-section-eyebrow" style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>Why Sideline</span>
        </div>
        <h2 id="sl-why-title" className="sl-section-title" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '28px' : '42px', color: '#0a0a0a', margin: '0 0 32px', lineHeight: 1.1, letterSpacing: '-0.4px' }}>
          Following your club shouldn't feel like work.
        </h2>
        <div id="sl-why-grid" className="sl-why-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '0' }}>
          {[
            { title: 'Built around your club.', body: 'Put your club at the center because being a fan should always start with the team you love.', n: '01', img: whyImg1 },
            { title: 'All your coverage together.', body: 'Get your articles, podcasts, videos, social and stats in one place—without ever leaving the app.', n: '02', img: whyImg2 },
            { title: 'Personalized to you.', body: "Choose the sources you love, filter out the ones you don't and shape your experience around how you follow your club.", n: '03', img: whyImg3 },
            { title: 'Rooted in club culture.', body: "Explore the history, stats, traditions and stories that connect your club's past and present—and shape what comes next.", n: '04', img: whyImg4 },
            { title: 'New voices to discover.', body: 'Step outside your usual routine with fresh takes from 600+ trusted sources you might otherwise miss.', n: '05', img: whyImg5 },
            { title: 'Connected through your club.', body: "Soon, you'll be able to share your perspective and interact with fellow supporters—both online and in person.", n: '06', img: whyImg6 },
          ].map((f, i) => (
            <div key={i} id={`sl-why-card-${f.n}`} className="sl-why-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', borderRight: !isMobile && i % 3 !== 2 ? '1px solid #e0e0e0' : 'none', borderTop: (isMobile ? i > 0 : i >= 3) ? '1px solid #e0e0e0' : 'none', paddingTop: '16px', paddingBottom: '16px', paddingLeft: isMobile ? '0' : (i % 3 === 0 ? '0' : '28px'), paddingRight: '16px', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#bbb', marginBottom: '14px' }}>{f.n}</div>
                <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '16px', color: '#0a0a0a', margin: '0 0 10px', lineHeight: 1.25 }}>{f.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#666', margin: 0, lineHeight: 1.7 }}>{f.body}</p>
              </div>
              <div style={{ flexShrink: 0, width: '136px', height: '136px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={f.img} alt={f.title} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── From the Feed ── */}
      <section id="sl-club-hub" className="sl-club-hub sl-section" style={{ padding: `0 ${px} 0` }}>
        {rule2()}
        <div className="sl-section-eyebrow-row" style={{ padding: '10px 0 0', marginBottom: '8px' }}>
          <span id="sl-club-hub-eyebrow" className="sl-section-eyebrow" style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>Latest News</span>
        </div>
        <div className="sl-section-heading-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <h2 id="sl-club-hub-title" className="sl-section-title" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '28px' : '38px', color: '#0a0a0a', margin: 0, lineHeight: 1.15, letterSpacing: '-0.3px' }}>
            Pick your club. See what's happening.
          </h2>
        </div>

        {/* Club selector */}
        <InfiniteClubPicker
          activeClubId={feedClub.id}
          hoveredClubId={hoveredClub}
          onSelect={setFeedClub}
          onHover={setHoveredClub}
          onLeave={() => setHoveredClub(null)}
        />

        <div id="sl-club-feed-wrap" className="sl-club-feed-wrap" style={{ position: 'relative' }}>
              {feedLoading && <ClubFeedLoadingNotice clubName={feedClub.name} accentColor={feedClub.color} />}

              {/* ── Quadrant feed ── */}
              <div id="sl-club-feed" className="sl-club-feed" data-club={feedClub.id} style={{ position: 'relative', width: '100%', minWidth: 0, overflow: isMobile ? 'hidden' : undefined }}>

                {/* Articles label */}
                <div id="sl-feed-articles" className="sl-feed-articles sl-feed-block">
                <div className="sl-feed-block-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="sl-feed-block-label" style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: feedClub.color, paddingRight: '8px' }}>Articles</span>
                  <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                </div>

                {/* Top row: lead + secondary */}
                <div className="sl-feed-articles-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '20px' : '32px', position: 'relative', zIndex: 1, alignItems: 'stretch' }}>
                  <div id="sl-feed-article-lead" className="sl-feed-article-lead" style={{ paddingBottom: '28px' }}>
                    <div style={{ width: '100%', aspectRatio: '3/2', overflow: 'hidden', marginBottom: '14px' }}>
                      <img src={articleFeed.lead.img} alt={feedClub.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: feedClub.color, display: 'block', marginBottom: '8px' }}>{articleFeed.lead.source}</span>
                    <h3 className="sl-feed-article-headline" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '18px' : '20px', color: '#0a0a0a', margin: '0 0 10px', lineHeight: 1.2 }}>{articleFeed.lead.headline}</h3>
                    {articleFeed.lead.body && (
                      <p className="sl-feed-article-excerpt" style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? '12px' : '13px', color: '#666', margin: 0, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                        {articleFeed.lead.body}
                      </p>
                    )}
                  </div>
                  <div id="sl-feed-articles-list" className="sl-feed-articles-list" style={{ paddingBottom: '28px', paddingRight: isMobile ? '0' : '25%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    {articleFeed.secondary.map((s, i, arr) => (
                      <div key={i} id={`sl-feed-article-${i + 1}`} className="sl-feed-article-item" style={{ paddingBottom: i < arr.length - 1 ? '16px' : '0', marginBottom: i < arr.length - 1 ? '16px' : '0', display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                        {s.img && (
                          <div style={{ flexShrink: 0, width: '150px', height: '100px', overflow: 'hidden', borderRadius: '3px' }}>
                            <img src={s.img} alt={s.headline} style={{ width: '150px', height: '100px', objectFit: 'cover', display: 'block' }} />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: feedClub.color, display: 'block', marginBottom: '5px' }}>{s.source}</span>
                          <h4 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '14px', color: '#0a0a0a', margin: '0 0 6px', lineHeight: 1.3 }}>{s.headline}</h4>
                          {s.body && (
                            <p className="sl-feed-article-excerpt" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#777', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                              {s.body}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>

                {/* Podcasts section */}
                <div id="sl-feed-podcasts" className="sl-feed-podcasts sl-feed-block" style={{ marginTop: '28px', paddingBottom: '28px', width: '100%', minWidth: 0, overflow: isMobile ? 'hidden' : undefined }}>
                  <div className="sl-feed-block-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="sl-feed-block-label" style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: feedClub.color, paddingRight: '8px', whiteSpace: 'nowrap' }}>Podcasts</span>
                    <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                  </div>
                  <div id="sl-feed-podcasts-grid" className="sl-feed-podcasts-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))', gap: '10px', width: '100%', minWidth: 0 }}>
                    {podcastItems.map((p, i) => (
                      <div key={i} id={`sl-feed-podcast-${i + 1}`} className="sl-feed-podcast-card" style={{ display: 'flex', gap: isMobile ? '10px' : '12px', alignItems: 'center', padding: isMobile ? '10px' : '12px', border: '1px solid #e8e8e8', borderRadius: '12px', background: '#f8f8f8', minWidth: 0, width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                        {/* Artwork with play overlay */}
                        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={p.thumb} alt={p.show} style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="8" height="9" viewBox="0 0 10 12" fill="none"><path d="M1 1l8 5-8 5V1z" fill="#0a0a0a" /></svg>
                            </div>
                          </div>
                        </div>
                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, color: feedClub.color, display: 'block', marginBottom: '3px', letterSpacing: '0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.show}</span>
                          <h4 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '13px', color: '#0a0a0a', margin: '0 0 6px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{p.title}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, overflow: 'hidden' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                            </svg>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#bbb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.duration}</span>
                            <span style={{ color: '#ddd', fontSize: '10px', flexShrink: 0 }}>·</span>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#bbb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social section */}
                <div id="sl-feed-social" className="sl-feed-social sl-feed-block" style={{ marginTop: '28px', paddingBottom: '28px' }}>
                  <div className="sl-feed-block-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="sl-feed-block-label" style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: feedClub.color, paddingRight: '8px', whiteSpace: 'nowrap' }}>Social</span>
                    <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                  </div>
                  <div id="sl-feed-social-scroll" className="sl-feed-social-scroll" style={{ overflowX: 'auto', scrollbarWidth: 'none', marginLeft: '-4px', paddingLeft: '4px' }}>
                    {liveSocial.length ? (
                      <SocialFeedEmbeds tweets={liveSocial} />
                    ) : (
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#888' }}>
                        {feedLoading ? 'Loading social…' : 'No social posts available for this club right now.'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Video — horizontal side-scroll ── */}
              <div id="sl-feed-videos" className="sl-feed-videos sl-feed-block" style={{ marginTop: '28px' }}>
                <div className="sl-feed-block-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span className="sl-feed-block-label" style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: feedClub.color }}>Video</span>
                  <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                </div>
                <div id="sl-feed-videos-scroll" className="sl-feed-videos-scroll" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
                  <div id="sl-feed-videos-list" className="sl-feed-videos-list" style={{ display: 'flex', gap: '16px', paddingBottom: '4px' }}>
                    {videoItems.map((v, i) => (
                      <div key={i} id={`sl-feed-video-${i + 1}`} className="sl-feed-video-card" style={{ flexShrink: 0, width: videoCardWidth }}>
                        {/* Thumbnail */}
                        <div style={{ width: videoCardWidth, aspectRatio: '16/9', background: '#111', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                          {v.thumbnailUrl ? (
                            <img src={v.thumbnailUrl} alt={v.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${feedClub.color}44 0%, #0a0a0a 100%)` }} />
                          )}
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                            <svg width="11" height="13" viewBox="0 0 12 14" fill="none"><path d="M1 1l10 6L1 13V1z" fill="#fff" /></svg>
                          </div>
                          {v.duration ? (
                            <span style={{ position: 'absolute', bottom: '7px', right: '8px', fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#fff', fontWeight: 700, background: 'rgba(0,0,0,0.6)', borderRadius: '3px', padding: '1px 4px', zIndex: 1 }}>{v.duration}</span>
                          ) : null}
                        </div>
                        {/* Episode title */}
                        <h4 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '13px', color: '#0a0a0a', margin: '0 0 7px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{v.title}</h4>
                        {/* Channel icon + name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: feedClub.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '7px', fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>{v.channelInitial}</span>
                          </div>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, color: '#444' }}>{v.channel}</span>
                        </div>
                        {/* Date */}
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#bbb' }}>{v.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
        </div>
      </section>


      {/* ── The App ── */}
      <TheAppSection px={px} isMobile={isMobile} accentColor={feedClub.color} />

      {/* ── Match Day Experience ── */}
      <MatchDaySection px={px} isMobile={isMobile} />

      {/* ── Footer ── */}
      <footer id="sl-footer" className="sl-footer sl-site-footer sl-section" style={{ background: '#0a0a0a', padding: `64px ${px} 40px`, marginTop: '40px' }}>

        {/* CTA row — H1 + badges + QR all inline */}
        <div id="sl-footer-cta" className="sl-footer-cta" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '28px' : '48px', paddingBottom: '48px' }}>
          <h2 id="sl-footer-cta-title" className="sl-footer-cta-title" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '32px' : '42px', color: '#fff', margin: 0, lineHeight: 1.05 }}>
            Your club is waiting.
          </h2>
          <div id="sl-footer-downloads" className="sl-footer-downloads sl-download-badges" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: isMobile ? '12px' : '28px', flexShrink: 0 }}>
            <AppStoreBadge id="sl-download-ios-footer" className="sl-download-ios" height={40} />
            <GooglePlayBadge id="sl-download-android-footer" className="sl-download-android" height={40} />
            {!isMobile && <img id="sl-footer-qr" className="sl-footer-qr sl-download-qr" src={qrWhiteImg} alt="Scan to download Sideline" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />}
          </div>
        </div>

        {/* Lower — all centered, stacked */}
        <div id="sl-footer-lower" className="sl-footer-lower" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', paddingTop: '48px', textAlign: 'center' }}>
          {/* Page links */}
          <nav id="sl-footer-nav" className="sl-footer-nav" aria-label="Footer" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {footerLinks.map((link) => (
              <a key={link.label} id={`sl-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`} className="sl-footer-link" href={link.href} style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{link.label}</a>
            ))}
          </nav>

          {/* Social icons */}
          <div id="sl-footer-social" className="sl-footer-social" aria-label="Social media" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a id="sl-footer-social-x" className="sl-footer-social-link sl-footer-social-x" href="https://x.com/TheSidelineClub" target="_blank" rel="noopener noreferrer" aria-label="Follow SideLine on X" style={{ display: 'flex', opacity: 0.5, transition: 'opacity 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.012 2.25h6.962l4.265 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="#fff"/>
              </svg>
            </a>
            <a id="sl-footer-social-instagram" className="sl-footer-social-link sl-footer-social-instagram" href="https://www.instagram.com/thesideline_club/" target="_blank" rel="noopener noreferrer" aria-label="Follow SideLine on Instagram" style={{ display: 'flex', opacity: 0.5, transition: 'opacity 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.75"/>
                <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="1.75"/>
                <circle cx="17.5" cy="6.5" r="1" fill="#fff"/>
              </svg>
            </a>
            <a id="sl-footer-social-linkedin" className="sl-footer-social-link sl-footer-social-linkedin" href="https://www.linkedin.com/company/thesideline/posts/" target="_blank" rel="noopener noreferrer" aria-label="Follow SideLine on LinkedIn" style={{ display: 'flex', opacity: 0.5, transition: 'opacity 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><circle cx="4" cy="4" r="2" stroke="#fff" strokeWidth="1.75"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <span id="sl-footer-copyright" className="sl-footer-copyright" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>© 2026 Sideline Sports Inc. All rights reserved.</span>

          {/* Disclaimer */}
          <p id="sl-footer-disclaimer" className="sl-footer-disclaimer" style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(255,255,255,0.18)', margin: 0, lineHeight: 1.65, maxWidth: '600px' }}>
            Third-party names, trademarks and imagery are used solely for identification and editorial purposes. Their use does not imply endorsement or affiliation with Sideline.
          </p>
        </div>
      </footer>

    </div>
  )
}

function BrandGuidelines() {
  const [activeSection, setActiveSection] = useState('cover')
  const isMobile = useIsMobile()
  const bgPx = isMobile ? '20px' : '72px'

  const NAV_ITEMS = [
    { id: 'cover',      label: 'Overview' },
    { id: 'principles', label: '01  Design Principles' },
    { id: 'color',      label: '02  Color' },
    { id: 'typography', label: '03  Typography' },
    { id: 'doublerule', label: '04  The Double Rule' },
    { id: 'social',     label: '05  Social Templates' },
    { id: 'email',      label: '06  Email System' },
    { id: 'dosdont',    label: "07  Do / Don't" },
    { id: 'voice',      label: '08  Voice & Tone' },
  ]

  function scrollTo(id: string) {
    setActiveSection(id)
    document.getElementById('bg-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const rule = (color = '#0a0a0a') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ height: '2px', background: color }} />
      <div style={{ height: '1px', background: color }} />
    </div>
  )

  const sectionLabel = (text: string) => (
    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888' }}>{text}</span>
  )

  const sectionTitle = (text: string) => (
    <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '28px', color: '#0a0a0a', margin: '6px 0 0', lineHeight: 1.15 }}>{text}</h2>
  )

  const primaryColors = [
    { name: 'Primary Black', hex: '#0A0A0A', use: 'Headlines, body text, UI elements', dark: true },
    { name: 'Primary White', hex: '#FFFFFF', use: 'Backgrounds, reversed type', dark: false, border: true },
    { name: 'Canvas', hex: '#E2E0DC', use: 'App shell background', dark: false },
    { name: 'Dim', hex: '#6B6B6B', use: 'Secondary text, captions', dark: true },
  ]

  const clubColorSample = CLUBS.slice(0, 12)

  const typeSpecimen = [
    { label: 'Display — Lora 700', sample: 'Your club.', style: { fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '52px', letterSpacing: '-1px', lineHeight: 1.05, color: '#0a0a0a' } },
    { label: 'Heading — Lora 700', sample: 'The tactical shift that changed everything.', style: { fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '26px', lineHeight: 1.2, color: '#0a0a0a' } },
    { label: 'Sub-heading — Lora 600', sample: 'From the Feed', style: { fontFamily: "'Lora', serif", fontWeight: 600, fontSize: '18px', lineHeight: 1.3, color: '#0a0a0a' } },
    { label: 'UI Label — Inter 700', sample: 'LIVERPOOL · ANALYSIS', style: { fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#888' } },
    { label: 'Body — Inter 400', sample: "Sideline brings together trusted voices and the biggest stories around your team, all editorially vetted and personalized to you.", style: { fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '14px', lineHeight: 1.7, color: '#444' } },
    { label: 'Wordmark — Figtree 900', sample: 'Sideline', style: { fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '48px', letterSpacing: '-2px', lineHeight: 1, color: '#0a0a0a' } },
  ]

  const principles = [
    { n: '01', title: 'Editorial first', body: 'Every design decision defers to the content. Typography, spacing, and hierarchy are borrowed from print — not social media. If a layout competes with the text, the layout loses.' },
    { n: '02', title: 'Black and white as primary palette', body: 'Sideline lives in black and white. Club colors are guests — introduced only when content is specifically about that club, never decoratively. The double-rule motif is the connective tissue.' },
    { n: '03', title: 'The double-rule', body: "A thick rule (2px) over a thin rule (1px) with a 3px gap. Used consistently at section breaks, in email mastheads, on email signatures, and wherever a divider is needed. It is the brand's most distinctive single element." },
    { n: '04', title: 'Typography is hierarchy', body: 'Lora serif carries all editorial weight — headlines, article titles, section headings. Inter handles all UI — labels, captions, metadata, buttons. Figtree 900 is reserved exclusively for the Sideline wordmark.' },
    { n: '05', title: 'Club color discipline', body: 'When a club color appears, it should feel earned. Use it on tags, category labels, accent bands, and selector states. Never use it as a background for large areas of neutral UI.' },
    { n: '06', title: 'Restraint in motion', body: 'Transitions are short (0.12–0.18s) and purposeful. Color-state changes on club selectors and mode toggles. No decorative animation.' },
  ]

  const dosDonts = [
    { do: 'Use Lora for all editorial headlines', dont: "Use Inter or Figtree for article headings" },
    { do: 'Apply club colors to labels and accent bands only', dont: 'Fill large UI sections with club colors' },
    { do: 'Use the double-rule at section breaks', dont: 'Use single lines or heavy borders as dividers' },
    { do: 'Keep body text in Inter at 13–15px, 1.65–1.7 leading', dont: 'Set body copy in serif or below 12px' },
    { do: 'Use Figtree 900 for the wordmark only', dont: 'Use Figtree for body copy or UI labels' },
    { do: 'Let white space breathe between sections', dont: 'Compress padding to fit more content' },
  ]

  const contentTemplates = [
    { type: 'Brand Statement', bg: '#000', fg: '#fff', accent: undefined as string | undefined, label: 'Black ground · Figtree 900', desc: 'Oversized wordmark or short brand declaration. White type on black. No imagery. Used for launch posts, announcements, and brand-first moments.' },
    { type: 'Product Frame', bg: '#fff', fg: '#000', accent: undefined as string | undefined, label: 'White or dark field · App asset', desc: 'App screenshot or UI element fills the frame cleanly. No embellishment. Shows the product honestly. Used to demonstrate features.' },
    { type: 'Editorial Card', bg: '#0a0a0a', fg: '#fff', accent: '#C8102E', label: 'Dark ground · Lora serif · Club accent band', desc: 'Lora headline anchored to the bottom. Club-color accent band (3–4px). Corner Sideline signature. Used for match reports, analysis, big reads.' },
    { type: 'Conversation', bg: '#fff', fg: '#000', accent: undefined as string | undefined, label: 'White ground · Figtree 900 · Minimal', desc: 'Bold question centered in the frame. Participation prompt below. No imagery. Used to invite fan engagement and community response.' },
  ]

  const emailComponents = [
    { title: 'Masthead', desc: 'Double-rule above and below the Sideline wordmark. Edition label left, date or issue number right. Sets the editorial register for everything that follows.' },
    { title: 'Club color band', desc: 'A full-width band in the club\'s primary color appears above the masthead on club-specific newsletters. The newsletter name (e.g. "Arsenal Insider") appears in the on-color type.' },
    { title: 'Lead article', desc: 'Full-width 16:9 photo with a black label bar at the bottom. Lora headline at 28px. Byline with short rule. "Read Story" pill button.' },
    { title: 'Stories section', desc: 'Section opened with the double-rule motif and an uppercase Inter label. Three articles per section separated by hairline rules. Each ends with a "Read →" affordance.' },
    { title: 'Email signature', desc: 'Vertical club-color double-rule (3px + 1.5px) left of the wordmark. Single grey hairline divides wordmark from contact info. DOWNLOAD APP link in club color.' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: '1340px', margin: '0 auto' }}>

      {/* Rail nav — desktop only */}
      {!isMobile && <div style={{ width: '200px', flexShrink: 0, position: 'sticky', top: '64px', padding: '48px 24px 48px 32px', alignSelf: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: activeSection === item.id ? 700 : 400,
                color: activeSection === item.id ? '#0a0a0a' : '#999',
                background: 'transparent',
                border: 'none',
                borderLeft: `2px solid ${activeSection === item.id ? '#0a0a0a' : '#e0e0e0'}`,
                padding: '5px 0 5px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.12s',
                lineHeight: 1.4,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>}

      {/* Main content */}
      <div style={{ flex: 1, background: '#fff', minWidth: 0 }}>

      {/* Cover */}
      <div id="bg-cover" style={{ background: '#fff', padding: `32px ${bgPx} 0` }}>
        {rule()}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '28px 0 24px' }}>
          <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: isMobile ? '52px' : '96px', lineHeight: 1, letterSpacing: isMobile ? '-2px' : '-4px', color: '#0a0a0a', userSelect: 'none', marginLeft: '-7px' }}>
            Sideline
          </div>
          <div style={{ textAlign: 'right', paddingBottom: '12px' }}>
            <div style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: isMobile ? '16px' : '26px', color: '#0a0a0a', lineHeight: 1.2 }}>2026 Brand Guidelines</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '8px' }}>Confidential</div>
          </div>
        </div>
        {rule()}
      </div>

      {/* Design Principles */}
      <div id="bg-principles" style={{ padding: `0 ${bgPx} 0` }}>
        <div style={{ padding: '12px 0 40px' }}>
          {sectionLabel('01 — Design Principles')}
          {sectionTitle('What Sideline stands for')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0' }}>
          {principles.map((p, i) => (
            <div key={i} style={{ padding: isMobile ? '20px 0 24px' : '24px 32px 28px', borderRight: !isMobile && i % 2 === 0 ? '1px solid #e8e8e8' : 'none', borderTop: (isMobile ? i > 0 : i >= 2) ? '1px solid #e8e8e8' : 'none' }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#bbb', marginBottom: '12px' }}>{p.n}</div>
              <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '17px', color: '#0a0a0a', margin: '0 0 10px', lineHeight: 1.25 }}>{p.title}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.7 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Color */}
      <div id="bg-color" style={{ padding: `64px ${bgPx} 0` }}>
        {rule()}
        <div style={{ padding: '12px 0 40px' }}>
          {sectionLabel('02 — Color')}
          {sectionTitle('Black, white, and earned color')}
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Primary Palette</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px' }}>
            {primaryColors.map(c => (
              <div key={c.hex}>
                <div style={{ height: '80px', background: c.hex, border: c.border ? '1px solid #e8e8e8' : 'none', borderRadius: '4px', marginBottom: '10px', display: 'flex', alignItems: 'flex-end', padding: '10px 12px' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, color: c.dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', letterSpacing: '0.06em' }}>{c.hex}</span>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0a0a0a', marginBottom: '3px' }}>{c.name}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#777', lineHeight: 1.5 }}>{c.use}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '12px' }}>Club Colors — used only in club-specific contexts</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: '8px' }}>
            {clubColorSample.map(cl => (
              <div key={cl.id}>
                <div style={{ height: '36px', background: cl.color, borderRadius: '3px', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '8px', fontWeight: 700, color: cl.onColor, letterSpacing: '0.06em' }}>{cl.color}</span>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, color: '#0a0a0a' }}>{cl.name}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#888', marginTop: '12px', fontStyle: 'italic' }}>+ 9 more clubs. Full palette in the Email Templates and Email Signature tabs.</div>
        </div>
      </div>

      {/* Typography */}
      <div id="bg-typography" style={{ padding: `64px ${bgPx} 0` }}>
        {rule()}
        <div style={{ padding: '12px 0 40px' }}>
          {sectionLabel('03 — Typography')}
          {sectionTitle('Three typefaces, one system')}
        </div>

        <div style={{ marginBottom: '32px', padding: '20px 28px', background: '#f7f6f4', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
            {[
              { face: 'Lora', weight: '600, 700, 700i', role: 'Editorial — Headlines, articles, section headings' },
              { face: 'Inter', weight: '400, 500, 600, 700', role: 'UI — Labels, body copy, metadata, buttons' },
              { face: 'Figtree', weight: '900 only', role: 'Wordmark — "Sideline" logotype exclusively' },
            ].map(f => (
              <div key={f.face}>
                <div style={{ fontFamily: f.face === 'Lora' ? "'Lora', serif" : f.face === 'Inter' ? "'Inter', sans-serif" : "'Figtree', sans-serif", fontWeight: f.face === 'Figtree' ? 900 : 700, fontSize: f.face === 'Figtree' ? '32px' : '28px', color: '#0a0a0a', letterSpacing: f.face === 'Figtree' ? '-1px' : '0', marginBottom: '8px' }}>{f.face}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{f.weight}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#666', lineHeight: 1.5 }}>{f.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {typeSpecimen.map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: isMobile ? '6px' : '32px', alignItems: 'center', padding: '22px 0', borderTop: i > 0 ? '1px solid #ebebeb' : 'none' }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.5 }}>{t.label}</div>
              <div style={t.style}>{t.sample}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The Double Rule */}
      <div id="bg-doublerule" style={{ padding: `64px ${bgPx} 0` }}>
        {rule()}
        <div style={{ padding: '12px 0 40px' }}>
          {sectionLabel('04 — The Double Rule')}
          {sectionTitle("The brand's signature divider")}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '48px', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: 1.7, color: '#444', margin: '0 0 28px' }}>
              The double-rule — a 2px rule over a 1px rule with a 3px gap — is the most distinctive single mark in the Sideline design system. It appears wherever a structural break is needed: email mastheads, homepage section dividers, email signatures.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: 1.7, color: '#444', margin: '0 0 28px' }}>
              The motif is borrowed from the editorial tradition of broadsheet newspapers, where double rules signaled the separation between sections of differing weight.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: 1.65, color: '#888', margin: 0 }}>
              Never use a single rule where a double rule belongs. Never vary the weights or gap. In email clients where vertical rules are needed (email signature), the same 2:1 weight ratio applies — 3px thick, 1.5px thin, 2px gap.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>Horizontal (section breaks, mastheads)</div>
              {rule()}
              <div style={{ padding: '20px 0', fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '22px', color: '#0a0a0a' }}>Section Heading</div>
              {rule()}
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>Vertical (email signature)</div>
              <div style={{ display: 'flex', gap: '2px', height: '60px' }}>
                <div style={{ width: '3px', background: '#EF0107' }} />
                <div style={{ width: '1.5px', background: '#EF0107' }} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>Specs</div>
              {[['Thick rule', '2px height'], ['Thin rule', '1px height'], ['Gap between', '3px'], ['Color', 'Matches context (black, white, or club color)']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderTop: '1px solid #f0f0f0' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, color: '#444' }}>{k}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#888' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Content Templates */}
      <div id="bg-social" style={{ padding: `64px ${bgPx} 0` }}>
        {rule()}
        <div style={{ padding: '12px 0 40px' }}>
          {sectionLabel('05 — Social Content Templates')}
          {sectionTitle('Four post formats, one visual voice')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
          {contentTemplates.map(ct => (
            <div key={ct.type}>
              <div style={{ aspectRatio: '1', background: ct.bg, border: ct.bg === '#fff' ? '1px solid #e8e8e8' : 'none', borderRadius: '4px', marginBottom: '14px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                {ct.type === 'Brand Statement' && <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '20px', color: ct.fg, letterSpacing: '-0.5px', textAlign: 'center', lineHeight: 1.1 }}>Your club.<br />Your news.</div>}
                {ct.type === 'Product Frame' && (
                  <div style={{ position: 'absolute', bottom: '-38%', left: '50%', transform: 'translateX(-50%)', width: '58%' }}>
                    <svg viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
                      {/* Phone body */}
                      <rect x="4" y="0" width="92" height="180" rx="14" fill="#0a0a0a" />
                      {/* Screen */}
                      <rect x="9" y="10" width="82" height="158" rx="10" fill="#1a1a1a" />
                      {/* Screen content — coloured UI rows suggesting a feed */}
                      <rect x="14" y="18" width="30" height="5" rx="2" fill="#E8C442" opacity="0.7" />
                      <rect x="14" y="26" width="52" height="4" rx="2" fill="#fff" opacity="0.12" />
                      <rect x="14" y="34" width="40" height="4" rx="2" fill="#fff" opacity="0.08" />
                      <rect x="14" y="46" width="72" height="38" rx="4" fill="#fff" opacity="0.07" />
                      <rect x="18" y="50" width="28" height="3" rx="1.5" fill="#C8102E" opacity="0.7" />
                      <rect x="18" y="56" width="52" height="3" rx="1.5" fill="#fff" opacity="0.18" />
                      <rect x="18" y="62" width="38" height="3" rx="1.5" fill="#fff" opacity="0.10" />
                      <rect x="14" y="90" width="72" height="38" rx="4" fill="#fff" opacity="0.07" />
                      <rect x="18" y="94" width="22" height="3" rx="1.5" fill="#EF0107" opacity="0.6" />
                      <rect x="18" y="100" width="50" height="3" rx="1.5" fill="#fff" opacity="0.15" />
                      <rect x="18" y="106" width="34" height="3" rx="1.5" fill="#fff" opacity="0.08" />
                      {/* Notch */}
                      <rect x="36" y="4" width="28" height="5" rx="2.5" fill="#000" />
                    </svg>
                  </div>
                )}
                {ct.type === 'Editorial Card' && (
                  <>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: ct.accent ? '7px' : '0', left: 0, right: 0, padding: '0 12px 12px', zIndex: 1 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '7px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ct.accent, display: 'block', marginBottom: '4px' }}>Liverpool · Analysis</span>
                      <div style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '11px', color: '#fff', lineHeight: 1.3 }}>The tactical shift making Liverpool impossible to press</div>
                    </div>
                    {ct.accent && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: ct.accent }} />}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '8px', color: 'rgba(255,255,255,0.22)' }}>Sideline</div>
                  </>
                )}
                {ct.type === 'Conversation' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '14px', color: ct.fg, lineHeight: 1.2, letterSpacing: '-0.3px' }}>Who wins the league this season?</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '8px', color: 'rgba(0,0,0,0.35)', marginTop: '8px' }}>Drop your pick ↓</div>
                  </div>
                )}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0a0a0a', marginBottom: '3px' }}>{ct.type}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#888', marginBottom: '6px', letterSpacing: '0.02em' }}>{ct.label}</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#555', margin: 0, lineHeight: 1.6 }}>{ct.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email System */}
      <div id="bg-email" style={{ padding: `64px ${bgPx} 0` }}>
        {rule()}
        <div style={{ padding: '12px 0 40px' }}>
          {sectionLabel('06 — Email System')}
          {sectionTitle('Consistent components across all sends')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {emailComponents.map((ec, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '180px 1fr', gap: isMobile ? '6px' : '40px', padding: '22px 0', borderTop: i > 0 ? '1px solid #ebebeb' : 'none', alignItems: 'start' }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '0.04em' }}>{ec.title}</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.7 }}>{ec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Do / Don't */}
      <div id="bg-dosdont" style={{ padding: `64px ${bgPx} 0` }}>
        {rule()}
        <div style={{ padding: '12px 0 40px' }}>
          {sectionLabel('07 — Do / Don\'t')}
          {sectionTitle('Rules worth repeating')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0' }}>
          <div style={{ paddingRight: isMobile ? '0' : '40px', borderRight: isMobile ? 'none' : '1px solid #e8e8e8', marginBottom: isMobile ? '32px' : '0' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2a7a2a', marginBottom: '16px' }}>Do</div>
            {dosDonts.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderTop: i > 0 ? '1px solid #f0f0f0' : 'none', alignItems: 'flex-start' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#e8f5e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <svg width="8" height="8" viewBox="0 0 10 10"><polyline points="1.5 5 4 7.5 8.5 2.5" stroke="#2a7a2a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#333', lineHeight: 1.55 }}>{d.do}</span>
              </div>
            ))}
          </div>
          <div style={{ paddingLeft: isMobile ? '0' : '40px' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '16px' }}>Don't</div>
            {dosDonts.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderTop: i > 0 ? '1px solid #f0f0f0' : 'none', alignItems: 'flex-start' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fde8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <svg width="8" height="8" viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" /><line x1="8" y1="2" x2="2" y2="8" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#333', lineHeight: 1.55 }}>{d.dont}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voice & Tone */}
      <div id="bg-voice" style={{ padding: `64px ${bgPx} 0` }}>
        {rule()}
        <div style={{ padding: '12px 0 40px' }}>
          {sectionLabel('08 — Voice & Tone')}
          {sectionTitle('How Sideline sounds')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '28px' : '48px' }}>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: 1.7, color: '#444', margin: '0 0 24px' }}>
              Sideline is written from the perspective of an informed, opinionated friend who happens to know football very well. Not a broadcaster. Not a tabloid. Not an algorithm.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: 1.7, color: '#444', margin: 0 }}>
              Copy is direct and confident. It respects the reader's intelligence. It takes a point of view. It never hedges for the sake of neutrality, and it never shouts for engagement.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { attr: 'Authoritative', not: 'Arrogant', desc: "We know what we're talking about, but we never condescend." },
              { attr: 'Passionate', not: 'Tribal', desc: 'We love the game deeply. We don\'t pick sides against clubs.' },
              { attr: 'Editorial', not: 'Corporate', desc: 'Every line feels considered. No filler, no boilerplate.' },
              { attr: 'Direct', not: 'Blunt', desc: 'We say what we mean clearly. We\'re never curt or cold.' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0a0a0a' }}>{v.attr}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#bbb' }}>not {v.not}</div>
                </div>
                <div style={{ width: '1px', background: '#e0e0e0', alignSelf: 'stretch', flexShrink: 0, marginLeft: '4px' }} />
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#666', margin: 0, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ margin: `64px ${bgPx} 0`, paddingBottom: '72px' }}>
        {rule()}
        <div style={{ padding: '32px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: '28px', letterSpacing: '-1px', color: '#0a0a0a', marginBottom: '6px' }}>Sideline</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#aaa', letterSpacing: '0.06em' }}>Brand Guidelines · 2026</div>
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#aaa' }}>Questions: design@sideline.global</div>
        </div>
      </div>
      </div> {/* end main content */}
    </div>
  )
}

function DesignKitApp() {
  const [activeTab, setActiveTab] = useState<'signature' | 'templates' | 'social' | 'homepage' | 'guidelines'>('homepage')
  const isMobile = useIsMobile()

  return (
    <div style={{ minHeight: '100vh', background: '#E2E0DC' }} translate="no">
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1f1f1f', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ padding: '0 16px 0 20px', display: 'flex', alignItems: 'stretch', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: '20px', borderRight: '1px solid #2a2a2a', marginRight: '4px', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 900, fontSize: isMobile ? '16px' : '20px', color: '#fff', letterSpacing: '-0.5px' }}>Sideline</span>
          </div>
          <nav style={{ display: 'flex', flexShrink: 0 }}>
            {([
              { id: 'homepage', label: 'Homepage' },
              { id: 'guidelines', label: 'Brand Guidelines' },
              { id: 'templates', label: 'Email Templates' },
              { id: 'social', label: 'Social Moodboard' },
              { id: 'signature', label: 'Email Signature' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  color: activeTab === tab.id ? '#fff' : '#555',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? '#fff' : 'transparent'}`,
                  padding: isMobile ? '16px 14px 14px' : '22px 22px 20px',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'signature' && <EmailSignatureBuilder />}
      {activeTab === 'templates' && <EmailTemplatesTab />}
      {activeTab === 'social' && <SocialMoodboard />}
      {activeTab === 'homepage' && <HomepageMockup />}
      {activeTab === 'guidelines' && <BrandGuidelines />}
    </div>
  )
}

const showDesignKit =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('kit')

export default function App() {
  if (showDesignKit) {
    return <div id="sl-design-kit" className="sl-design-kit"><DesignKitApp /></div>
  }

  return (
    <div id="sl-app" className="sl-app">
      <HomepageMockup />
    </div>
  )
}
