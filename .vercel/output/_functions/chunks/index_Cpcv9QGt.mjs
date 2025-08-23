const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};

const defaultLanguage = "en";
const languages = {
  en: "English",
  es: "Español"
};
function useTranslations(lang) {
  return async () => {
    try {
      const translations = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"./locales/en.ts": () => import('./en_Bzt1ZDUZ.mjs'),"./locales/es.ts": () => import('./es_2Jmtr3mY.mjs')})), `./locales/${lang}.ts`, 3);
      return translations.default;
    } catch {
      const fallback = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"./locales/en.ts": () => import('./en_Bzt1ZDUZ.mjs'),"./locales/es.ts": () => import('./es_2Jmtr3mY.mjs')})), `./locales/${defaultLanguage}.ts`, 3);
      return fallback.default;
    }
  };
}
function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({ params: { lang } }));
}

export { getStaticPaths as g, languages as l, useTranslations as u };
