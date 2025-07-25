# Resume Website ⟁ **[https://Andrew.Harrison.nu](https://Andrew.Harrison.nu)**

![preview](https://github.com/user-attachments/assets/14fa73b8-9740-4aba-9219-cfa2ed0eaa71)

| ![ah logo](https://raw.githubusercontent.com/xero/resume/refs/heads/main/src/ui/i/logo.png) | <h1>Functions<br>&amp; Features</h1> | ◈  Responsive Flexbox Layout w/a Modern Design<br> ◈  Light/Dark Mode Toggle w/ Matching Themes<br> ◈  Image Lightboxes w/ Keyboard Support <br> ◈ Dynamic Github Activity Graph<br> ◈ Client Side Email Form with Validation |
|:---:|:---:|:---|

## Project Structure

The project root contains configuration files for the development and build environment, as well as, two folders.

- **Sources** `src/` contains the project source files, including images, fonts, [scripts](src/ui/app.js), and [style sheets](src/ui/site.css).
- **Distribution** `dist/` (generated at build time) the complete, compiled and minified, production files.

Here's an overview of the file hierarchy:
```
.
├── bun.lockb             -> Dependency versioning
├── dist/                 -> Generated files location
│   ├── ui/               -> Production assets
│   │   ├── app.min.js    -> Minified javascript
│   │   └── site.min.css  -> Minified style sheets
│   └── [other files]     -> Copied from `src`
├── package.json          -> Packages and scripts
├── package-lock.json     -> Dependency lockfile
├── postcss.config.js     -> PostCSS configuration
├── README.md             -> Project documentation
├── src/                  -> Project source files
│   ├── favicon.ico       -> Domain level favicon
│   ├── humans.txt        -> Human info
│   ├── index.html        -> Single page application
│   ├── robots.txt        -> Blocks bad bots/scrapers
│   ├── sitemap.xml       -> Sitemap for SEO
│   └── ui/               -> Development assets
│       ├── app.js        -> Application javascript
│       ├── hax.woff2     -> Customized web-font
│       ├── i/            -> Images folder
│       └── site.css      -> Style sheets
└── tailwind.config.js    -> TailwindCSS configuration
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

Rebuild just the css with the `style` command:

```
bun run style
```
Rebuild just the javascript with the `script` command:

```
bun run script
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

## TailwindCSS

I don't really like how you're intended to litter your HTML with their style attributes. My approach is to compile their classes into my own using the `@apply` keyword. This allows me to keep my DOM minimal, use my normal css logic style, and get the added benefits of tailwind and their short declarations.

## License

**CC0 1.0 Universal (Public Domain Dedication)**

Use this _code_ for anything, commercial or personal, with or without attribution. Just don't steal my identity ;P

