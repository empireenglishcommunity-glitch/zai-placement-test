import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const flags = await db.reviewFlag.findMany({
      where: { resolved: false },
      include: {
        user: {
          select: { id: true, displayName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ flags });
  } catch (error) {
    console.error('Admin flags error:', error);
    // Return empty array on error
    return NextResponse.json({ flags: [] });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { flagId, notes, resolved } = await req.json();

    if (!flagId) {
      return NextResponse.json({ error: 'Flag ID required' }, { status: 400 });
    }

    const updateData: { notes?: string; resolved?: boolean; reviewedAt?: Date } = {};
    if (notes !== undefined) updateData.notes = notes;
    if (resolved !== undefined) {
      updateData.resolved = resolved;
      updateData.reviewedAt = new Date();
    }

    const flag = await db.reviewFlag.update({
      where: { id: flagId },
      data: updateData,
    });

    return NextResponse.json({ flag });
  } catch (error) {
    console.error('Flag update error:', error);
    return NextResponse.json({ error: 'Failed to update flag' }, { status: 500 });
  }
}
