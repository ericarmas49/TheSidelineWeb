import arsenalLogo from '@/imports/club-logos/arsenal.png'
import astonVillaLogo from '@/imports/club-logos/aston-villa.png'
import bournemouthLogo from '@/imports/club-logos/bournemouth.png'
import brentfordLogo from '@/imports/club-logos/brentford.png'
import brightonLogo from '@/imports/club-logos/brighton-and-hove-albion.png'
import chelseaLogo from '@/imports/club-logos/chelsea.png'
import coventryLogo from '@/imports/club-logos/coventry-city.png'
import crystalPalaceLogo from '@/imports/club-logos/crystal-palace.png'
import evertonLogo from '@/imports/club-logos/everton.png'
import fulhamLogo from '@/imports/club-logos/fulham.png'
import hullCityLogo from '@/imports/club-logos/hull-city.png'
import ipswichLogo from '@/imports/club-logos/ipswich-town.png'
import leedsUnitedLogo from '@/imports/club-logos/leeds-united.png'
import liverpoolLogo from '@/imports/club-logos/liverpool.png'
import manchesterCityLogo from '@/imports/club-logos/manchester-city.png'
import manchesterUnitedLogo from '@/imports/club-logos/manchester-united.png'
import newcastleLogo from '@/imports/club-logos/newcastle-united.png'
import nottinghamForestLogo from '@/imports/club-logos/nottingham-forest.png'
import sunderlandLogo from '@/imports/club-logos/sunderland.png'
import tottenhamLogo from '@/imports/club-logos/tottenham-hotspur.png'
import westHamLogo from '@/imports/club-logos/west-ham-united.png'
import wolvesLogo from '@/imports/club-logos/wolverhampton-wanderers.png'
import premierLeagueLogo from '@/imports/club-logos/premier-league.png'

export const CLUB_LOGOS: Record<string, string> = {
  ars: arsenalLogo,
  avl: astonVillaLogo,
  bou: bournemouthLogo,
  bre: brentfordLogo,
  bha: brightonLogo,
  che: chelseaLogo,
  cov: coventryLogo,
  cry: crystalPalaceLogo,
  eve: evertonLogo,
  ful: fulhamLogo,
  hul: hullCityLogo,
  ips: ipswichLogo,
  lee: leedsUnitedLogo,
  liv: liverpoolLogo,
  mci: manchesterCityLogo,
  mun: manchesterUnitedLogo,
  new: newcastleLogo,
  nfo: nottinghamForestLogo,
  sun: sunderlandLogo,
  tot: tottenhamLogo,
  whu: westHamLogo,
  wol: wolvesLogo,
}

export { premierLeagueLogo }

export function getClubLogo(clubId: string): string {
  return CLUB_LOGOS[clubId] ?? premierLeagueLogo
}
