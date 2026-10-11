# agentsandagency.com

A small static site. No build step, no framework, no hosting bill.

- `index.html` : home. Intro, the Legacy Project feature, links into each section, and About.
- `writing.html` : Substack essays, Kauffman pieces, and earlier journalism.
- `research.html` : scholars funded, papers that acknowledge the work, and initiatives.
- `media.html` : photos, videos (thumbnails load from YouTube), and the podcast.
- `lab.html` : the Lab. Atlas, Legacy Project detail, simulator, jobs list, kitchen, and the games.
- `assets/site.css` : shared styles for the four main pages. Fonts are Funnel Display and Instrument Sans.
- `herd-mentality/`, `grove/`, `directorate.html`, `atlas.html` : the Lab exhibits.

## Launch it free (GitHub Pages, ~20 minutes)

1. Create a free account at github.com if you do not have one.
2. Click New repository. Name it `agentsandagency`. Set it Public. Create.
3. On the repo page, click "uploading an existing file" and drag in `index.html`, `lab.html`, and this README. Commit.
4. Go to Settings, then Pages (left sidebar). Under Build and deployment, set Source to "Deploy from a branch," branch `main`, folder `/ (root)`. Save.
5. Wait a minute. Your site is live at `https://YOURUSERNAME.github.io/agentsandagency/`.
6. Still in Settings > Pages, enter `agentsandagency.com` in the Custom domain box and save. GitHub adds a CNAME file to the repo. Leave it there.

## Point the domain (Spaceship)

1. In Spaceship, open the domain and find DNS / nameserver settings.
2. First, remove the existing URL forwarding / redirect to Substack. That redirect and these records cannot coexist.
3. Add four A records, all with host `@`:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
4. Add one CNAME record: host `www`, value `YOURUSERNAME.github.io`
5. Wait for DNS to propagate (minutes to a few hours). Back in GitHub Settings > Pages, check "Enforce HTTPS" once it becomes clickable.

Your Substack keeps working at agentsandagency.substack.com. Nothing about the newsletter changes. The site links to it in the nav, the writing section, and the footer.

Alternative host: Cloudflare Pages is also free and works by drag-and-drop. Either is fine. GitHub Pages is recommended because you can edit files directly in the browser.

## How to update the site

Edit on github.com (open the file, click the pencil icon, commit). The live site updates in a minute or two.

- **Add an essay:** in `writing.html`, copy one `<a class="essay">` block in the Substack grid, paste it first, and change the link, title, subtitle, and date. Give it a cover color class `c1` to `c4`. Then update the list on the home page Writing tile in `index.html`.
- **Add a video:** in `media.html`, copy one `<a class="video">` block. Replace the YouTube ID in both the link and the thumbnail URL (`https://i.ytimg.com/vi/ID/hqdefault.jpg`).
- **Add an acknowledgment:** in `research.html`, add a row to "The rest of the record," or copy an `<a class="paper">` block to feature it.
- **Add a Lab entry for the jobs list:** in `lab.html`, find `var LEDGER=[`. Copy one object, edit the four fields. The `cap` value must be one of CONTEXT, AGENCY, GENERALITY, CODE, COST, MULTIMODAL.
- **CV:** upload a new `cv.pdf` to the repo root.

Or paste any file into Claude and ask for the change.
