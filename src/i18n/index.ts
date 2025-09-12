export interface Translations {
  // Navigation and UI
  title: string;
  subtitle: string;
  languageSelector: string;
  
  // Operation type
  operationType: string;
  newLP: string;
  modifyLP: string;
  existingDevId: string;
  existingDevIdPlaceholder: string;
  loadExistingData: string;
  devIdNotFound: string;
  loadingData: string;
  
  // Form sections
  maxiApproval: string;
  adminApproval: string;
  campaignInfo: string;
  basicInfo: string;
  landingInfo: string;
  landingPageInfo: string;
  contentCopies: string;
  graphicResources: string;
  technicalFunctionalities: string;
  applicantInfo: string;
  requesterInfo: string;
  references: string;
  colors: string;
  formInfoBanner: string;
  
  // Form fields
  product: string;
  country: string;
  carriers: string;
  trafficOrigin: string;
  copies: string;
  tcLinks: string;
  languages: string;
  images: string;
  logos: string;
  flowType: string;
  specialFunctionalities: string;
  requesterName: string;
  planType: string;
  links: string;
  trafficSource: string;

  technologyType: string;
  linkDescription: string;
  subscriptionKeywords: string;
  priceText: string;
  selectBannerImages: string;
  selectImages: string;
  selectLogos: string;
  referenceUrl: string;
  referenceImage: string;
  selectFlowType: string;
  guidelinesDocument: string;
  selectReferenceImage: string;
  selectDocument: string;
  colorValue: string;
  colorDescription: string;
  
  // Form placeholders
  productPlaceholder: string;
  countryPlaceholder: string;
  carriersPlaceholder: string;
  trafficOriginPlaceholder: string;
  copiesPlaceholder: string;
  tcLinksPlaceholder: string;
  tcLinkUrlPlaceholder: string;
  languagesPlaceholder: string;
  imagesPlaceholder: string;
  logosPlaceholder: string;
  flowTypePlaceholder: string;
  specialFunctionalitiesPlaceholder: string;
  requesterNamePlaceholder: string;
  linkDescriptionPlaceholder: string;
  subscriptionKeywordsPlaceholder: string;
  priceTextPlaceholder: string;
  referenceUrlPlaceholder: string;
  colorDescriptionPlaceholder: string;
  
  // Flow type options
  flowTypes: {
    sms: string;
    pin: string;
    redirect: string;
    download: string;
    subscription: string;
  };
  
  // Buttons and actions
  remove: string;
  generateBrief: string;
  generating: string;
  filesSelected: string;

  francoNotification: string;
  
  // Messages
  successMessage: string;
  errorMessage: string;
  fillAllFields: string;
  
  // Email
  emailSubject: string;
}

export const defaultLanguage = 'en';
export const languages = {
  en: 'English',
  es: 'Español'
};

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLanguage;
}

export function useTranslations(lang: keyof typeof languages) {
  return async (): Promise<Translations> => {
    try {
      const translations = await import(`./locales/${lang}.ts`);
      return translations.default;
    } catch {
      const fallback = await import(`./locales/${defaultLanguage}.ts`);
      return fallback.default;
    }
  };
}

export function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({ params: { lang } }));
}