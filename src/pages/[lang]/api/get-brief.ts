import type { APIRoute } from 'astro';
import { getRequestsCollection } from '../../../lib/mongodb';
import { getStaticPaths } from '../../../i18n';

export { getStaticPaths };

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const url = new URL(request.url);
    const devId = url.searchParams.get('devId');
    
    if (!devId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'DevID is required'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Connect to database and search for the record
    const collection = await getRequestsCollection();
    const existingRecord = await collection.findOne({ devId: devId });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Record not found'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Remove MongoDB _id field and return the data
    const { _id, ...recordData } = existingRecord;

    return new Response(
      JSON.stringify({
        success: true,
        data: recordData
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error fetching record:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
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