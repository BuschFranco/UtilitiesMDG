# Script de Despliegue Automatizado para Vercel
# Ejecutar con: .\deploy-to-vercel.ps1

Write-Host "Iniciando proceso de despliegue a Vercel..." -ForegroundColor Green
Write-Host ""

# Verificar si estamos en un repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "Error: No se detecto un repositorio Git" -ForegroundColor Red
    Write-Host "Ejecuta: git init && git add . && git commit -m 'Initial commit'" -ForegroundColor Yellow
    exit 1
}

# Verificar si hay cambios sin commitear
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Detectados cambios sin commitear. Commiteando automaticamente..." -ForegroundColor Yellow
    git add .
    git commit -m "Preparando para despliegue en Vercel - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    Write-Host "Cambios commiteados" -ForegroundColor Green
}

# Verificar dependencias
Write-Host "Verificando dependencias..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Dependencias verificadas" -ForegroundColor Green

# Verificar build local
Write-Host "Probando build local..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en build local. Revisa los errores antes de desplegar" -ForegroundColor Red
    exit 1
}
Write-Host "Build local exitoso" -ForegroundColor Green

# Limpiar build local
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Push a repositorio remoto
Write-Host "Subiendo cambios al repositorio..." -ForegroundColor Cyan
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error subiendo al repositorio remoto" -ForegroundColor Red
    exit 1
}
Write-Host "Cambios subidos al repositorio" -ForegroundColor Green

Write-Host ""
Write-Host "Preparacion completada!" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Ve a https://vercel.com e inicia sesion" -ForegroundColor White
Write-Host "2. Haz clic en 'New Project'" -ForegroundColor White
Write-Host "3. Importa este repositorio" -ForegroundColor White
Write-Host "4. Configura las variables de entorno:" -ForegroundColor White
Write-Host ""
Write-Host "   Variables SMTP (OBLIGATORIAS):" -ForegroundColor Cyan
Write-Host "   - SMTP_HOST=smtp.gmail.com" -ForegroundColor Gray
Write-Host "   - SMTP_PORT=587" -ForegroundColor Gray
Write-Host "   - SMTP_USER=tu-email@gmail.com" -ForegroundColor Gray
Write-Host "   - SMTP_PASS=tu-app-password" -ForegroundColor Gray
Write-Host "   - RECIPIENT_EMAIL=destino@gmail.com" -ForegroundColor Gray
Write-Host ""
Write-Host "   Variables MongoDB (OBLIGATORIAS):" -ForegroundColor Cyan
Write-Host "   - MONGODB_URI=mongodb+srv://..." -ForegroundColor Gray
Write-Host "   - MONGODB_DB_NAME=DevRequest" -ForegroundColor Gray
Write-Host ""
Write-Host "   Variables JIRA (OPCIONALES):" -ForegroundColor Cyan
Write-Host "   - JIRA_BASE_URL=https://tu-dominio.atlassian.net" -ForegroundColor Gray
Write-Host "   - JIRA_EMAIL=tu-email@empresa.com" -ForegroundColor Gray
Write-Host "   - JIRA_API_TOKEN=tu-token" -ForegroundColor Gray
Write-Host "   - JIRA_PROJECT_KEY=DEV" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Haz clic en 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "Para mas detalles, consulta: VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tu proyecto esta listo para desplegarse en Vercel!" -ForegroundColor Green