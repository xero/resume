# Professional Resume Website Sources https://Andrew.Harrison.nu

## Project Structure

The project root contains configuration files for the development and build environment, as well as, two folders.

- **Sources** `src/` contains the project source files, including images, fonts, [scripts](src/ui/app.js), and [style sheets](src/raw.css).
- **Distribution** `dist/` (generated at build time) the complete, compiled and minified, production files.

Here's an overview of the file hierarchy:
```
.
├── bun.lockb           -> Dependency versioning
├── dist/               -> Generated files location
│   └── ui/             -> Development website assets
│       └── site.css    -> Minified style sheets
├── package.json        -> Packages and scripts
├── package-lock.json   -> Dependency lockfile
├── postcss.config.js   -> PostCSS configuration
├── README.md           -> Project documentation
├── src/                -> Project source files
│   ├── favicon.ico     -> Website icon
│   ├── humans.txt      -> Human info
│   ├── index.html      -> Single page application
│   ├── raw.css         -> Development style sheet
│   └── ui/             -> Production Website assets
│       ├── app.js      -> Application javascript
│       ├── hax.woff2   -> Customized web-font
│       └── i/          -> Images folder
└── tailwind.config.js  -> TailwindCSS configuration
```

## Building

Clone the repo and install it's dependencies using `bun` or `npm`:

```
bun i
```

Build the site structure with the `build` command:

```
bun run build
```

Rebuild just the css with the `css` command:

```
bun run css
```
Increment the package version and sitemap date with the `release` command:

```
bun run release
```

## Dependencies

This site is programmed with the the following tools and libraries:

- [Bun](https://bun.sh)
- [TailwindCSS](https://tailwindcss.com)
- [CssNano](https://cssnano.github.io/cssnano)
- [PostCSS](http://postcss.org)
- [Neovim](https://neovim.io)

## License

**CC0 1.0 Universal (Public Domain Dedication)**

Use this _code_ for anything, commercial or personal, with or without attribution. Just don't steal my identity ;P

