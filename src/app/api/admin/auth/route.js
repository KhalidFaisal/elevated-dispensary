import { NextResponse } from 'next/server';
import { verifyAdminPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = generateToken();

    const response = NextResponse.json({ success: true, token });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
