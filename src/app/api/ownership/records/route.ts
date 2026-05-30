/**
 * MACAL EMPIRE — Ownership Records API
 * Lightweight internal records for timestamped ownership evidence.
 * Supports GET (list) and POST (create).
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ─── GET: List Ownership Records ─────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('eventType');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    const where = eventType ? { eventType } : {};

    const records = await db.ownershipRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error('[OWNERSHIP-RECORDS] Failed to fetch records:', error);
    return NextResponse.json(
      { records: [], error: 'Failed to fetch ownership records' },
      { status: 500 }
    );
  }
}

// ─── POST: Create Ownership Record ───────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, description, metadata, userId, createdBy } = body;

    if (!eventType || !description) {
      return NextResponse.json(
        { error: 'eventType and description are required' },
        { status: 400 }
      );
    }

    const validEventTypes = [
      'terms_acceptance',
      'content_publication',
      'certificate_generation',
      'system_update',
      'ownership_declaration',
    ];

    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: `Invalid eventType. Must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const record = await db.ownershipRecord.create({
      data: {
        eventType,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
        userId: userId || null,
        createdBy: createdBy || 'system',
      },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error('[OWNERSHIP-RECORDS] Failed to create record:', error);
    return NextResponse.json(
      { error: 'Failed to create ownership record' },
      { status: 500 }
    );
  }
}
