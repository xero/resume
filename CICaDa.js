import { $ } from "bun";
import { argv } from "process";
import { readFile, writeFile } from "fs/promises";

const
	C=console.log,
	echo=async (m,t)=>{
		switch(m) {
			case 0:
				C(`               |     task: ${t.padEnd(9)}   Complete!      |`);
			break;
			case 1:
				C(`               *     task: ${t.padEnd(9)}   FAILED!        *`);
			break;
			case 2:
				C(`               |______________________________________|`);
			break;
			default:
				C(`  ......._                                                  _.......
.'        "-.._                                        _..-"        \`.
 ".      .' \` .\`'-~-._                          _.-~-"\`. ' \`.   '  ."
  ".  .         \` .   "-.      _)_.._(_      .-"   . '         .. ."
    ". ...     .. .\`.    \`.   (_)    (_)   .'    .'. ..     ...  ;vnm
      '_   '\` ..      \`.   \\\. | '____' | ./   .'      .. '\`   _.'
        "-.. '  \`   ..      \\\\'-~.__.~-'//      ..   '  \` ..-"
            "\`..          .' . '      ' . \`.          ..'"
           .'"   " .  . '    \`. '.--.' .'    \` .  . "   "\`.
           "            .'   '\\\ \\\    / /\`   \`.            "
            \`... .. .  '    ' (,-\`  '-,) \`    \`  . .. ...'
                     \`.  . "  (--------)  " .  .'
                       "      (--------)      "
                ____________  \`--------'  ____________
               |               \`.____.'               |
               |  CICaDa CI/CD  \`.__.'  Build System  |
               |                                      |`);
			break;
		}
	},
	clean=async _=>{
		await $`rm -rf ./dist`;
		await $`mkdir -p ./dist`;
	},
	copy=async _=>{
		await $`cp -r ./src/* ./dist`;
	},
	style=async _=>{
		await $`postcss -o ./dist/ui/site.min.css ./src/ui/site.css`;
		let css = await readFile("./dist/ui/site.min.css", "utf8");
		css = css.replace("tailwindcss v4.1.11 | MIT License | https://tailwindcss.com",`\n┳━┓┏┓┓┳━┓┳━┓┳━━┓ ┳  ┳ ┳┳━┓┳━┓┳━┓o┓━┓┏━┓┏┓┓\n┃━┫┃┃┃┃ ┃┃┳┛┣━ ┃┃┃  ┃━┫┃━┫┃┳┛┃┳┛┃┗━┓┃ ┃┃┃┃\n┇ ┗┛┗┛┗━┛┛┗━┻━┛┗┻┛  ┇ ┗┛ ┗┛┗━┛┗━┇━━┛┛━┛┛┗┛\n`
		);
		await writeFile("./dist/ui/site.min.css", css);
		await uncache();
	},
	script=async _=>{
		await $`terser ./src/ui/app.js -o ./dist/ui/app.min.js --comments -c`;
		await uncache();
	},
	uncache=async _=>{
		await $`cp ./src/index.html ./dist/index.html`;
		// Replace "build" with current timestamp in dist/index.html
		let indexHtml = await readFile("./dist/index.html", "utf8");
		indexHtml = indexHtml.replace(/build/g, `${Math.floor(Date.now() / 1000)}`);
		await writeFile("./dist/index.html", indexHtml);
	},
	postBuild=async _=>{
		await $`rm -f ./dist/ui/site.css ./dist/ui/app.js`;
	},
	release=async _=>{
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
	},
	task=async (f,t)=>{
		try {
			await f();
			echo(0,t);
		} catch (e) {
			echo(1,t);
			throw e;
		}
	},
	build=async _=>{
		try {
			await task(clean, "clean");
			await task(copy, "copy");
			await task(style, "style");
			await task(script, "script");
			await task(postBuild, "postBuild");
		} catch (e) {
			process.exit(1);
		}
	},
	main=async _=>{
		echo();
		const args = argv.slice(2);
		try {
			if (args.length === 0) {
				await build();
				echo(2);
				return;
			}
			for (const arg of args) {
				if (actions[arg]) {
					await task(actions[arg], arg);
					echo(2);
				} else {
					echo(1, arg);
					process.exit(1);
				}
			}
		} catch (err) {
			echo(1, err);
			console.error(err);
			process.exit(1);
		}
	},
	actions={
		build,
		clean,
		copy,
		release,
		postBuild,
		script,
		style,
		uncache,
	};
main();
