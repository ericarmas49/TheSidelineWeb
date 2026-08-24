# Sideline — Universal Links & App Links on Vercel

Deploy iOS Universal Links and Android App Links verification files on **https://thesideline.club/** (Vercel, DNS on Namecheap).

## Expo app (separate repo)

- Links like `https://thesideline.club/club/arsenal?tab=matches`
- Registers `applinks:thesideline.club` and Android intent filters for `/club/*`
- Bundle ID: `com.thesidelineapp.app` (iOS + Android production)

## Files (this repo)

This site is static with files at the **project root** (not `public/`). Serve from:

- `.well-known/apple-app-site-association` (no extension)
- `.well-known/assetlinks.json`

### apple-app-site-association

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.thesidelineapp.app",
        "paths": ["/club/*", "/club-feed", "/club-feed/*"]
      }
    ]
  }
}
```

### assetlinks.json

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.thesidelineapp.app",
      "sha256_cert_fingerprints": ["SHA256_CERT_FINGERPRINT"]
    }
  }
]
```

## Placeholders

| Placeholder | Source |
|-------------|--------|
| `TEAM_ID` | Apple Developer → Membership → Team ID (10 chars) |
| `SHA256_CERT_FINGERPRINT` | Play Console → Setup → App integrity → App signing key (with colons) |

## vercel.json headers

Merge into existing `headers` array (do not remove asset cache rules):

```json
{
  "source": "/.well-known/apple-app-site-association",
  "headers": [{ "key": "Content-Type", "value": "application/json" }]
},
{
  "source": "/.well-known/assetlinks.json",
  "headers": [{ "key": "Content-Type", "value": "application/json" }]
}
```

No rewrites or middleware on this site — `.well-known/*` is served as static files.

## Verification after deploy

```bash
curl -sI https://thesideline.club/.well-known/apple-app-site-association
curl -s https://thesideline.club/.well-known/apple-app-site-association | jq .
curl -sI https://thesideline.club/.well-known/assetlinks.json
curl -s https://thesideline.club/.well-known/assetlinks.json | jq .
```

Optional: [Google Digital Asset Links validator](https://developers.google.com/digital-asset-links/tools/generator)

## Requirements

- HTTP 200, no redirects
- HTTPS, public, no auth
- Apex `thesideline.club` must work
