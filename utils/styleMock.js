// Jest stand-in for CSS imports. use()/unuse() support lazily injected
// stylesheets (style-loader `lazyStyleTag`), such as the date picker's.
module.exports = { use: () => undefined, unuse: () => undefined };
