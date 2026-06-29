import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionToken, cartTotal, itemCount, currentPath, checkoutName, checkoutPhone, checkoutAddress } = body;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Missing session token' }, { status: 400 });
    }

    // Upsert active session
    await prisma.activeSession.upsert({
      where: { sessionToken },
      update: {
        lastActiveAt: new Date(),
        cartTotal: cartTotal || 0,
        itemCount: itemCount || 0,
        currentPath: currentPath || '',
        checkoutName: checkoutName || null,
        checkoutPhone: checkoutPhone || null,
        checkoutAddress: checkoutAddress || null
      },
      create: {
        sessionToken,
        lastActiveAt: new Date(),
        cartTotal: cartTotal || 0,
        itemCount: itemCount || 0,
        currentPath: currentPath || '',
        checkoutName: checkoutName || null,
        checkoutPhone: checkoutPhone || null,
        checkoutAddress: checkoutAddress || null
      }
    });

    // Fire and forget cleanup of old sessions (> 15 mins old to keep DB clean, though UI only shows 5 mins)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    prisma.activeSession.deleteMany({
      where: { lastActiveAt: { lt: fifteenMinsAgo } }
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Presence API Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
