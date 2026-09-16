/** Map Figma homepage club ids to SideLineAPI club codes. */
export const FIGMA_ID_TO_API_CODE: Record<string, string> = {
  ars: 'ARS',
  avl: 'AVL',
  bou: 'BOU',
  bre: 'BRE',
  bha: 'BHA',
  che: 'CHE',
  cov: 'COV',
  cry: 'CRY',
  eve: 'EVE',
  ful: 'FUL',
  hul: 'HUL',
  ips: 'IPS',
  lee: 'LEE',
  liv: 'LFC',
  mci: 'MCI',
  mun: 'MUN',
  new: 'NEW',
  nfo: 'NFO',
  sun: 'SUN',
  tot: 'TOT',
}

export function getApiClubCode(figmaClubId: string): string | null {
  return FIGMA_ID_TO_API_CODE[figmaClubId] ?? null
}
