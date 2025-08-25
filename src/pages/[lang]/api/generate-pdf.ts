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
        admin_approval: data.admin_approval || 'N/A',
        country: data.country || 'N/A',
        carriers: data.carriers || 'N/A',
        product: data.product || 'N/A',
        technology_type: data.technology_type || 'N/A',
        flow_type: data.flow_type || 'N/A',
        traffic_source: Array.isArray(data.traffic_source) ? data.traffic_source.join(', ') : (data.traffic_source || 'N/A'),
        copies: String(data.copies || 'N/A').replace(/\n/g, '<br>'),
        tc_links: data.tc_links || 'N/A',
        multilanguage: data.multilanguage || 'N/A',
        banners: String(data.banners || 'N/A').replace(/\n/g, '<br>'),
        images: String(data.images || 'N/A').replace(/\n/g, '<br>'),
        logos: String(data.logos || 'N/A').replace(/\n/g, '<br>'),
        landing_flow: data.landing_flow || 'N/A',
        special_functionalities: String(data.special_functionalities || 'N/A').replace(/\n/g, '<br>'),
        colors: String(data.colors || 'N/A').replace(/\n/g, '<br>'),
        requester_name: data.requester_name || 'N/A',
        jira_task_url: data.jira_task_url || 'N/A'
      },
      translations: {
        title: t.title,
        adminApproval: t.adminApproval,
        country: t.country,
        carriers: t.carriers,
        product: t.product,
        technologyType: t.technologyType,
        flowType: t.flowType,
        trafficSource: t.trafficSource,
        copies: t.copies,
        tcLinks: t.tcLinks,
        multilanguage: t.multilanguage,
        banners: t.banners,
        images: t.images,
        logos: t.logos,
        landingFlow: t.landingFlow,
        specialFunctionalities: t.specialFunctionalities,
        colors: t.colors,
        requesterName: t.requesterName,
        jiraTaskUrl: t.jiraTaskUrl,
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