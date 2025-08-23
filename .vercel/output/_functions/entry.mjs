import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CHoPJgkX.mjs';
import { manifest } from './manifest_KiKVRPNC.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/send-brief.astro.mjs');
const _page2 = () => import('./pages/_lang_/api/generate-pdf.astro.mjs');
const _page3 = () => import('./pages/_lang_/api/send-brief.astro.mjs');
const _page4 = () => import('./pages/_lang_.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/send-brief.ts", _page1],
    ["src/pages/[lang]/api/generate-pdf.ts", _page2],
    ["src/pages/[lang]/api/send-brief.ts", _page3],
    ["src/pages/[lang]/index.astro", _page4],
    ["src/pages/index.astro", _page5]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2f39a357-4617-4d9f-a58e-2a576b7957e4",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
