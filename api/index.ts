// ==================== VERCEL SERVERLESS API HANDLER ====================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index';
import serverless from 'serverless-http';

// Create Express app instance
let app: ReturnType<typeof createServer> | null = null;
let handler: ReturnType<typeof serverless> | null = null;

// Initialize app and handler lazily
function getHandler() {
  if (!app) {
    app = createServer();
    handler = serverless(app, {
      binary: ['image/*', 'application/pdf'],
    });
  }
  return handler!;
}

export default async function (req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get handler and process request
    const requestHandler = getHandler();
    return await requestHandler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

