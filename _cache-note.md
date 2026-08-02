# Cache busting

`site.css` and `site.js` are linked with a content hash:

    <link rel="stylesheet" href="site.css?v=652a2f3f">
    <script src="site.js?v=1b60ac41" defer></script>

The hash is the first 8 characters of the file's MD5. When the file changes, the
hash changes, the URL changes, and every browser fetches the new copy. A stale
version can no longer be served.

**If you edit site.css or site.js by hand, regenerate the hashes:**

    md5sum site.css site.js

then update the `?v=` value in all eight HTML files.

## Why this matters here

While the CSS was inlined in each page, editing a style automatically
invalidated the cache, because the HTML itself had changed. Extracting the
shared stylesheet removed that safety net: the HTML could be identical while
`site.css` had changed underneath it, and browsers would keep serving the old
stylesheet. That is why a font change could appear not to have taken effect.
