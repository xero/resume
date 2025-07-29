import { $ } from "bun";
import { argv } from "process";
import { readFile, writeFile } from "fs/promises";

async function clean() {
  await $`rm -rf ./dist`;
  await $`mkdir -p ./dist`;
}
async function copy() {
  await $`cp -r ./src/* ./dist`;
}
async function style() {
  await $`postcss -o ./dist/ui/site.min.css ./src/ui/site.css`;
  let css = await readFile("./dist/ui/site.min.css", "utf8");
  css = css.replace(
    /tailwindcss.*com !/,
    `\n┳━┓┏┓┓┳━┓┳━┓┳━━┓ ┳  ┳ ┳┳━┓┳━┓┳━┓o┓━┓┏━┓┏┓┓\n┃━┫┃┃┃┃ ┃┃┳┛┣━ ┃┃┃  ┃━┫┃━┫┃┳┛┃┳┛┃┗━┓┃ ┃┃┃┃\n┇ ┗┛┗┛┗━┛┛┗━┻━┛┗┻┛  ┇ ┗┛ ┗┛┗━┛┗━┇━━┛┛━┛┛┗┛\n`
  );
  await writeFile("./dist/ui/site.min.css", css);
  await uncache();
}
async function script() {
  await $`terser ./src/ui/app.js -o ./dist/ui/app.min.js --comments -c`;
  await uncache();
}
async function uncache() {
  await $`cp ./src/index.html ./dist/index.html`;
  // Replace "build" with current timestamp in dist/index.html
  let indexHtml = await readFile("./dist/index.html", "utf8");
  indexHtml = indexHtml.replace(/build/g, `${Math.floor(Date.now() / 1000)}`);
  await writeFile("./dist/index.html", indexHtml);
}
async function removeUnminified() {
  await $`rm -f ./dist/ui/site.css ./dist/ui/app.js`;
}
async function release() {
  // Check for uncommitted changes
  const { stdout: status } = await $`git status --porcelain`;
  const statusStr = Buffer.from(status).toString();
  if (statusStr.trim() !== "") {
    console.error("commit your changes first!");
    process.exit(1);
  }
  // Bump patch version using npm
  await $`npm version patch`;
  // Update <lastmod> in src/sitemap.xml
  const sitemapPath = "src/sitemap.xml";
  let sitemap = await readFile(sitemapPath, "utf8");
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  sitemap = sitemap.replace(
    /<lastmod>.*<\/lastmod>/,
    `<lastmod>${today}</lastmod>`
  );
  await writeFile(sitemapPath, sitemap);
  // Commit the change
  await $`git add ${sitemapPath}`;
  await $`git commit -m 'chore: update sitemap lastmod for release'`;
}
async function build() {
  await clean();
  await copy();
  await style();
  await script();
  await removeUnminified();
}

const actions = {
  clean,
  copy,
  style,
  script,
  uncache,
  removeUnminified,
  build,
  release,
};
async function main() {
  const args = argv.slice(2);
  if (args.length === 0) {
    await build();
    return;
  }
  for (const arg of args) {
    if (actions[arg]) {
      await actions[arg]();
    } else {
      console.error(`Unknown action: ${arg}`);
      process.exit(1);
    }
  }
}
main();
