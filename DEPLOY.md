# Despliegue en Vercel

## ✅ Problemas solucionados:
- **Error 404**: Configuración de rutas y redirecciones corregida
- **Adaptador de Vercel**: Actualizado a la versión más reciente
- **Rutas estáticas**: Configuradas correctamente para prerender
- **Redirección de índice**: Implementada para redirigir automáticamente a `/es/`

## Pasos para desplegar la aplicación en Vercel:

### 1. Preparación del repositorio
- Asegúrate de que tu código esté en un repositorio de Git (GitHub, GitLab, etc.)
- Haz commit de todos los cambios recientes
- **Importante**: Todos los archivos de configuración ya están listos

### 2. Configuración en Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Importa tu repositorio
4. Vercel detectará automáticamente que es un proyecto Astro
5. **No cambies la configuración de build** - ya está optimizada

### 3. Variables de entorno
En la configuración del proyecto en Vercel, agrega las siguientes variables de entorno:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
RECIPIENT_EMAIL=email-destino@gmail.com
```

### 4. Configuración de Gmail (si usas Gmail)
1. Habilita la autenticación de 2 factores en tu cuenta de Gmail
2. Genera una "Contraseña de aplicación" (App Password)
3. Usa esta contraseña de aplicación en `SMTP_PASS`

### 5. Despliegue
- Haz clic en "Deploy"
- Vercel construirá y desplegará tu aplicación automáticamente
- Una vez completado, tendrás una URL pública para tu aplicación
- **La página principal (`/`) redirigirá automáticamente a `/es/`**

## 🔧 Archivos de configuración incluidos:
- `vercel.json`: Configuración específica para Vercel con redirecciones
- `astro.config.mjs`: Actualizado para usar el adaptador de Vercel más reciente
- `src/pages/index.astro`: Página de redirección con múltiples métodos (meta refresh + JavaScript)
- `src/pages/[lang]/index.astro`: Páginas estáticas prerenderizadas

## 🚀 Funcionalidades implementadas:
- **Rutas multiidioma**: `/es/` y `/en/`
- **Redirección automática**: `/` → `/es/`
- **Funciones serverless**: Para envío de emails
- **Páginas prerenderizadas**: Para mejor rendimiento
- **Configuración de rewrites**: Para manejo correcto de rutas

## ⚠️ Notas importantes:
- La aplicación usa funciones serverless para el envío de emails
- Asegúrate de que todas las variables de entorno estén configuradas correctamente
- El dominio será algo como: `tu-proyecto.vercel.app`
- **El error 404 ha sido solucionado** con la configuración actual

## 🔍 Solución de problemas:
Si aún experimentas problemas:
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs de build en Vercel
3. Asegúrate de que el repositorio esté actualizado con todos los cambios
4. La URL principal debe redirigir automáticamente a `/es/`