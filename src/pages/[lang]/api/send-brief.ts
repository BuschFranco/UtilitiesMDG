import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';
import { useTranslations, getStaticPaths } from '../../../i18n';
import { getRequestsCollection, type RequestDocument } from '../../../lib/mongodb';
import JiraService from '../../../services/jira';

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

// Function to generate PDF using jsPDF
async function generatePDF(data: any, devId: string, t: any): Promise<Buffer> {
  const doc = new jsPDF();
  
  // Use already processed formatted data
  const colorsFormatted = data.colors_formatted || 'N/A';
  const tcLinksFormatted = data.tc_links_formatted || 'N/A';
  
  // Set up document properties
  doc.setProperties({
    title: `Brief Request - ${devId}`,
    subject: 'Development Request Brief',
    author: 'MDG System',
    creator: 'DevRequest Application'
  });
  
  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };
  
  // Helper function to add a section header
  const addSectionHeader = (title: string, y: number) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 150, 243); // Blue color
    doc.text(title, 20, y);
    doc.setDrawColor(33, 150, 243);
    doc.line(20, y + 2, 190, y + 2); // Underline
    return y + 12;
  };
  
  // Helper function to add a field
  const addField = (label: string, value: string, y: number) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51); // Dark gray
    doc.text(label + ':', 25, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(102, 102, 102); // Light gray
    const cleanValue = String(value || 'N/A').replace(/\n/g, ' ').substring(0, 200); // Limit length
    return addWrappedText(cleanValue, 80, y, 110, 5);
  };
  
  let currentY = 20;
  
  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(t.title || 'Brief Request', 105, currentY, { align: 'center' });
  
  currentY += 10;
  doc.setFontSize(16);
  doc.setTextColor(211, 47, 47); // Red color
  doc.text(`DevID: ${devId}`, 105, currentY, { align: 'center' });
  
  currentY += 8;
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 105, currentY, { align: 'center' });
  
  currentY += 15;
  
  // Section 1: Basic Info
  currentY = addSectionHeader(`1. ${t.basicInfo || 'Basic Information'}`, currentY);
  currentY = addField(t.country || 'Country', data.country, currentY) + 3;
  currentY = addField(t.carriers || 'Carriers', data.carriers, currentY) + 3;
  currentY = addField(t.product || 'Product', data.product, currentY) + 8;
  
  // Section 2: Landing Page Info
  currentY = addSectionHeader(`2. ${t.landingPageInfo || 'Landing Page Information'}`, currentY);
  currentY = addField(t.flowType || 'Flow Type', data.flow_type, currentY) + 3;
  currentY = addField(t.trafficSource || 'Traffic Source', data.traffic_origin, currentY) + 8;
  
  // Section 3: Content & Copies
  currentY = addSectionHeader(`3. ${t.contentCopies || 'Content & Copies'}`, currentY);
  currentY = addField(t.copies || 'Copies', data.copies, currentY) + 3;
  currentY = addField(t.links || 'Links', tcLinksFormatted, currentY) + 3;
  currentY = addField(t.languageSelector || 'Languages', data.languages, currentY) + 8;
  
  // Check if we need a new page
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  // Section 4: Graphic Resources
  currentY = addSectionHeader(`4. ${t.graphicResources || 'Graphic Resources'}`, currentY);
  currentY = addField(t.images || 'Images', data.images, currentY) + 3;
  currentY = addField(t.logos || 'Logos', data.logos, currentY) + 3;
  currentY = addField(t.colors || 'Colors', colorsFormatted, currentY) + 8;
  
  // Section 5: Technical Functionalities
  currentY = addSectionHeader(`5. ${t.technicalFunctionalities || 'Technical Functionalities'}`, currentY);
  currentY = addField(t.specialFunctionalities || 'Special Functionalities', data.special_functionalities, currentY) + 3;
  currentY = addField('Subscription Keywords', data.subscription_keywords, currentY) + 3;
  currentY = addField('Price Text', data.price_text, currentY) + 8;
  
  // Section 6: Requester Info
  currentY = addSectionHeader(`6. ${t.requesterInfo || 'Requester Information'}`, currentY);
  currentY = addField(t.requesterName || 'Requester Name', data.requester_name, currentY) + 8;
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(136, 136, 136);
    doc.text(`Generated on ${new Date().toLocaleString()} | DevID: ${devId} | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }
  
  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const lang = params.lang!;
    const t = await useTranslations(lang as any)();
    const formData = await request.formData();
    
    // Convert FormData to object
    const data: any = {};
    const files: { [key: string]: File | File[] } = {};
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Handle multiple files for the same field
        if (files[key]) {
          if (Array.isArray(files[key])) {
            (files[key] as File[]).push(value);
          } else {
            files[key] = [files[key] as File, value];
          }
        } else {
          files[key] = value;
        }
      } else {
        if (key.endsWith('[]')) {
          const cleanKey = key.replace('[]', '');
          if (!data[cleanKey]) {
            data[cleanKey] = [];
          }
          data[cleanKey].push(value);
        } else {
          data[key] = value;
        }
      }
    }
    
    // Process colors data
     if (data.colors && data.color_descriptions) {
       const colorEntries = [];
       for (let i = 0; i < data.colors.length; i++) {
         if (data.colors[i] && data.color_descriptions[i]) {
           colorEntries.push(`${data.colors[i]} - ${data.color_descriptions[i]}`);
         }
       }
       data.colors_formatted = colorEntries.length > 0 ? colorEntries.join(', ') : 'N/A';
     } else {
       data.colors_formatted = 'N/A';
     }

     // Process TC links data
     if (data.tc_links && data.tc_descriptions) {
       const tcEntries = [];
       for (let i = 0; i < data.tc_links.length; i++) {
         if (data.tc_links[i] && data.tc_descriptions[i]) {
           tcEntries.push(`${data.tc_descriptions[i]}: ${data.tc_links[i]}`);
         }
       }
       data.tc_links_formatted = tcEntries.length > 0 ? tcEntries.join(', ') : 'N/A';
     } else {
       data.tc_links_formatted = 'N/A';
     }
     
     // Ensure all required fields have default values
     const requiredFields = {
       requester_name: 'N/A',
       country: 'N/A',
       product: 'N/A',
       flow_type: 'N/A',
       carriers: 'N/A',
       traffic_origin: 'N/A',
       plan_type: 'N/A',
       copies: 'N/A',
       languages: 'N/A',
       subscription_keywords: 'N/A',
       price_text: 'N/A',
       special_functionalities: 'N/A'
     };
     
     // Apply defaults for missing fields
     Object.keys(requiredFields).forEach(field => {
       if (!data[field] || data[field] === '') {
         data[field] = requiredFields[field];
       }
     });
     


     // Process file information for display
      ['images', 'logos'].forEach(field => {
       if (files[field]) {
         if (Array.isArray(files[field])) {
           data[field] = (files[field] as File[]).map(f => f.name).join(', ');
         } else {
           data[field] = (files[field] as File).name;
         }
       } else {
         data[field] = 'N/A';
       }
     });

     ['reference_image', 'guidelines_document'].forEach(field => {
       if (files[field]) {
         if (Array.isArray(files[field])) {
           data[field] = (files[field] as File[]).map(f => f.name).join(', ');
         } else {
           data[field] = (files[field] as File).name;
         }
       } else {
         data[field] = 'N/A';
       }
     });

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
    
    // Determine if this is an update or new record
    const isUpdate = data.operation_type === 'modify' && data.existing_devid;
    const devId = isUpdate ? data.existing_devid : generateDevID();

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
          country: data.country,
          product: data.product,
          planType: data.plan_type,
          maxiApproval: data.maxi_approval,
          createdAt: new Date(),
          modify: isUpdate ? true : false,
          // Campos adicionales
          carriers: data.carriers,
          flowType: data.flow_type,
          trafficOrigin: data.traffic_origin,
          copies: data.copies,
          tcLinksFormatted: data.tc_links_formatted,
          // Arrays originales para repoblar formulario
          tcLinks: data.tc_links,
          tcDescriptions: data.tc_descriptions,
          colors: data.colors,
          colorDescriptions: data.color_descriptions,
          // Campos que faltaban
          subscriptionKeywords: data.subscription_keywords,
          priceText: data.price_text,
          specialFunctionalities: data.special_functionalities,
          referenceUrl: data.reference_url,
          languages: data.languages,
          logos: data.logos
        };
        
        if (isUpdate) {
          // Get existing record to check adminApproval status
          const existingRecord = await requestsCollection.findOne({ devId: devId });
          
          if (!existingRecord) {
            throw new Error(`No record found with DevID: ${devId}`);
          }
          
          // If adminApproval is "Aprobado", change it to "Pending"
          const updateData = {
            ...requestDocument,
            updatedAt: new Date()
          };
          
          if (existingRecord.adminApproval == "Aprobado") {
            updateData.adminApproval = "Pending";
          }
          
          // Update existing record
          const updateResult = await requestsCollection.updateOne(
            { devId: devId },
            { 
              $set: updateData
            }
          );
          
          return `Request ${devId} updated in MongoDB successfully`;
        } else {
          // Insert new record
          await requestsCollection.insertOne(requestDocument);
          return `Request ${devId} saved to MongoDB successfully`;
        }
      };
      
      const result = await Promise.race([mongoOperation(), mongoTimeout]);
      console.log(result);
    } catch (mongoError) {
      console.error('Error saving to MongoDB:', mongoError);
      // Continue with email sending even if MongoDB fails
    }

    // Process and format data after MongoDB operation
    // Format colors
    if (data.colors && Array.isArray(data.colors) && data.color_descriptions && Array.isArray(data.color_descriptions)) {
      const colorPairs = data.colors.map((color: string, index: number) => {
        const description = data.color_descriptions[index] || '';
        return description ? `${color}: ${description}` : color;
      }).filter(Boolean);
      data.colors_formatted = colorPairs.length > 0 ? colorPairs.join('<br>') : 'N/A';
    } else {
      data.colors_formatted = 'N/A';
    }

    // Format T&C links
    if (data.tc_links && Array.isArray(data.tc_links) && data.tc_descriptions && Array.isArray(data.tc_descriptions)) {
      const tcPairs = data.tc_links.map((link: string, index: number) => {
        const description = data.tc_descriptions[index] || '';
        return description ? `${description}: ${link}` : link;
      }).filter(Boolean);
      data.tc_links_formatted = tcPairs.length > 0 ? tcPairs.join('<br>') : 'N/A';
    } else {
      data.tc_links_formatted = 'N/A';
    }

    // Default values already applied earlier in the process

    // Process file names for display
    ['images', 'logos', 'reference_image', 'guidelines_document'].forEach(field => {
      if (files[field]) {
        if (Array.isArray(files[field])) {
          data[field] = (files[field] as File[]).map(file => file.name).join(', ');
        } else {
          data[field] = (files[field] as File).name;
        }
      } else {
        data[field] = 'N/A';
      }
    });

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

    // Create Jira task first to get issueKey
    let issueKey = null;
    try {
      const jiraService = new JiraService();
      if (jiraService.isConfigured()) {
        console.log('Creating Jira task for DevID:', devId);
        
        const pdfBuffer = await generatePDF(data, devId, t);
        
        // Define title prefix for Jira task
        const titlePrefix = isUpdate ? '[MODIFY] ' : '[NEW] ';
        
        const issueData = {
          devId: devId,
          title: `${titlePrefix}${data.country} - ${data.product || 'N/A'} - ${data.requester_name}`,
          description: `Brief request generated with DevID: ${devId}\n\nRequester: ${data.requester_name}\nCountry: ${data.country}\nProduct: ${data.product || 'N/A'}\n\nThis task was automatically created when the brief request was submitted.`,
          requester: data.requester_name || 'Unknown',
          country: data.country || 'Unknown',
          product: data.product || 'Unknown'
        };
        
        const imageFiles: { [key: string]: File } = {};
        ['images', 'logos', 'reference_image', 'guidelines_document'].forEach(field => {
          if (files[field]) {
            if (Array.isArray(files[field])) {
              (files[field] as File[]).forEach((file, index) => {
                imageFiles[`${field}_${index}`] = file;
              });
            } else {
              imageFiles[field] = files[field] as File;
            }
          }
        });
        
        const issueResult = await jiraService.createIssueWithMultipleAttachments(
          issueData,
          pdfBuffer,
          `${data.country}-${data.product || 'N/A'}-${devId}-${data.requester_name}.pdf`,
          imageFiles
        );
        
        issueKey = issueResult.issueKey;
        console.log('Jira task created successfully with PDF attachment:', issueKey);
        
        // Save Jira task key to database
        if (issueKey) {
          try {
            const requestsCollection = await getRequestsCollection();
            if (isUpdate) {
              await requestsCollection.updateOne(
                { devId },
                { $set: { jiraTaskKey: issueKey, updatedAt: new Date() } }
              );
              console.log(`Jira task key ${issueKey} updated for DevID ${devId}`);
            } else {
              await requestsCollection.updateOne(
                { devId },
                { $set: { jiraTaskKey: issueKey } }
              );
              console.log(`Jira task key ${issueKey} saved for DevID ${devId}`);
            }
          } catch (dbError) {
            console.error('Error saving Jira task key to database:', dbError);
          }
        }
      } else {
        console.log('Jira not configured, skipping task creation');
      }
    } catch (jiraError) {
      console.error('Error creating Jira task (non-critical):', jiraError);
      // Don't fail the entire request if Jira fails
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
              <h3>1. ${t.landingInfo}</h3>
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
                <span class="label">${t.trafficSource}:</span>
                <span class="value">${data.traffic_origin || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.planType}:</span>
                <span class="value">${data.plan_type || 'N/A'}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>2. ${t.contentCopies}</h3>
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
                <span class="label">${t.subscriptionKeywords}:</span>
                <span class="value">${data.subscription_keywords || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">${t.priceText}:</span>
                <span class="value">${data.price_text || 'N/A'}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>3. ${t.graphicResources}</h3>
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
              <h3>4. ${t.technicalFunctionalities}</h3>

              <div class="field">
                <span class="label">${t.specialFunctionalities}:</span>
                <div class="value">${String(data.special_functionalities || 'N/A').replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            
            <div class="section">
              <h3>5. ${t.colors}</h3>
              <div class="field">
                <span class="label">${t.colors}:</span>
                <div class="value">${data.colors_formatted || 'N/A'}</div>
              </div>
            </div>
            
            <div class="section">
              <h3>6. Reference Information</h3>
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
              <h3>7. ${t.requesterInfo}</h3>
              <div class="field">
                <span class="label">${t.requesterName}:</span>
                <span class="value">${data.requester_name || 'N/A'}</span>
              </div>
              ${issueKey ? `
              <div class="field">
                <span class="label">Jira Task:</span>
                <span class="value"><a href="${process.env.JIRA_BASE_URL}/browse/${issueKey}" target="_blank">${issueKey}</a></span>
              </div>` : ''}
            </div>
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} | DevID: ${devId}</p>
          </div>
        </body>
      </html>
    `;

    // Generate PDF for email attachment
    const pdfBuffer = await generatePDF(data, devId, t);
    
    // Prepare attachments
    const attachments = [];
    
    // Add PDF attachment
    attachments.push({
      filename: `LP_Brief_${devId}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    });
    
    // Add other file attachments
    for (const [key, file] of Object.entries(files)) {
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(buffer),
          contentType: file.type
        });
      }
    }

    // Send email
    try {
      const emailSubjectPrefix = isUpdate ? '[Modify] ' : '';
      await transporter.sendMail({
        from: EMAIL_CONFIG.auth.user,
        to: RECIPIENT_EMAIL,
        subject: `${emailSubjectPrefix}Req: ${data.country}-${data.product || 'N/A'}-${devId}-${data.requester_name}`,
        html: emailContent,
        attachments: attachments
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

    // Jira task creation was moved earlier in the process

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