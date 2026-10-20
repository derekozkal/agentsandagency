# agentsandagency.com

A small static site. No build step, no framework, no hosting bill. It runs on GitHub Pages.

## Pages

- `index.html` : home. Hero with the delegation dial, Fig. 1, the Legacy Project, four ways in, and the For agents callout.
- `writing.html` : Substack essays with cover art, three interactive figures, Kauffman pieces, and earlier journalism.
- `research.html` : the research network, scholars funded, papers that acknowledge the work, and initiatives.
- `media.html` : the keynote video, photos, more videos (they play on the page), and the podcast.
- `lab.html` : the Lab. Exhibit cards, the Atlas, the Legacy Project, the simulator, the jobs list, the kitchen, and the arcade.
- `about.html` : bio, facts, and what I'm working on now.
- `agents.html` : a page for AI agents researching me. `llms.txt` has the same facts in plain text.
- `404.html` : GitHub Pages shows this for broken links.
- `herd-mentality/`, `grove/`, `directorate.html`, `atlas.html` : the Lab exhibits. Each is self-contained.

## Shared files

- `assets/site.css` : all styles for the main pages. Fonts are Montserrat (headings) and Instrument Sans (text). Colors are set at the top under `:root`. Blue marks AI, green marks people, gold is for highlights.
- `assets/site.js` : menu, scroll reveals, count-ups, the Agent and Motion switches in the footer, inline video, the hero dial, and the unprompted agent.
- `assets/figs.js` : the interactive figures and the toy model behind Fig. 2 and the Lab simulator.
- `assets/img/` : web-sized photos and the exhibit screenshots.
- `assets/og.png` : the preview image that shows up when someone shares a link.

## The agent

The site has a small scripted agent. Now and then it offers to do something the visitor didn't ask for, like shortening the home page or playing the keynote video. The visitor accepts or declines. It never acts without a click. Each offer shows at most once per visit, and visitors can turn it off in the footer.

The offers live in a short `<script>` near the bottom of each page that calls `AA.agent.when({...})`. To change a message, edit its `msg` text. To remove one, delete its `AA.agent.when(...)` block.

## How to update the site

Edit on github.com (open the file, click the pencil icon, commit). The live site updates in a minute or two.

- **Add an essay:** in `writing.html`, copy one `<a class="essay">` block, paste it first, and change the link, title, subtitle, and date. The cover art is an inline SVG. Copy one of the four and change its colors, or use a plain colored block. Then update the Writing card on the home page and the essay list in `llms.txt`.
- **Add a video:** in `media.html`, copy one `<a class="video">` block. Replace the YouTube ID in the link, the `data-yt` attribute, and the thumbnail URL (`https://i.ytimg.com/vi/ID/hqdefault.jpg`).
- **Add an acknowledgment:** in `research.html`, add a row to "The rest of the record," or copy an `<a class="paper">` block to feature it.
- **Add an entry to the jobs list:** in `lab.html`, find `var LEDGER=[`. Copy one object and edit the four fields. The `cap` value must be one of CONTEXT, AGENCY, GENERALITY, CODE, COST, MULTIMODAL.
- **Change the header or footer:** they are repeated in each main page, so make the same edit in all eight, including `404.html`.
- **CV:** upload a new `cv.pdf` to the repo root.

Or paste any file into Claude and ask for the change.

## Domain

DNS is at Spaceship: four A records for `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a CNAME for `www` pointing to `derekozkal.github.io`. The `CNAME` file in this repo tells GitHub Pages to serve the custom domain. Leave it there.
