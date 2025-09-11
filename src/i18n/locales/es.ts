import type { Translations } from '../index';

const es: Translations = {
  // Navigation and UI
  title: 'Desarrollo de Landing Pages',
  subtitle: 'Genera una solicitud de desarrollo de landing page',
  languageSelector: 'Idioma',
  
  // Operation type
  operationType: 'Tipo de Operación',
  newLP: 'Nueva LP',
  modifyLP: 'Modificar LP',
  existingDevId: 'DevID Existente',
  existingDevIdPlaceholder: 'Ingresa el DevID de la LP a modificar',
  loadExistingData: 'Cargar Datos',
  devIdNotFound: 'DevID no encontrado',
  loadingData: 'Cargando datos...',
  
  // Form sections
  maxiApproval: 'Aprobación de Maxi',
  adminApproval: 'Aprobación de Maxi',
  campaignInfo: 'Información de la Campaña',
  basicInfo: 'Información Básica',
  landingInfo: 'Información de la Landing',
  landingPageInfo: 'Información de la Landing Page',
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
  tcLinks: 'Enlaces',
  languages: 'Idiomas',
  images: 'Imágenes',
  logos: 'Logos',
  flowType: 'Tipo de Flujo',
  specialFunctionalities: 'Funcionalidades Especiales',
  technologyType: 'Tipo de Tecnología',
  trafficSource: 'Origen del Tráfico',
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
  requesterName: 'Email del Solicitante',

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
  copiesPlaceholder: '• Términos y Condiciones: "Al suscribirte..."\n• Botón MSISDN: "CONTINUAR"\n• Botón PIN: "SUSCRIBIRSE"\n• Título principal: ".."\n• Subtítulos: ".."',
  tcLinksPlaceholder: 'Incluye todos los enlaces de Términos y Condiciones y legales...',
  languagesPlaceholder: 'ej., Inglés, Español, Francés...',
  imagesPlaceholder: 'Describe los requisitos de imágenes, fotos de producto, fondos...',
  logosPlaceholder: 'Especifica los logos necesarios, guías de marca y uso...',
  flowTypePlaceholder: 'Selecciona el tipo de flujo de conversión principal',
  specialFunctionalitiesPlaceholder: 'Ej: Click en el botón al cliquear toda la landing, autoclick luego de 5 segundos, checkbox prefill, etc',
  requesterNamePlaceholder: 'ejemplo@ejemplo.com',

  linkDescriptionPlaceholder: 'Ej: Licencias',
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

  francoNotification: 'Esta información se enviará a Franco (franco@mediadigitalgroup.com)',
  generateBrief: 'Generar Solicitud',
  saveChanges: 'Guardar Cambios',
  generating: 'Generando...',
  
  // Messages
  successMessage: '¡Solicitud generada exitosamente! Se descargará un PDF con la información de la solicitud',
  errorMessage: 'Error al generar la solicitud. Por favor intenta de nuevo.',
  fillAllFields: 'Por favor completa todos los campos requeridos.',
  
  // Email
  emailSubject: 'Nuevo Brief de Landing Page Generado',
  
  // Additional translations
  imagesAndBanners: 'Imágenes y Banners',
  optional: 'Opcional',
  filesSelected: 'archivo(s) seleccionado(s)',
  dataLoadedSuccessfully: 'Datos cargados correctamente',
  errorLoadingData: 'Error al cargar los datos',
  approved: 'Aprobado',
  pending: 'Pendiente',
  errorGeneratingPdf: 'Error al generar el documento PDF',
  remove: 'Eliminar',
  requesterEmailRequired: 'El campo Requester Email es obligatorio para guardar cambios.',
  tcLinkUrlPlaceholder: 'https://ejemplo.com/terminos',
  jiraRequester: 'Solicitante',
  jiraCountry: 'País',
  jiraProduct: 'Producto',
  jiraDescription: 'Descripción'
};

export default es;