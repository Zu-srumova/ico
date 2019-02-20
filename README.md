# Kalkulačka OSVČ → HPP

Kalkulačka ve Vanilla JS umožňující porovnat mzdu jako zaměstnanec a jako OSVČ. 
Účelem je učit se formuláře a JS na něčem smysluplném. 

## First time installation

### Install latest [node.js](https://nodejs.org/)

### Install all packages from `package.json` locally

```shell
npm install
```

_If you’re having errors with `node-gyp`, try [installing it globally](https://github.com/nodejs/node-gyp#installation)._

## Development

To develop with automatic compilation and browser refreshing run

```shell
npm start
```

And see the result on `http://localhost:3000/`

## Build

To build everything once for production deploy (in `/dist/` folder)

This build uses all generated HTML files for _UnCSS_. If it removes something you need to keep, add and array to `ignore` option in `gulpfile.js`.  

```shell
npm run build
```

## CSS (Sass preprocessor)

`index.css` is compiled from `src/scss/index.scss` by [Sass](http://sass-lang.com/).

You don't know _Scss_ syntax or don't want to use it? Just use plain CSS in `src/scss/_base.scss`.


## HTML (Twig templates)

HTML is generated from [Twig.js](https://github.com/twigjs/twig.js/) templates (JavaScript impementation of Twig templating language) in `src/templates`.

You don't need to leverage the power of templates. You can just create plain HTML files with `*.twig` extension.  

If you don't want a template to be turned into HTML file start it with `_`. Typically these are templates used for _include_ or _extend_.

Documentation for [Twig](https://twig.symfony.com/doc/2.x/templates.html).

_Warning: [Twig.js doesn't implement 100% of Twig](https://github.com/twigjs/twig.js/wiki/Implementation-Notes)._

If you need some data to be available in all templates, use `templates/data.json` for that.


## Static files (JavaScript, images, …)

Folders and files from `/src/static/` are simply copied directly to `/dist/` folder.


### Bootstrap

You can comment out Bootstrap components you don't need in `/src/index.scss`.

`/src/_custom-bootstrap-variables.scss` contains only customized Bootstrap variables.

See `browserslist` in `package.json` for supported browsers.


### Deployment

Upload everything in `/dist/` folder to the server.

#### Surge.sh

Domain osvc.surge.sh
 
