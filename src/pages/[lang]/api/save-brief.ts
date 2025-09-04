import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { useTranslations, getStaticPaths } from '../../../i18n';
import { getRequestsCollection, type RequestDocument } from '../../../lib/mongodb';

export { getStaticPaths };

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
};

// Function to generate DevID
function generateDevId(): string {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Function to send DevID email to requester
async function sendDevIdEmail(requesterEmail: string, devId: string, t: any): Promise<void> {
  const transporter = nodemailer.createTransport(EMAIL_CONFIG);

  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b45db, #7c3aed); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .devid { background: #e7f3ff; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; font-size: 18px; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Development Request Saved</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Your development request has been successfully saved in our system.</p>
          <div class="devid">
            Your DevID: <span style="color: #2196F3;">${devId}</span>
          </div>
          <p><strong>Please save this DevID for future reference.</strong> You can use it to:</p>
          <ul>
            <li>Track the status of your request</li>
            <li>Make modifications to your request</li>
            <li>Reference this request in future communications</li>
          </ul>
          <p>Thank you for using our development request system.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from MDG Development System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: EMAIL_CONFIG.auth.user,
    to: requesterEmail,
    subject: `Development Request Saved - DevID: ${devId}`,
    html: emailContent
  };

  await transporter.sendMail(mailOptions);
}

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const lang = params.lang || 'en';
    const t = useTranslations(lang);
    const formData = await request.formData();
    
    // Convert FormData to object
    const data: any = {};
    for (const [key, value] of formData.entries()) {
      if (key.endsWith('[]')) {
        const arrayKey = key.slice(0, -2);
        if (!data[arrayKey]) data[arrayKey] = [];
        data[arrayKey].push(value);
      } else {
        data[key] = value;
      }
    }

    // Use existing DevID if modifying, otherwise generate new one
    const devId = data.existing_devid || generateDevId();
    const isModifying = !!data.existing_devid;
    
    // Prepare document for database
    const requestDocument: RequestDocument = {
      devId,
      requesterEmail: data.requester_email,
      country: data.country,
      product: data.product,
      planType: data.plan_type,
      maxiApproval: 'Pending',
      createdAt: new Date(),
      modify: false,
      type: isModifying ? 'modify' : 'saved',
      carriers: data.carriers,
      flowType: data.flow_type,
      trafficOrigin: data.traffic_origin,
      copies: data.copies,
      tcLinksFormatted: Array.isArray(data.tc_links) ? data.tc_links.join(', ') : data.tc_links,
      tcLinks: Array.isArray(data.tc_links) ? data.tc_links : [data.tc_links].filter(Boolean),
      tcDescriptions: Array.isArray(data.tc_descriptions) ? data.tc_descriptions : [data.tc_descriptions].filter(Boolean),
      colors: Array.isArray(data.colors) ? data.colors : [data.colors].filter(Boolean),
      colorDescriptions: Array.isArray(data.color_descriptions) ? data.color_descriptions : [data.color_descriptions].filter(Boolean),
      subscriptionKeywords: data.subscription_keywords,
      priceText: data.price_text,
      specialFunctionalities: data.special_functionalities,
      referenceUrl: data.reference_url,
      images: data.images,
      languages: data.languages,
      logos: data.logos
    };

    // Save to database
    const collection = await getRequestsCollection();
    
    if (isModifying) {
      // Update existing record
      await collection.updateOne(
        { devId: devId },
        { $set: requestDocument }
      );
    } else {
      // Insert new record
      await collection.insertOne(requestDocument);
    }

    // Send DevID email to requester (don't let email errors prevent saving)
    if (data.requester_email && data.requester_email.trim() !== '' && data.requester_email !== 'N/A') {
      try {
        await sendDevIdEmail(data.requester_email, devId, t);
      } catch (emailError) {
        console.error('Error sending DevID email:', emailError);
        // Continue execution - don't fail the entire operation
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Request saved successfully',
      devId: devId
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error saving request:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error saving request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};