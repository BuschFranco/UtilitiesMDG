import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

// Email configuration - You should set these as environment variables
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
};

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'your-email@gmail.com';

interface BriefData {
  maxi_approval: string;
  country: string;
  carriers: string;
  product?: string;
  flow_type: string;
  traffic_source: string[];
  copys: string;
  tc_links?: string;
  multilanguage: string;
  banners?: string;
  additional_images?: string;
  logos?: string;
  landing_flow: string;
  special_features?: string;
}

function formatBriefEmail(data: BriefData, devId: string): string {
  const trafficSources = Array.isArray(data.traffic_source) 
    ? data.traffic_source.join(', ') 
    : data.traffic_source || 'No especificado';

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nuevo Brief de Landing Page</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
        .landing-id { background: #f8f9fa; border: 2px solid #2563eb; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
        .landing-id strong { color: #2563eb; font-size: 1.2em; }
        .section { margin-bottom: 25px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
        .section h3 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; }
        .field { margin-bottom: 12px; }
        .field strong { color: #1e293b; }
        .approval-yes { color: #10b981; font-weight: bold; }
        .approval-no { color: #ef4444; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Nuevo Brief de Landing Page</h1>
        <p>Generado automáticamente desde el sistema de briefs</p>
    </div>

    <div class="landing-id">
        <strong>🆔 DevID: ${devId}</strong>
    </div>

    <div class="section">
        <h3>1. Aprobación de Maxi</h3>
        <div class="field">
            <strong>Luz verde para desarrollo:</strong> 
            <span class="${data.maxi_approval === 'si' ? 'approval-yes' : 'approval-no'}">
                ${data.maxi_approval === 'si' ? '✅ SÍ' : '❌ NO'}
            </span>
        </div>
    </div>

    <div class="section">
        <h3>2. Información de la Landing</h3>
        <div class="field"><strong>País:</strong> ${data.country}</div>
        <div class="field"><strong>Carrier(s):</strong> ${data.carriers}</div>
        <div class="field"><strong>Producto:</strong> ${data.product || 'No especificado'}</div>
        <div class="field"><strong>Tipo de Flujo:</strong> ${data.flow_type || 'No especificado'}</div>
        <div class="field"><strong>Origen de tráfico:</strong> ${trafficSources}</div>
        <div class="field"><strong>Plan Type:</strong> ${data.plan_type || 'No especificado'}</div>
    </div>

    <div class="section">
        <h3>3. Contenido y copys</h3>
        <div class="field"><strong>Copys completos:</strong><br>${data.copys.replace(/\n/g, '<br>')}</div>
        <div class="field"><strong>Links a T&C:</strong> ${data.tc_links || 'No especificado'}</div>
        <div class="field"><strong>Multi-language:</strong> ${data.multilanguage === 'si' ? 'Sí' : 'No'}</div>
        <div class="field"><strong>Subscription Keywords:</strong> ${data.subscription_keywords || 'No especificado'}</div>
        <div class="field"><strong>Price Text:</strong> ${data.price_text || 'No especificado'}</div>
    </div>

    <div class="section">
        <h3>4. Recursos gráficos</h3>
        <div class="field"><strong>Banners:</strong> ${data.banners && data.banners !== 'N/A' ? data.banners : 'No especificado'}</div>
        <div class="field"><strong>Imágenes adicionales:</strong> ${data.additional_images && data.additional_images !== 'N/A' ? data.additional_images : 'No especificado'}</div>
        <div class="field"><strong>Logos:</strong> ${data.logos && data.logos !== 'N/A' ? data.logos : 'No especificado'}</div>
    </div>

    <div class="section">
        <h3>5. Flujo y funcionalidades técnicas</h3>
        <div class="field"><strong>Tipo de tecnología:</strong> ${data.technology_type === 'new' ? 'Nueva Tecnología' : data.technology_type === 'old' ? 'Vieja Tecnología (mobi)' : 'No especificado'}</div>
        <div class="field"><strong>Flujo de la landing:</strong> ${data.flow_type || 'No especificado'}</div>
        <div class="field"><strong>Funcionalidades especiales:</strong> ${data.special_functionalities || 'No especificado'}</div>
    </div>
    
    <div class="section">
        <h3>6. Colores</h3>
        <div class="field"><strong>Colores:</strong> ${data.colors_formatted || 'No especificado'}</div>
    </div>
    
    <div class="section">
          <h3>7. Reference Information</h3>
          <div class="field"><strong>Reference URL:</strong> ${data.reference_url || 'No especificado'}</div>
          <div class="field"><strong>Reference Image:</strong> ${data.reference_image && data.reference_image !== 'N/A' ? data.reference_image : 'N/A'}</div>
          <div class="field"><strong>Guidelines Document:</strong> ${data.guidelines_document && data.guidelines_document !== 'N/A' ? data.guidelines_document : 'N/A'}</div>
      </div>
      
      <div class="section">
          <h3>8. Información del solicitante</h3>
          <div class="field"><strong>Nombre del solicitante:</strong> ${data.requester_name || 'No especificado'}</div>
          <div class="field"><strong>URL de tarea Jira:</strong> ${data.jira_task_url || 'No especificado'}</div>
      </div>

    <div class="footer">
        <p>📅 Generado el: ${new Date().toLocaleString('es-ES')}</p>
        <p>🔗 Sistema de Brief para Landing Pages</p>
    </div>
</body>
</html>
  `;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: BriefData = await request.json();
    
    // Generate unique landing ID
    // Generate unique DevID (5 characters)
  const generateDevID = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  const devId = generateDevID();
    
    // Create transporter
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    
    // Verify connection
    await transporter.verify();
    
    // Email content
    const htmlContent = formatBriefEmail(data, devId);
    
    // Send email
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: RECIPIENT_EMAIL,
      subject: `Req: ${data.country}-${data.product || 'N/A'}-${devId}-${data.requester_name}`,
      html: htmlContent
    };
    
    await transporter.sendMail(mailOptions);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        devId,
        message: 'Brief enviado exitosamente' 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error al enviar el brief. Por favor, inténtelo de nuevo.' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};