// app/api/trades/route.ts
import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_URL = 'https://dev-coin-user-data.marginnova.com';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    
    // Get the Authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header provided' },
        { status: 401 }
      );
    }
    
    // Construct the external URL
    const externalUrl = `${EXTERNAL_API_URL}/api/orders/trades/history?${searchParams.toString()}`;
    
    console.log('Proxying trade request to:', externalUrl);
    
    // Forward the request to the external API
    const response = await fetch(externalUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });
    
    // Get the response text first
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('External API error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      
      // Try to parse as JSON, but fall back to text
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: responseText };
      }
      
      return NextResponse.json(
        { 
          error: `External API error: ${response.status}`,
          details: errorData,
          url: externalUrl
        },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          }
        }
      );
    }
    
    // Parse the successful response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse external API response:', error);
      return NextResponse.json(
        { error: 'Invalid JSON response from external API' },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          }
        }
      );
    }
    
    // Return the successful response with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Cache-Control': 'public, max-age=60',
      },
    });
    
  } catch (error) {
    console.error('Trade proxy server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        }
      }
    );
  }
}

// Handle OPTIONS for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}