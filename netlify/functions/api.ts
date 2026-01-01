// ==================== NETLIFY SERVERLESS API HANDLER ====================

import type { Handler } from "@netlify/functions";
import serverless from "serverless-http";
import { createServer } from "../../server/index";

// Initialize Express app and handler
const app = createServer();
const handler = serverless(app);

// Netlify function handler
export const netlifyHandler: Handler = async (event, context) => {
  // Convert Netlify event to Express-compatible request
  const request = {
    method: event.httpMethod,
    path: event.path.replace('/.netlify/functions/api', ''),
    url: event.path.replace('/.netlify/functions/api', '') + (event.rawQuery ? `?${event.rawQuery}` : ''),
    headers: event.headers || {},
    query: event.queryStringParameters || {},
    body: event.body || '',
    isBase64Encoded: event.isBase64Encoded || false,
  } as any;

  // Create response object
  let response: any = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: '',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: response.headers,
      body: '',
    };
  }

  try {
    // Wrap handler in a promise
    return new Promise((resolve) => {
      const mockRes: any = {
        statusCode: 200,
        headers: {},
        setHeader: (key: string, value: string) => {
          response.headers[key] = value;
        },
        status: (code: number) => {
          response.statusCode = code;
          return mockRes;
        },
        json: (data: any) => {
          response.body = JSON.stringify(data);
          response.headers['Content-Type'] = 'application/json';
          resolve(response);
        },
        send: (data: any) => {
          response.body = typeof data === 'string' ? data : JSON.stringify(data);
          resolve(response);
        },
        end: (data?: any) => {
          if (data) response.body = data;
          resolve(response);
        },
      };

      handler(request, mockRes, (err?: any) => {
        if (err) {
          resolve({
            statusCode: 500,
            headers: response.headers,
            body: JSON.stringify({ error: 'Internal server error', message: err.message }),
          });
        } else {
          resolve(response);
        }
      });
    });
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers: response.headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

// Export as handler for Netlify
export { netlifyHandler as handler };
