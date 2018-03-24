import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default {
  input: './src/index.js',
  output: {
    file: '../dev/index.js',
    format: 'iife'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    nodeResolve(),
    commonjs({
      include: ['../node_modules/**', '../dist/**'],
      namedExports: {
        '../node_modules/react/index.js': [
          'createElement',
          'Component',
          'Children'
        ],
        '../node_modules/react-dom/index.js': [
          'findDOMNode',
          'unstable_batchedUpdates'
        ]
      }
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['env', { modules: false }], 'react', 'stage-0'],
      plugins: ['external-helpers']
    })
  ]
};
