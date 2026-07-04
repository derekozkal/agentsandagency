# agentsandagency.com

A two-page static site. No build step, no framework, no dependencies, no hosting bill.

- `index.html` : home. Hero, the record, writing, standing, about.
- `lab.html` : the Lab. Expertise Flow Simulator and the Genesis Ledger.
- `cv.pdf` : add this yourself. The About section links to it.

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

Every editable spot is marked with an `<!-- EDIT -->` comment in the HTML. Edit on github.com (open the file, click the pencil icon, commit) and the live site updates in about a minute.

- **Add an essay:** in `index.html`, find the essay list. Copy one `<li>` row, paste it at the top, change the title and link.
- **Change the featured essay:** find `<!-- EDIT: paste the exact essay URL -->` and swap the link and blurb.
- **Add press coverage:** in `index.html`, the Press & media section has three placeholder rows. Replace outlet, headline, link, year. Copy a row to add more.
- **Add a Genesis Ledger entry:** in `lab.html`, find `var LEDGER=[`. Copy one object, edit the four fields. The `cap` value must be one of CONTEXT, AGENCY, GENERALITY, CODE, COST, MULTIMODAL.
- **Update the running balance numbers:** in `index.html`, the hero sidebar. Change the visible number and the `data-count` value together.
- **CV:** export your resume as `cv.pdf` and upload it to the repo root.
- **Contact email:** the footer has a placeholder mailto. Replace it with a real address. Spaceship offers email forwarding if you want hello@agentsandagency.com to reach your inbox.

Or paste any file back into Claude and ask for the change. The site was built to be edited.

## Things waiting on you

1. Real press rows (three placeholders in Standing).
2. Exact URL for The Liquidity Crisis of Expertise (featured essay card).
3. `cv.pdf` uploaded to the repo.
4. Real contact email in the footer.
