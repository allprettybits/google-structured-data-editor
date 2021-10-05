import resolve from '@rollup/plugin-node-resolve';
import { copy } from '@web/rollup-plugin-copy';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import sourcemaps from 'rollup-plugin-sourcemaps';
import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';

export default {
    input: './build/src/main.js',
    output: {
        file: './dist/main.bundle.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        resolve({
            // we need this to ensure node-resolve is using locally installed deps for node built-in libs like 'buffer'
            // and similar ones (by default, node-resolve will use node built-ins, but we don't have them in the browser)
            browser: true,
        }),
        minifyHTML(),
        terser(),
        sourcemaps(),
        copy({
            patterns: [
                'index.html',
                'main.css',
            ],
            rootDir: './src',
        }),
        summary(),
    ],
    onwarn (warning, warn) {

        // skip certain warnings
        if (warning.code === 'THIS_IS_UNDEFINED') return;

        // Use default for everything else
        warn(warning);
    },
};
