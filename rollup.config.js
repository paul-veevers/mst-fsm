import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

export default {
  input: './lib/index.browser.js',
  output: {
    file: './dist/browser/index.js',
    format: 'cjs'
  },
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['env', { modules: false }], 'react', 'stage-0'],
      plugins: ['external-helpers']
    }),
    filesize()
  ]
};
