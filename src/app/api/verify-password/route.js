import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.siteSettings.create({
        data: {
          id: 'global',
          sitePassword: 'Holymoly',
        },
      });
    }

    const isValid = password === settings.sitePassword;

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'elevated_site_access',
      value: 'true',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password verify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
