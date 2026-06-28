import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Verification token required' }, { status: 400 });
    }

    // Find user with valid token
    const user = await db.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: { gt: new Date() },
      },
    }).catch(() => null);

    if (!user) {
      // Redirect to login with error
      return NextResponse.redirect(new URL('/login?error=Invalid+or+expired+verification+link', req.url));
    }

    // Mark email as verified, clear token
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    // Redirect to login with success
    return NextResponse.redirect(new URL('/login?message=Email+verified+successfully.+You+may+now+sign+in.', req.url));
  } catch (error) {
    console.error('[VERIFY-EMAIL] Error:', error);
    return NextResponse.redirect(new URL('/login?error=Verification+failed', req.url));
  }
}
