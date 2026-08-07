ARCIOM WEBSITE — COMPLETE FILE SET
===================================

This is everything. Replace your repo contents with these files.


WHAT GOES WHERE
---------------

Top level of the repo (alongside index.html):

    index.html              Homepage
    why-arciom.html         Why Arciom
    about.html              About
    faq.html                FAQ
    request-a-demo.html     Demo form
    thank-you.html          Shown after the form is submitted
    privacy.html            Privacy Policy
    terms.html              Terms of Service

    site.css                Shared styles for every page
    site.js                 Shared behaviour for every page

    favicon.svg             Browser tab icon
    favicon.ico
    favicon-32.png
    favicon-192.png
    apple-touch-icon.png
    site.webmanifest
    og-image.png            Preview card when a link is shared

    sitemap.xml
    robots.txt
    .vercelignore           Keeps internal notes off the live site

Inside a folder called "api":

    api/request-demo.js     Receives the form and sends the email

Inside a folder called "team":

    team/*.jpg              Six headshots

Not published (listed in .vercelignore, safe to keep in the repo):

    README.txt              This file
    SETUP.txt               Resend setup steps
    _hosting-notes.md       Clean URL options per host
    _cache-note.md          How the cache busting works
    about-linked.html       Alternate About that loads headshots from team/
    brand-system.html       Internal style guide


HOW TO UPDATE GITHUB
--------------------

Easiest: delete the old files and upload these.

1. In your repo, click "Add file" then "Upload files"
2. Drag in everything from the top level of this folder
3. Drag the "api" folder in as well, keeping its name
4. Drag the "team" folder in as well
5. Commit

GitHub will replace any file with a matching name. If a file you no longer
need is left behind, delete it individually.

Vercel redeploys automatically, usually within a minute. Check
Deployments and wait for "Ready" before testing.


BEFORE THE FORM WILL WORK
--------------------------

The form needs one more thing: an email service.

1. Sign up at resend.com and create an API key (starts with re_)
2. In Vercel, go to Settings then Environment Variables
3. Add RESEND_API_KEY with that value, ticked for all three environments
4. Go to Deployments and click Redeploy on the newest one

That redeploy matters. Vercel only reads environment variables when it
builds, so adding a key without redeploying changes nothing.

Full detail is in SETUP.txt.


STILL OUTSTANDING
-----------------

  Legal        Six FAQ answers are flagged for counsel review in the source.
               Privacy and Terms are complete but not yet reviewed.
  Analytics    Nothing is tracking visitors on any page.
  Login        The Login link in the navigation points nowhere.
  People       Doug and Jason have placeholder cards on the About page.
