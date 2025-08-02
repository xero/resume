import {$} from "bun";
import {argv} from "process";
import {readFile,writeFile} from "fs/promises";

const
	C=console.log,
	E=console.error,
	echo=async (m,t)=>{
		switch(m) {
			case 0:
				C(`               |     task: ${t.padEnd(9)}   Complete!      |`);
			break;
			case 1:
				E(`               *     task: ${t.padEnd(9)}   FAILED!        *`);
				echo(2);
			break;
			case 2:
				C(`               |______________________________________|`);
			break;
			case 3:
				E(`               *     commit your changes first!       *`);
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
	run=async(cmd)=>{
		try {
			const r = await cmd;
			return r;
		} catch (e) {
			if (e && typeof e.message === "string" && e.message.startsWith("Error:")) {
				throw e;
			}
			throw new Error(e.stderr || e.stdout || e.message || "Command failed");
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
		await run($`postcss -o ./dist/ui/site.min.css ./src/ui/site.css`);
		let css = await readFile("./dist/ui/site.min.css", "utf8");
		if (!css || css.trim().length === 0) {
			throw new Error("PostCSS failed");
		}
		css = css.replace("tailwindcss v4.1.11 | MIT License | https://tailwindcss.com",`\n┳━┓┏┓┓┳━┓┳━┓┳━━┓ ┳  ┳ ┳┳━┓┳━┓┳━┓o┓━┓┏━┓┏┓┓\n┃━┫┃┃┃┃ ┃┃┳┛┣━ ┃┃┃  ┃━┫┃━┫┃┳┛┃┳┛┃┗━┓┃ ┃┃┃┃\n┇ ┗┛┗┛┗━┛┛┗━┻━┛┗┻┛  ┇ ┗┛ ┗┛┗━┛┗━┇━━┛┛━┛┛┗┛\n`);
		await writeFile("./dist/ui/site.min.css", css);
		await uncache();
	},
	script=async _=>{
		await $`terser ./src/ui/app.js -o ./dist/ui/app.min.js --comments -c`;
		let js= await readFile("./dist/ui/app.min.css", "utf8");
		if (!js|| js.trim().length === 0) {
			throw new Error("Terser failed");
		}
		await uncache();
	},
	uncache=async _=>{
		await $`cp ./src/index.html ./dist/index.html`;
		let indexHtml = await readFile("./dist/index.html", "utf8");
		indexHtml = indexHtml.replace(/build/g, `${Math.floor(Date.now() / 1000)}`);
		await writeFile("./dist/index.html", indexHtml);
	},
	postBuild=async _=>{
		await $`rm -f ./dist/ui/site.css ./dist/ui/app.js`;
	},
	release=async _=>{
		const {stdout:status}=await $`git status --porcelain`,
		statusStr=Buffer.from(status).toString();
		if (statusStr.trim()!==""){
			await echo(3);
			await echo(1);
			process.exit(1);
		}
		await $`npm version patch`;
		const sitemapPath = "src/sitemap.xml";
		let sitemap = await readFile(sitemapPath, "utf8");
		const today = new Date().toISOString().slice(0, 10);
		sitemap = sitemap.replace(
			/<lastmod>.*<\/lastmod>/,
			`<lastmod>${today}</lastmod>`
		);
		await writeFile(sitemapPath, sitemap);
		await $`git add ${sitemapPath}`;
		await $`git commit -m 'chore: update sitemap lastmod for release'`;
	},
	task=async (f,t)=>{
		try {
			await f();
			await echo(0,t);
		} catch (e) {
			await echo(1,t);
			throw e;
		}
	},
	build=async _=>{
		await task(clean, "clean");
		await task(copy, "copy");
		await task(style, "style");
		await task(script, "script");
		await task(postBuild, "postBuild");
	},
	main=async _=>{
		await echo();
		const args=argv.slice(2);
		try{
			if(args.length===0){
				await build();
				await echo(2);
				return;
			}
			for(const arg of args) {
				if(actions[arg]) {
					await task(actions[arg], arg);
					await echo(2);
				} else {
					await echo(1,arg);
					process.exit(1);
				}
			}
		} catch(e) {
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
