const fs = require("fs");
const nunjucks = require("nunjucks");
const matter = require("gray-matter");
const { Remarkable } = require("remarkable");
const toc = require("markdown-toc");

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

let copy;
let template = fs.readFileSync(config[config.render_options.renderer].template, "utf-8");

if (config.render_options.renderer === "archie") {
  copy = JSON.parse(fs.readFileSync(config.archie.output));
} else if (config.render_options.renderer === "markdown") {
  md = fs.readFileSync(config.markdown.path);
  frontmatter = matter(md);
  copy = frontmatter.data;

  copy.content = new Remarkable().use(toc.plugin).render(frontmatter.content);
} else {
  console.error("Unrecognized renderer");
}

/*
 * {
 *   hed: Headline,
 *   by: authors,
 *   ...other
 * }
 */
nunjucks.configure({ autoescape: false });
const output = nunjucks.renderString(template, {
  ...copy,
  config,
  env: process.env.NODE_ENV,
});

fs.writeFileSync("./src/index.html", output);
