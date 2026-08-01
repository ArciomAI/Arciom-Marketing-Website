# Clean URLs

## Done — the homepage

All internal links now point at `/` instead of `index.html`. Web servers serve
`index.html` automatically at a directory root, so `arciom.com/` already works.
Nothing further is needed for the homepage on any host.

## Remaining — dropping `.html` from the other pages

To turn `arciom.com/why-arciom.html` into `arciom.com/why-arciom`, the server has
to be told to resolve extensionless paths. How depends on where it is hosted.

**Netlify, Vercel, Cloudflare Pages, GitHub Pages**
Already automatic. Both URLs resolve; just change the links in the HTML and set
the canonical tags to match.

**Netlify — force a redirect so the old URLs do not stay indexed**
`_redirects` at the site root:
```
/why-arciom.html   /why-arciom   301!
/about.html        /about        301!
/faq.html          /faq          301!
```

**Vercel** — `vercel.json`:
```json
{ "cleanUrls": true, "trailingSlash": false }
```

**Apache** — `.htaccess`:
```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
RewriteCond %{THE_REQUEST} \s/+(.+)\.html[\s?] [NC]
RewriteRule ^ /%1 [R=301,L]
```

**Nginx**
```
location / { try_files $uri $uri.html $uri/ =404; }
```

**Any static host, no config** — use folders instead:
`why-arciom/index.html` serves at `/why-arciom`.

## If you make the change, update these too

- Internal `href`s in all eight pages
- `<link rel="canonical">` in every `<head>`
- `sitemap.xml`
- `og:url` in every `<head>`

Search engines treat `/page` and `/page.html` as two different URLs, so leaving
both live without a 301 splits ranking between them.
