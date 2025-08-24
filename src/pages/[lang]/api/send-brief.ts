import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { useTranslations, getStaticPaths } from '../../../i18n';
import { getRequestsCollection, type RequestDocument } from '../../../lib/mongodb';

export { getStaticPaths };

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

// Check for missing variables
function checkEnvVars() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "RECIPIENT_EMAIL"];
  required.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`[WARNING] Missing environment variable: ${key}`);
    }
  });
}

checkEnvVars();

console.log("EMAIL_CONFIG:", EMAIL_CONFIG);
console.log("RECIPIENT_EMAIL:", RECIPIENT_EMAIL);

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const lang = params.lang!;
    const t = await useTranslations(lang as any)();
    const data = await request.json();

    // Environment variables validation (use process.env for serverless functions)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !RECIPIENT_EMAIL) {
      console.error('Missing required environment variables:', {
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASS: !!process.env.SMTP_PASS,
        RECIPIENT_EMAIL: !!RECIPIENT_EMAIL
      });
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error. Please contact administrator.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

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

    // Save request to MongoDB with timeout
    const mongoTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MongoDB operation timeout')), 8000);
    });
    
    try {
      const mongoOperation = async () => {
        const requestsCollection = await getRequestsCollection();
        const requestDocument: RequestDocument = {
          devId,
          requesterName: data.requester_name,
          jiraTaskUrl: data.jira_task_url,
          country: data.country,
          product: data.product,
          planType: data.plan_type,
          maxiApproval: data.maxi_approval,
          createdAt: new Date(),
          // Campos adicionales
          carriers: data.carriers,
          flowType: data.flow_type,
          trafficOrigin: data.traffic_origin,
          copies: data.copies,
          tcLinksFormatted: data.tc_links_formatted,
          languages: data.languages,
          banners: data.banners,
          additionalImages: data.additional_images,
          logos: data.logos,
          landingFlow: data.landing_flow,
          specialFeatures: data.special_features
        };
        
        await requestsCollection.insertOne(requestDocument);
        return `Request ${devId} saved to MongoDB successfully`;
      };
      
      const result = await Promise.race([mongoOperation(), mongoTimeout]);
      console.log(result);
    } catch (mongoError) {
      console.error('Error saving to MongoDB:', mongoError);
      // Continue with email sending even if MongoDB fails
    }

    // Email configuration
    let transporter;
    try {
      transporter = nodemailer.createTransport(EMAIL_CONFIG);
    } catch (transporterError) {
      console.error('Error creating email transporter:', transporterError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service configuration error.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Create email content with translations
    const emailContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 25px; padding: 15px; border-left: 4px solid #667eea; background: #f8f9fa; }
            .section h3 { margin-top: 0; color: #667eea; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${t.title}</h1>
            <p><strong>DevID:</strong> ${devId}</p>
            <p><strong>${t.languageSelector}:</strong> ${lang.toUpperCase()}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>1. ${t.maxiApproval}</h3>
              <div class="field">
                <span class="label">Maxi's Approval:</span>
                <span class="value">${data.maxi_approval || 'N/A'}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>2. ${t.landingInfo}</h3>
              <div class="field">
                <span class="label">${t.country}:</span>
                <span class="value">${data.country || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.carriers}:</span>
                <span class="value">${data.carriers || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.product}:</span>
                <span class="value">${data.product || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.flowType}:</span>
                <span class="value">${data.flow_type || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.trafficOrigin}:</span>
                <span class="value">${data.traffic_origin || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Plan Type:</span>
                <span class="value">${data.plan_type || 'N/A'}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>3. ${t.contentCopies}</h3>
              <div class="field">
                <span class="label">${t.copies}:</span>
                <div class="value">${String(data.copies || 'N/A').replace(/\n/g, '<br>')}</div>
              </div>
              <div class="field">
                <span class="label">${t.tcLinks}:</span>
                <span class="value">${data.tc_links_formatted || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.languages}:</span>
                <span class="value">${data.languages || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Subscription Keywords:</span>
                <span class="value">${data.subscription_keywords || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Price Text:</span>
                <span class="value">${data.price_text || 'N/A'}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>4. ${t.graphicResources}</h3>
              <div class="field">
                <span class="label">${t.banners}:</span>
                <div class="value">${data.banners && data.banners !== 'N/A' ? String(data.banners).replace(/\n/g, '<br>') : 'N/A'}</div>
              </div>
              <div class="field">
                <span class="label">${t.images}:</span>
                <div class="value">${data.images && data.images !== 'N/A' ? String(data.images).replace(/\n/g, '<br>') : 'N/A'}</div>
              </div>
              <div class="field">
                <span class="label">${t.logos}:</span>
                <div class="value">${data.logos && data.logos !== 'N/A' ? String(data.logos).replace(/\n/g, '<br>') : 'N/A'}</div>
              </div>
            </div>
            
            <div class="section">
              <h3>5. ${t.technicalFunctionalities}</h3>
              <div class="field">
                <span class="label">${t.technologyType}:</span>
                <span class="value">${data.technology_type === 'new' ? t.newTechnology : data.technology_type === 'old' ? t.oldTechnology : 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.specialFunctionalities}:</span>
                <div class="value">${String(data.special_functionalities || 'N/A').replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            
            <div class="section">
              <h3>6. ${t.colors}</h3>
              <div class="field">
                <span class="label">${t.colors}:</span>
                <div class="value">${data.colors_formatted || 'N/A'}</div>
              </div>
            </div>
            
            <div class="section">
              <h3>7. Reference Information</h3>
              <div class="field">
                <span class="label">Reference URL:</span>
                <span class="value">${data.reference_url || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Reference Image:</span>
                <span class="value">${data.reference_image && data.reference_image !== 'N/A' ? data.reference_image : 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Guidelines Document:</span>
                <span class="value">${data.guidelines_document && data.guidelines_document !== 'N/A' ? data.guidelines_document : 'N/A'}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>8. ${t.requesterInfo}</h3>
              <div class="field">
                <span class="label">${t.requesterName}:</span>
                <span class="value">${data.requester_name || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.jiraTaskUrl}:</span>
                <span class="value">${data.jira_task_url || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} | DevID: ${devId}</p>
          </div>
        </body>
      </html>
    `;

    // Send email
    try {
      await transporter.sendMail({
        from: EMAIL_CONFIG.auth.user,
        to: RECIPIENT_EMAIL,
        subject: `Req: ${data.country}-${data.product || 'N/A'}-${devId}-${data.requester_name}`,
        html: emailContent,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email. Please check email configuration.',
          details: emailError instanceof Error ? emailError.message : 'Unknown email error'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: t.successMessage,
        devId,
        language: lang
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending brief:', error);
    
    // Ensure we always return valid JSON
    const errorMessage = error instanceof Error ? error.message : 'Failed to send brief. Please try again.';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};