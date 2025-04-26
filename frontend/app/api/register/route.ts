import { NextResponse } from 'next/server';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

export async function POST(request: Request): Promise<NextResponse<RegisterResponse>> {
  try {
    const body = await request.json() as RegisterRequest;
    
    // Use the environment variable for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    
    // Forward request to backend API
    const response = await fetch(`${backendUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(response);
    
    const data = await response.json() as RegisterResponse;
    
    // Return response with the same status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' } as RegisterResponse,
      { status: 500 }
    );
  }
}