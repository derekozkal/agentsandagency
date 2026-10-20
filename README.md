# agentsandagency.com

A small static site. No build step, no framework, no hosting bill. It runs on GitHub Pages.

## Pages

- `index.html` : home. Hero with four proof points, the rotating selected-writing feature, the Legacy Project, and four ways in.
- `writing.html` : the four Substack essays with a line from each, the Kauffman-era archive from 2016 to 2019 with quotes, and earlier journalism.
- `research.html` : the research network, scholars funded, papers that acknowledge the work, and initiatives.
- `media.html` : the keynote video, photos, more videos (they play on the page), and the podcast.
- `lab.html` : the Lab. Exhibit cards, the Atlas, the Legacy Project, the simulator, the jobs list, the kitchen, and the arcade.
- `interactive.html` : Lab Exhibit J. Three essays as interactive figures, and the site's one agent.
- `about.html` : bio, facts, and what I'm working on now.
- `agents.html` : a page for AI agents researching me. `llms.txt` has the same facts in plain text. Both are linked from the footer.
- `404.html` : GitHub Pages shows this for broken links.
- `herd-mentality/`, `grove/`, `directorate.html`, `atlas.html` : the Lab exhibits. Each is self-contained.

## Shared files

- `assets/site.css` : all styles for the main pages. Fonts are Montserrat (headings) and Instrument Sans (text). Colors are set at the top under `:root`. Blue marks AI, green marks people, gold is for highlights.
- `assets/site.js` : menu, scroll reveals, count-ups, inline video, the writing rotator, and the agent used on the interactive essays page.
- `assets/figs.js` : the interactive figures and the toy model behind Fig. 2 and the Lab simulator. Loaded on `lab.html` and `interactive.html` only.
- `assets/img/` : web-sized photos and the exhibit screenshots.
- `assets/og.png` : the preview image that shows up when someone shares a link.

## The rotating writing feature

The home page cycles through nine pieces, one quote each, every eight seconds. It pauses on hover, on keyboard focus, and with its pause button, and it stays still for visitors who turn off motion in their system settings.

To change a slide, edit its `<article class="slide">` block in `index.html`: the outlet and date, the quote, the title and link, and the one-line note. Every quote is verbatim from the piece. Keep it that way. If you add or remove a slide, add or remove its matching `<button class="rseg">` in the bar below the slides and update the count.

## The agent

The agent only runs on `interactive.html`. It offers to do things the visitor didn't ask for, like running Fig. 1. The visitor accepts or declines. It never acts without a click, each offer shows at most once per visit, and the switch at the top of that page turns it off.

The offers live in a short `<script>` near the bottom of `interactive.html` that calls `AA.agent.when({...})`. To change a message, edit its `msg` text. To remove one, delete its `AA.agent.when(...)` block.

## How to update the site

Edit on github.com (open the file, click the pencil icon, commit). The live site updates in a minute or two.

- **Add an essay:** in `writing.html`, copy one `<a class="essay">` block, paste it first, and change the link, number, date, title, subtitle, and quote. The cover art is an inline SVG. Copy one of the four and change its colors. Consider adding it to the home page rotator too, and to the essay list in `llms.txt`.
- **Add a video:** in `media.html`, copy one `<a class="video">` block. Replace the YouTube ID in the link, the `data-yt` attribute, and the thumbnail URL (`https://i.ytimg.com/vi/ID/hqdefault.jpg`).
- **Add an acknowledgment:** in `research.html`, add a row to "The rest of the record," or copy an `<a class="paper">` block to feature it.
- **Add an entry to the jobs list:** in `lab.html`, find `var LEDGER=[`. Copy one object and edit the four fields. The `cap` value must be one of CONTEXT, AGENCY, GENERALITY, CODE, COST, MULTIMODAL.
- **Change the header or footer:** they are repeated in each main page, so make the same edit in all eight, including `404.html`.
- **CV:** upload a new `cv.pdf` to the repo root.

Or paste any file into Claude and ask for the change.

## Domain

DNS is at Spaceship: four A records for `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a CNAME for `www` pointing to `derekozkal.github.io`. The `CNAME` file in this repo tells GitHub Pages to serve the custom domain. Leave it there.
