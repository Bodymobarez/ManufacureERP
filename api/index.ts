// ==================== VERCEL SERVERLESS API HANDLER ====================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index';
import serverless from 'serverless-http';

// Create Express app
const app = createServer();

// Wrap Express app with serverless-http
const handler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
});

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
    // Handle the request
    return await handler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

