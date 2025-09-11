# Guía Completa de Despliegue en Vercel

## 📋 Variables de Entorno Requeridas

Antes de desplegar, necesitarás configurar las siguientes variables de entorno en Vercel:

### Variables SMTP (Obligatorias)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-de-gmail
RECIPIENT_EMAIL=email-destino@gmail.com
```

### Variables MongoDB (Obligatorias)
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/
MONGODB_DB_NAME=DevRequest
```

### Variables JIRA (Opcionales)
```
JIRA_BASE_URL=https://tu-dominio.atlassian.net
JIRA_EMAIL=tu-email@empresa.com
JIRA_API_TOKEN=tu-api-token-de-jira
JIRA_PROJECT_KEY=DEV
```

## 🚀 Pasos para Desplegar

### 1. Preparar el Repositorio
```bash
# Asegúrate de que todos los cambios estén committeados
git add .
git commit -m "Preparando para despliegue en Vercel"
git push origin main
```

### 2. Configurar en Vercel

1. **Ir a Vercel**: Ve a [vercel.com](https://vercel.com) e inicia sesión
2. **Nuevo Proyecto**: Haz clic en "New Project"
3. **Importar Repositorio**: Selecciona tu repositorio de GitHub/GitLab
4. **Configuración Automática**: Vercel detectará automáticamente que es un proyecto Astro

### 3. Configurar Variables de Entorno

⚠️ **IMPORTANTE**: Configura TODAS las variables antes del primer despliegue

1. En la página de configuración del proyecto, ve a "Environment Variables"
2. Agrega cada variable **individualmente** (no uses "Import .env")
3. Para cada variable:
   - Nombre: `SMTP_HOST`
   - Valor: `smtp.gmail.com`
   - Entornos: Selecciona **Production**, **Preview**, y **Development**

### 4. Configuración de Gmail

Para usar Gmail como servidor SMTP:

1. **Habilitar 2FA**: Activa la autenticación de 2 factores en tu cuenta Google
2. **Generar App Password**:
   - Ve a [myaccount.google.com](https://myaccount.google.com)
   - Seguridad → Contraseñas de aplicaciones
   - Genera una nueva contraseña para "Correo"
   - Usa esta contraseña en `SMTP_PASS`

### 5. Configuración de MongoDB

1. **MongoDB Atlas**: Crea una cuenta en [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. **Crear Cluster**: Configura un cluster gratuito
3. **Obtener URI**: 
   - Ve a "Connect" → "Connect your application"
   - Copia la URI de conexión
   - Reemplaza `<password>` con tu contraseña real

## 🔧 Solución de Problemas Comunes

### Error: "No environment variables were created"

**Solución**:
1. Elimina variables duplicadas existentes
2. Crea variables una por una (no en lote)
3. Verifica que no haya espacios extra en nombres/valores
4. Redesplega después de agregar variables

### Error: "500 FUNCTION_INVOCATION_FAILED"

**Causas comunes**:
- Variables de entorno faltantes o incorrectas
- Problemas de conexión a MongoDB
- Configuración SMTP incorrecta

**Solución**:
1. Verifica que todas las variables estén configuradas
2. Revisa los logs en Vercel Dashboard → Functions
3. Prueba la conexión SMTP con las credenciales

### Error: "SyntaxError: Unexpected token"

**Causa**: La API está devolviendo HTML en lugar de JSON
**Solución**: Verifica que todas las variables de entorno estén configuradas correctamente

## 📝 Lista de Verificación Pre-Despliegue

- [ ] Repositorio actualizado en GitHub/GitLab
- [ ] Variables SMTP configuradas y probadas
- [ ] Base de datos MongoDB creada y accesible
- [ ] Variables JIRA configuradas (si se usa)
- [ ] Todas las variables agregadas en Vercel
- [ ] Primer despliegue completado exitosamente

## 🎯 Después del Despliegue

1. **Probar Funcionalidad**:
   - Genera una solicitud de prueba
   - Verifica que llegue el email
   - Confirma que se guarde en MongoDB

2. **Configurar Dominio Personalizado** (Opcional):
   - Ve a Settings → Domains en Vercel
   - Agrega tu dominio personalizado

3. **Monitoreo**:
   - Revisa los logs en Vercel Dashboard
   - Configura alertas si es necesario

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Vercel Dashboard → Functions
2. Verifica la configuración de variables de entorno
3. Consulta la documentación de Vercel para Astro

---

✅ **El proyecto está optimizado para Vercel y debería desplegarse sin problemas siguiendo esta guía.**