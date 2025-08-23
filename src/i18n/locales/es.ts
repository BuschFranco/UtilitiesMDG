import type { Translations } from '../index';

const es: Translations = {
  // Navigation and UI
  title: 'Desarrollo de Landing Pages',
  subtitle: 'Genera una solicitud de desarrollo de landing page',
  languageSelector: 'Idioma',
  
  // Form sections
  maxiApproval: 'Aprobación de Maxi',
  campaignInfo: 'Información de la Campaña',
  landingInfo: 'Información de la Landing',
  contentCopies: 'Contenido y Textos',
  graphicResources: 'Recursos Gráficos',
  technicalFunctionalities: 'Funcionalidades Técnicas',
  applicantInfo: 'Información del Solicitante',
  requesterInfo: 'Información del Solicitante',
  references: 'Referencias (Opcional)',
  colors: 'Colores (Opcional)',
  formInfoBanner: 'Este formulario es necesario para generar el Dev ID para el desarrollo y almacenamiento de la landing page.',
  
  // Form fields
  product: 'Producto',
  country: 'País',
  carriers: 'Operadoras',
  trafficOrigin: 'Origen del Tráfico',
  copies: 'Textos y Copys',
  tcLinks: 'Enlaces de Términos y Condiciones',
  languages: 'Idiomas',
  banners: 'Banners',
  images: 'Imágenes',
  logos: 'Logos',
  flowType: 'Tipo de Flujo',
  specialFunctionalities: 'Funcionalidades Especiales',
  technologyType: 'Tipo de Tecnología',
  newTechnology: 'Nueva Tecnología',
  oldTechnology: 'Vieja Tecnología (mobi)',
  oldTechWarning: '⚠️ La tecnología vieja tiene un plazo de desarrollo más largo y puede estar condicionada a limitaciones visuales',
  
  // Maxi Approval Info
  maxiApprovalTitle: "📋 Aprobación inicial (Maxi)",
  maxiApprovalInfo1: "• Toda solicitud de landing pasa primero por Maxi.",
  maxiApprovalInfo2: "• <strong>Rol de Maxi:</strong> decidir si la landing es viable considerando:",
  maxiApprovalSubInfo1: "○ Integraciones backend necesarias.",
  maxiApprovalSubInfo2: "○ Funcionalidades solicitadas.",
  maxiApprovalSubInfo3: "○ Recursos y prioridades.",
  maxiApprovalInfo3: "👉 <strong>Solo con su OK se avanza.</strong>",
  contactMaxi: "Contactar con Maxi",
  
  // Juli Contact Info
  juliNote: "Nota: Si no tienes los recursos gráficos necesarios para la landing, por favor contacta a Juli para obtener asistencia.",
  contactJuli: "Contactar Juli",
  requesterName: 'Nombre del Solicitante',
  jiraTaskUrl: 'URL de la Task de Jira (Generar una en caso de no tener)',
  planType: 'Tipo de Plan',
  links: 'Enlaces',
  linkDescription: 'Descripción del enlace',
  subscriptionKeywords: 'Keywords de Suscripción/Desuscripción',
  priceText: 'Texto que contiene el precio',
  selectBannerImages: 'Seleccionar imágenes de banners',
  selectImages: 'Seleccionar imágenes',
  selectLogos: 'Seleccionar logos',
  referenceUrl: 'URL de landing de referencia (Opcional)',
  referenceImage: 'Imagen de landing de referencia (Opcional)',
  selectFlowType: 'Selecciona el tipo de flujo',
  guidelinesDocument: 'Documento con guidelines (Opcional)',
  selectReferenceImage: 'Seleccionar imagen de referencia',
  selectDocument: 'Seleccionar documento',
  colorValue: 'Color',
  colorDescription: 'Descripción del color',
  
  // Form placeholders
  productPlaceholder: 'Ej: Norton, Avast, MediaGames',
  countryPlaceholder: 'ej., PL, AT, ID, ES, SN, KZ...',
  carriersPlaceholder: 'ej., Vodafone, Plus, T-Mobile...',
  trafficOriginPlaceholder: 'ej., Afiliados, Google...',
  copiesPlaceholder: 'Describe los textos principales, títulos y contenido del copy...',
  tcLinksPlaceholder: 'Incluye todos los enlaces de Términos y Condiciones y legales...',
  languagesPlaceholder: 'ej., Inglés, Español, Francés...',
  bannersPlaceholder: 'Describe los requisitos de banners, tamaños y especificaciones...',
  imagesPlaceholder: 'Describe los requisitos de imágenes, fotos de producto, fondos...',
  logosPlaceholder: 'Especifica los logos necesarios, guías de marca y uso...',
  flowTypePlaceholder: 'Selecciona el tipo de flujo de conversión principal',
  specialFunctionalitiesPlaceholder: 'Ej: Click en el botón al cliquear toda la landing, autoclick luego de 5 segundos, checkbox prefill, etc',
  requesterNamePlaceholder: 'Ingrese su nombre completo',
  jiraTaskUrlPlaceholder: 'Ingrese la URL de la task de Jira',
  linkDescriptionPlaceholder: 'Describa el enlace',
  subscriptionKeywordsPlaceholder: 'Ej: STOP to 9521, CLP to 9522',
  priceTextPlaceholder: 'Ej: 1.5 EUR/Day (VAT Inclusive)',
  referenceUrlPlaceholder: 'Ingrese la URL de referencia',
  colorDescriptionPlaceholder: 'Ej: Color principal, Color de botones, Color de fondo, etc.',
  
  // Flow type options
  flowTypes: {
    sms: 'Suscripción SMS',
    pin: 'Verificación PIN',
    redirect: 'Redirección Directa',
    download: 'Descarga de App',
    subscription: 'Servicio de Suscripción'
  },
  
  // Buttons and actions
  devIdInfo: 'Al generar la solicitud se creará un documento con un Dev ID que deberás adjuntar a la misma tarea de Jira que introdujiste <a href="#jira_task_url" class="jira-link">arriba</a>.',
  francoNotification: 'Esta información se enviará a Franco (franco@mediadigitalgroup.com)',
  generateBrief: 'Generar Solicitud',
  generating: 'Generando...',
  
  // Messages
  successMessage: '¡Solicitud generada exitosamente! Se descargará un PDF que deberás adjuntar al Jira Task',
  errorMessage: 'Error al generar la solicitud. Por favor intenta de nuevo.',
  fillAllFields: 'Por favor completa todos los campos requeridos.',
  
  // Email
  emailSubject: 'Nuevo Brief de Landing Page Generado'
};

export default es;