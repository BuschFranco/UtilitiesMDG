import type { APIRoute } from 'astro';
import { useTranslations, getStaticPaths } from '../../../i18n';

export { getStaticPaths };

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const lang = params.lang!;
    const t = await useTranslations(lang as any)();
    const data = await request.json();

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

    // Create PDF content as HTML (will be converted to PDF on frontend)
    const pdfContent = {
      devId,
      timestamp: new Date().toLocaleString(),
      language: lang.toUpperCase(),
      data: {
        country: data.country || 'N/A',
        carriers: data.carriers || 'N/A',
        product: data.product || 'N/A',
        flow_type: data.flow_type || 'N/A',
        traffic_origin: data.traffic_origin || 'N/A',
        plan_type: data.plan_type || 'N/A',
        copies: String(data.copies || 'N/A').replace(/\n/g, '<br>'),
        tc_links_formatted: data.tc_links_formatted || 'N/A',
        languages: data.languages || 'N/A',
        images: String(data.images || 'N/A').replace(/\n/g, '<br>'),
        logos: String(data.logos || 'N/A').replace(/\n/g, '<br>'),
        special_functionalities: String(data.special_functionalities || 'N/A').replace(/\n/g, '<br>'),
        colors_formatted: data.colors_formatted || 'N/A',
        subscription_keywords: String(data.subscription_keywords || 'N/A').replace(/\n/g, '<br>'),
        price_text: String(data.price_text || 'N/A').replace(/\n/g, '<br>'),
        reference_url: data.reference_url || 'N/A',
        reference_image: data.reference_image || 'N/A',
        guidelines_document: data.guidelines_document || 'N/A',
        requester_name: data.requester_name || 'N/A'
      },
      translations: {
        title: t.title,
        country: t.country,
        carriers: t.carriers,
        product: t.product,
        flowType: t.flowType,
        trafficSource: t.trafficSource,
        planType: t.planType,
        copies: t.copies,
        tcLinks: t.tcLinks,
        languages: t.languages,
        images: t.images,
        logos: t.logos,
        specialFunctionalities: t.specialFunctionalities,
        colors: t.colors,
        subscriptionKeywords: t.subscriptionKeywords,
        priceText: t.priceText,
        requesterName: t.requesterName,
        generateRequest: t.generateRequest
      }
    };

    return new Response(
      JSON.stringify({
        success: true,
        pdfContent,
        devId
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error generating PDF data:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error generating PDF data'
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