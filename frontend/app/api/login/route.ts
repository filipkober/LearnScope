import { NextResponse } from 'next/server';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  message?: string;
}

export async function POST(request: Request): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json() as LoginRequest;
    
    // Use the environment variable for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    
    // Forward request to backend API
    const response = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json() as LoginResponse;
    
    // Return response with the same status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' } as LoginResponse,
      { status: 500 }
    );
  }
}