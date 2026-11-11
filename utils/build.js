// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

const BROWSER_ENV = process.argv[2];

var webpack = require('webpack');
var config = require('../webpack.config')({
  browser: BROWSER_ENV,
});

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

webpack(config, function (err, stats) {
  if (err) throw err;
  // Webpack reports compile errors (e.g. TypeScript errors) through `stats`,
  // not `err`, and skips writing output when they happen. Without this check
  // the build would "succeed" while leaving the old build/ folder in place.
  if (stats && stats.hasErrors()) {
    console.error(stats.toString({ all: false, errors: true, colors: true }));
    process.exitCode = 1;
  }
});
