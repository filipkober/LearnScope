import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Get the token from the request headers
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 400 });
    }

    // Call backend logout endpoint to invalidate token
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const cookieStore = await cookies();
    // Clear the token from cookies
    cookieStore.delete('auth_token');

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json({ message: data.message || 'Logout failed' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}