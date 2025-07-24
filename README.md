# Andrew Harrison

> ## Personal Portfolio Website Code For https://andrew.harrison.nu

### Project Structure

The project root contains configuration files for the development and build environment, as well as, two folders.

- **Sources** `src`: contains the project source files, including images, fonts, scripts, and style sheets.
- **Distribution*** `dist`: (generated at build time) contains the complete production website including compiled and minified files.

Here's an overview of the file hierarchy:
```
.
├── bun.lockb           -> Dependency versioning
├── dist/               -> Generated files location
│   └── ui/             -> Website assets
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

### Building

Clone the repo and build it using bun or npm:

```
bun i
```

Build the site structure with the `prod` command:

```
bun run prod
```

Rebuild just the css with the `css` command:

```
bun run css
```

### Dependencies

This site is custom coded with the the following tools and libraries:

- [Bun](https://bun.sh)
- [TailwindCSS](https://tailwindcss.com)
- [CssNano](https://cssnano.github.io/cssnano)
- [PostCSS](http://postcss.org)
- [Neovim](https://neovim.io)

### License

**CC0 1.0 Universal (Public Domain Dedication)**

Use this _code_ for anything, commercial or personal, with or without attribution. Just don't steal my identity ;P

