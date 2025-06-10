// app/api/health/route.ts
import { NextResponse } from 'next/server';

const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const flaskResponse = await fetch(`${FLASK_SERVER_URL}/`);
    const flaskData = await flaskResponse.json();
    
    return NextResponse.json({
      nextjs: 'running',
      flask: flaskData,
      status: 'connected'
    });
  } catch (error) {
    return NextResponse.json({
      nextjs: 'running',
      flask: 'not connected',
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}