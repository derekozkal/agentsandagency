#!/usr/bin/env python3
"""Tell search engines which pages changed, using IndexNow.

Bing runs IndexNow, and the engines that take part share submissions with
each other. The workflow in .github/workflows/indexnow.yml runs this after
every push to main. Google does not use IndexNow; Search Console covers it.

The key below must match the file 46569b828d3a91191af6266770ae6a0a.txt at
the site root. Keep that file. If you delete it, submissions stop working.
"""
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

HOST = "agentsandagency.com"
SITE = "https://agentsandagency.com/"
KEY = "46569b828d3a91191af6266770ae6a0a"
KEY_LOCATION = SITE + KEY + ".txt"
ENDPOINTS = ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"]
SKIP = {"404.html", "robots.txt", KEY + ".txt"}


def sitemap_urls():
    with open("sitemap.xml", encoding="utf-8") as f:
        return re.findall(r"<loc>\s*(.*?)\s*</loc>", f.read())


def url_for(path):
    """Map a changed file in the repo to its public URL, or None."""
    if path in SKIP or path.startswith((".github/", "assets/")):
        return None
    if path == "index.html":
        return SITE
    if path.endswith("/index.html"):
        return SITE + path[: -len("index.html")]
    if path.endswith((".html", ".pdf", ".txt")):
        return SITE + path
    return None


def changed_urls():
    before = os.environ.get("BEFORE", "")
    if os.environ.get("EVENT") != "push" or not before or set(before) == {"0"}:
        return sitemap_urls()
    try:
        changed = subprocess.run(
            ["git", "diff", "--name-only", "--diff-filter=AM", before, "HEAD"],
            check=True, capture_output=True, text=True,
        ).stdout.split()
    except subprocess.CalledProcessError:
        return sitemap_urls()
    # A new sitemap or a change to this tooling: send everything once.
    if any(p == "sitemap.xml" or p.startswith(".github/") for p in changed):
        return sitemap_urls()
    urls = []
    for path in changed:
        url = url_for(path)
        if url and url not in urls:
            urls.append(url)
    return urls


def submit(urls):
    body = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }).encode("utf-8")
    for endpoint in ENDPOINTS:
        request = urllib.request.Request(
            endpoint, data=body, method="POST",
            headers={"Content-Type": "application/json; charset=utf-8"},
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                print(f"{endpoint}: HTTP {response.status}")
                return response.status
        except urllib.error.HTTPError as err:
            print(f"{endpoint}: HTTP {err.code} {err.read()[:200]!r}")
            if err.code in (400, 403, 422):
                return err.code  # a setup problem; another endpoint won't fix it
        except urllib.error.URLError as err:
            print(f"{endpoint}: {err.reason}")
    return None


if __name__ == "__main__":
    urls = changed_urls()
    if not urls:
        print("No page changes to report.")
        sys.exit(0)
    print(f"Submitting {len(urls)} URL(s):")
    for url in urls:
        print("  " + url)
    status = submit(urls)
    # 200 = received, 202 = received while the key is still being checked.
    # Fail loudly only on setup errors, so a busy endpoint never sends alerts.
    sys.exit(1 if status in (400, 403, 422) else 0)
