import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const students = await db.user.findMany({
      where: { isAdmin: false },
      include: {
        profile: true,
        assessments: {
          where: { status: 'completed' },
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = students.map(s => ({
      id: s.id,
      displayName: s.displayName || s.email.split('@')[0],
      email: s.email,
      currentLevel: s.profile?.currentLevel || 0,
      assessmentCount: s.profile?.assessmentCount || 0,
      lastActiveAt: s.profile?.lastActiveAt || s.createdAt,
      joinedAt: s.createdAt,
      latestAssessment: s.assessments[0] || null,
    }));

    return NextResponse.json({ students: formatted });
  } catch (error) {
    console.error('Admin students error:', error);
    // Return empty array on error instead of failing
    return NextResponse.json({ students: [] });
  }
}
