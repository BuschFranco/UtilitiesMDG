import 'kleur/colors';
import { q as decodeKey } from './chunks/astro/server_Cto8z595.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_C6Z8s3E3.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///F:/MDG/Internos/DevRequest/","cacheDir":"file:///F:/MDG/Internos/DevRequest/node_modules/.astro/","outDir":"file:///F:/MDG/Internos/DevRequest/dist/","srcDir":"file:///F:/MDG/Internos/DevRequest/src/","publicDir":"file:///F:/MDG/Internos/DevRequest/public/","buildClientDir":"file:///F:/MDG/Internos/DevRequest/dist/client/","buildServerDir":"file:///F:/MDG/Internos/DevRequest/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/send-brief","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/send-brief\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"send-brief","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/send-brief.ts","pathname":"/api/send-brief","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/[lang]/api/generate-pdf","isIndex":false,"type":"endpoint","pattern":"^\\/([^/]+?)\\/api\\/generate-pdf\\/?$","segments":[[{"content":"lang","dynamic":true,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"generate-pdf","dynamic":false,"spread":false}]],"params":["lang"],"component":"src/pages/[lang]/api/generate-pdf.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/[lang]/api/send-brief","isIndex":false,"type":"endpoint","pattern":"^\\/([^/]+?)\\/api\\/send-brief\\/?$","segments":[[{"content":"lang","dynamic":true,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"send-brief","dynamic":false,"spread":false}]],"params":["lang"],"component":"src/pages/[lang]/api/send-brief.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://devrequest.vercel.app","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["F:/MDG/Internos/DevRequest/src/pages/[lang]/index.astro",{"propagation":"none","containsHead":true}],["F:/MDG/Internos/DevRequest/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/api/send-brief@_@ts":"pages/api/send-brief.astro.mjs","\u0000@astro-page:src/pages/[lang]/api/generate-pdf@_@ts":"pages/_lang_/api/generate-pdf.astro.mjs","\u0000@astro-page:src/pages/[lang]/api/send-brief@_@ts":"pages/_lang_/api/send-brief.astro.mjs","\u0000@astro-page:src/pages/[lang]/index@_@astro":"pages/_lang_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_PKM3KI0V.mjs","F:/MDG/Internos/DevRequest/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BK5k6_pU.mjs","F:/MDG/Internos/DevRequest/src/i18n/locales/en.ts":"chunks/en_Bzt1ZDUZ.mjs","F:/MDG/Internos/DevRequest/src/i18n/locales/es.ts":"chunks/es_2Jmtr3mY.mjs","F:/MDG/Internos/DevRequest/src/components/BriefForm.astro?astro&type=script&index=0&lang.ts":"_astro/BriefForm.astro_astro_type_script_index_0_lang.aTjjCWRD.js","F:/MDG/Internos/DevRequest/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.FyNRhhSv.js","F:/MDG/Internos/DevRequest/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.CDQpDKka.js","F:/MDG/Internos/DevRequest/src/components/LanguageSelector.astro?astro&type=script&index=0&lang.ts":"_astro/LanguageSelector.astro_astro_type_script_index_0_lang.B83CXbyG.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["F:/MDG/Internos/DevRequest/src/pages/index.astro?astro&type=script&index=0&lang.ts","window.location.href=\"/es/\";"],["F:/MDG/Internos/DevRequest/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","function r(){document.querySelectorAll(\".scroll-reveal\").forEach(t=>{const o=window.innerHeight;t.getBoundingClientRect().top<o-150&&t.classList.add(\"revealed\")})}function s(){const t=window.pageYOffset*-.5;document.querySelector(\"body::before\")&&document.body.style.setProperty(\"--scroll-offset\",`${t}px`)}document.addEventListener(\"DOMContentLoaded\",()=>{document.querySelectorAll(\".form-section, .card\").forEach(t=>{t.classList.add(\"scroll-reveal\")}),r()});window.addEventListener(\"scroll\",()=>{r(),s()});const d={threshold:.1,rootMargin:\"0px 0px -50px 0px\"},i=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&t.target.classList.add(\"animate-in\")})},d);document.querySelectorAll(\".scroll-animate\").forEach(e=>{i.observe(e)});let c=0;const l=document.querySelector(\".header\");window.addEventListener(\"scroll\",()=>{const e=window.pageYOffset||document.documentElement.scrollTop;e>c&&e>100?l?.classList.add(\"header-hidden\"):l?.classList.remove(\"header-hidden\"),c=e},!1);document.querySelectorAll('a[href^=\"#\"]').forEach(e=>{e.addEventListener(\"click\",function(t){t.preventDefault();const o=document.querySelector(this.getAttribute(\"href\"));o&&o.scrollIntoView({behavior:\"smooth\",block:\"start\"})})});const n=document.createElement(\"div\");n.className=\"scroll-progress\";document.body.appendChild(n);window.addEventListener(\"scroll\",()=>{const e=document.documentElement.scrollTop,t=document.documentElement.scrollHeight-document.documentElement.clientHeight,o=e/t*100;n.style.width=o+\"%\"});"],["F:/MDG/Internos/DevRequest/src/components/LanguageSelector.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"language-select\");e&&e.addEventListener(\"change\",n=>{const a=n.target.value,t=window.location.pathname.replace(/^\\/(en|es)/,\"\")||\"/\",c=`/${a}${t===\"/\"?\"\":t}`;window.location.href=c});"]],"assets":["/_astro/index.DdLUUU5o.css","/favicon.svg","/MDGlogo.png","/_astro/BriefForm.astro_astro_type_script_index_0_lang.aTjjCWRD.js","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"vpSIYHfxdhnkUDXHj8IzApBKR3hAdOI7P5cQ4Jh6Knk="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
