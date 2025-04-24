import {nodeResolve} from '@rollup/plugin-node-resolve';
import css from "rollup-plugin-import-css";
import url from "@rollup/plugin-url";

export default {
    input: './index.js',
    output: [{
        file: './dist/xeokit-bim-viewer.es.js',
        format: 'es',
        name: 'bundle'
    },],
    plugins: [
        css(),
        nodeResolve(),
        url(
            {
                include: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
                limit: 1024 * 1024,
            }
        ),
    ]
}