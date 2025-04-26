import { NextResponse } from 'next/server';

interface ProfileResponse {
  username?: string;
  email?: string;
  message?: string;
}

export async function GET(request: Request): Promise<NextResponse<ProfileResponse>> {
  try {
    // Get token from request headers
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Use the environment variable for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    
    // Forward request to backend API with token
    const response = await fetch(`${backendUrl}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json() as ProfileResponse;
    
    // Return response with the same status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}