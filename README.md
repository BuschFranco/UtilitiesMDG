# 📋 Generador de Brief para Landing Pages

Aplicación web desarrollada en Astro para generar briefs de landing pages y enviarlos por email con un ID único.

## 🚀 Características

- **Formulario completo de brief** con todos los campos necesarios
- **Generación automática de ID único** para cada landing
- **Envío por email** con formato HTML profesional
- **Interfaz moderna y responsive**
- **Validación de formularios**
- **Indicadores de carga**

## 📋 Campos del Brief

### 1. Aprobación de Admin
- Luz verde para desarrollo (Sí/No)

### 2. Información básica de la campaña
- País donde se lanza la campaña
- Carrier(s)
- Origen de tráfico (Google Ads / Afiliados)

### 3. Contenido y copys
- Copys completos (textos, T&C, keywords de desuscripción)
- Links a T&C
- Idiomas (multi-language: Sí/No)

### 4. Recursos gráficos
- Banners (adjuntar o pedir a Juli)
- Imágenes adicionales
- Logos

### 5. Flujo y funcionalidades técnicas
- Flujo de la landing (ONE CLICK / MSISDN + PIN / HE PIN)
- Funcionalidades especiales

## ⚙️ Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Editar el archivo `.env` con tu configuración de email:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# Recipient email
RECIPIENT_EMAIL=tu-email@gmail.com
```

### 3. Configuración para Gmail

Para usar Gmail como servidor SMTP:

1. **Habilitar autenticación de 2 factores** en tu cuenta de Google
2. **Generar una contraseña de aplicación**:
   - Ve a tu cuenta de Google → Seguridad
   - En "Acceder a Google", selecciona "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
   - Usa esta contraseña en `SMTP_PASS` (no tu contraseña normal)

### 4. Otros proveedores de email

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

### Producción
```bash
# Construir la aplicación
npm run build

# Ejecutar en producción
npm run preview
```

## 📧 Formato del Email

Cuando se envía un brief, se genera:

- **ID único** en formato: `LP-{timestamp}-{uuid}`
- **Email HTML** con formato profesional
- **Todas las secciones** del brief organizadas
- **Timestamp** de creación

## 🛠️ Tecnologías

- **Astro** - Framework web
- **TypeScript** - Tipado estático
- **Nodemailer** - Envío de emails
- **UUID** - Generación de IDs únicos
- **CSS moderno** - Estilos responsive

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── BriefForm.astro     # Componente del formulario
├── layouts/
│   └── Layout.astro        # Layout principal
├── pages/
│   ├── api/
│   │   └── send-brief.ts   # API endpoint para envío
│   └── index.astro         # Página principal
public/
└── favicon.svg
```

## 🔧 Personalización

### Modificar campos del formulario
Edita `src/components/BriefForm.astro` para agregar o modificar campos.

### Cambiar formato del email
Modifica la función `formatBriefEmail` en `src/pages/api/send-brief.ts`.

### Personalizar estilos
Los estilos están en `src/layouts/Layout.astro` y en cada componente.

## 🐛 Solución de problemas

### Error de autenticación SMTP
- Verifica que las credenciales sean correctas
- Para Gmail, asegúrate de usar una contraseña de aplicación
- Verifica que el 2FA esté habilitado

### Error "Cannot find module"
- Ejecuta `npm install` para instalar dependencias
- Verifica que todas las importaciones sean correctas

### Formulario no se envía
- Abre las herramientas de desarrollador (F12)
- Revisa la consola para errores
- Verifica que el servidor esté ejecutándose en modo SSR

## 📝 Licencia

Este proyecto es de uso interno para MDG.

## 👥 Contribuir

Para contribuir al proyecto:

1. Crea una rama para tu feature
2. Realiza tus cambios
3. Prueba la funcionalidad
4. Crea un pull request

---

**Desarrollado para MDG - Sistema de Brief para Landing Pages**
