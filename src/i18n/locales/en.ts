import type { Translations } from '../index';

const en: Translations = {
  // Navigation and UI
  title: 'Landing Page Development',
  subtitle: 'Generate a landing page development request',
  languageSelector: 'Language',
  
  // Form sections
  maxiApproval: 'Maxi\'s Approval',
  adminApproval: 'Maxi\'s Approval',
  campaignInfo: 'Campaign Information',
  basicInfo: 'Basic Information',
  landingInfo: 'Landing Information',
  landingPageInfo: 'Landing Page Information',
  contentCopies: 'Content and Copies',
  graphicResources: 'Graphic Resources',
  technicalFunctionalities: 'Technical Functionalities',
  applicantInfo: 'Applicant Information',
  requesterInfo: 'Requester Information',
  references: 'References (Optional)',
  colors: 'Colors (Optional)',
  formInfoBanner: 'This form is necessary to generate the Dev ID for landing page development and storage.',
  
  // Form fields
  product: 'Product',
  country: 'Country',
  carriers: 'Carriers',
  trafficOrigin: 'Traffic Origin',
  copies: 'Copies and Texts',
  tcLinks: 'Links',
  languages: 'Languages',
  images: 'Images',
  logos: 'Logos',
  flowType: 'Flow Type',
  specialFunctionalities: 'Special Functionalities',
  technologyType: 'Technology Type',
  trafficSource: 'Traffic Source',
  newTechnology: 'New Technology',
  oldTechnology: 'Old Technology (mobi)',
  oldTechWarning: '⚠️ Old technology has a longer development timeline and may be subject to visual limitations',
  
  // Maxi Approval Info
  maxiApprovalTitle: '📋 Initial Approval (Maxi)',
  maxiApprovalInfo1: '• Every landing request goes through Maxi first.',
  maxiApprovalInfo2: '• <strong>Maxi\'s Role:</strong> decide if the landing is viable considering:',
  maxiApprovalSubInfo1: '○ Necessary backend integrations.',
  maxiApprovalSubInfo2: '○ Requested functionalities.',
  maxiApprovalSubInfo3: '○ Resources and priorities.',
  maxiApprovalInfo3: '👉 <strong>Only with his OK we proceed.</strong>',
  contactMaxi: 'Contact Maxi',
  
  // Juli Contact Info
  juliNote: 'Note: If you don\'t have the necessary graphic resources for the landing, please contact Juli for assistance.',
  contactJuli: 'Contact Juli',
  
  requesterName: 'Requester Name',

  planType: 'Plan Type',
  links: 'Links',
  linkDescription: 'Link Description',
  subscriptionKeywords: 'Subscription/Unsubscription Keywords',
  priceText: 'Text containing the price',
  selectBannerImages: 'Select banner images',
  selectImages: 'Select images',
  selectLogos: 'Select logos',
  referenceUrl: 'Reference landing URL (Optional)',
  referenceImage: 'Reference landing image (Optional)',
  selectFlowType: 'Select the flow type',
  guidelinesDocument: 'Guidelines document (Optional)',
  selectReferenceImage: 'Select reference image',
  selectDocument: 'Select document',
  colorValue: 'Color',
  colorDescription: 'Color description',
  
  // Form placeholders
  productPlaceholder: 'e.g., Norton, Avast, MediaGames',
  countryPlaceholder: 'e.g., PL, AT, ID, ES, SN, KZ...',
  carriersPlaceholder: 'e.g., Vodafone, Plus, T-Mobile...',
  trafficOriginPlaceholder: 'e.g., Affiliates, Google...',
  copiesPlaceholder: '• Terms and Conditions: "By subscribing..."\n• MSISDN Button: "CONTINUE"\n• PIN Button: "SUBSCRIBE"\n• Main Title: ".."\n• Subtitles: ".."',
  tcLinksPlaceholder: 'Include all Terms and Conditions and legal links...',
  languagesPlaceholder: 'e.g., English, Spanish, French...',
  imagesPlaceholder: 'Describe image requirements, product shots, backgrounds...',
  logosPlaceholder: 'Specify logos needed, brand guidelines, and usage...',
  flowTypePlaceholder: 'Select the main conversion flow type',
  specialFunctionalitiesPlaceholder: 'E.g.: Click button when clicking anywhere on landing page, auto-click after 5 seconds, checkbox prefill, etc',
  requesterNamePlaceholder: 'Enter your full name',
  jiraTaskUrlPlaceholder: 'Enter the Jira task URL',
  linkDescriptionPlaceholder: 'E.g.: Licenses',
  subscriptionKeywordsPlaceholder: 'e.g., STOP to 9521, CLP to 9522',
  priceTextPlaceholder: 'e.g., 1.5 EUR/Day (VAT Inclusive)',
  referenceUrlPlaceholder: 'Enter the reference URL',
  colorDescriptionPlaceholder: 'Ex: Primary color, Button color, Background color, etc.',
  // Flow type options
  flowTypes: {
    sms: 'SMS Subscription',
    pin: 'PIN Verification',
    redirect: 'Direct Redirect',
    download: 'App Download',
    subscription: 'Subscription Service'
  },
  
  // Buttons and actions

  francoNotification: 'This information will be sent to Franco (franco@mediadigitalgroup.com)',
  generateBrief: 'Generate Request',
  generating: 'Generating...',
  
  // Messages
  successMessage: 'Request generated successfully! A PDF will be downloaded with the request information.',
  errorMessage: 'Error generating brief. Please try again.',
  fillAllFields: 'Please fill in all required fields.',
  
  // Email
  emailSubject: 'New Landing Page Brief Generated'
};

export default en;