import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const students = await db.user.findMany({
      where: { isAdmin: false },
      include: {
        profile: true,
        assessments: {
          orderBy: { startedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = students.map(s => {
      // Find the best TOEFL scores from assessments
      const completedAssessments = s.assessments.filter(a => a.status === 'completed');
      const latest = completedAssessments[0] || null;

      // Calculate TOEFL section scores from available data
      // New format: readingScore, listeningScore, speakingScore, writingScore (0-30)
      // Legacy format: spOverall (0-100), liOverall (0-100), voOverall (0-100), grPercentage (0-100)
      let reading = latest?.readingScore ?? null;
      let listening = latest?.listeningScore ?? null;
      let speaking = latest?.speakingScore ?? null;
      let writing = latest?.writingScore ?? null;
      let total = latest?.totalScore ?? null;
      let cefr = latest?.cefrLevel ?? null;

      // Fallback: convert old scores to 0-30 scale if new fields are null
      if (listening === null && latest?.liOverall != null) {
        listening = Math.round((latest.liOverall / 100) * 30);
      }
      if (speaking === null && latest?.spOverall != null) {
        speaking = Math.round((latest.spOverall / 100) * 30);
      }

      // Calculate total if we have any scores
      if (total === null) {
        const scores = [reading, listening, speaking, writing].filter(s => s !== null) as number[];
        if (scores.length > 0) {
          total = scores.reduce((sum, s) => sum + s, 0);
        }
      }

      // Determine CEFR from total
      if (cefr === null && total !== null) {
        if (total <= 31) cefr = 'A1';
        else if (total <= 59) cefr = 'A2-B1';
        else if (total <= 93) cefr = 'B1-B2';
        else cefr = 'C1-C2';
      }

      // Determine level from total
      let level = latest?.assignedLevel ?? s.profile?.currentLevel ?? 0;
      if (total !== null && latest?.assignedLevel == null) {
        if (total <= 31) level = 0;
        else if (total <= 59) level = 1;
        else if (total <= 93) level = 2;
        else level = 3;
      }

      // Count completed sections
      const completedSections = [reading, listening, speaking, writing].filter(s => s !== null).length;

      return {
        id: s.id,
        displayName: s.displayName || s.email.split('@')[0],
        email: s.email,
        currentLevel: level,
        cefr,
        assessmentCount: completedAssessments.length,
        lastActiveAt: s.profile?.lastActiveAt || s.createdAt,
        joinedAt: s.createdAt,
        // TOEFL scores
        reading,
        listening,
        speaking,
        writing,
        total,
        completedSections,
        // Status
        hasStarted: s.assessments.length > 0,
        isComplete: completedSections === 4,
      };
    });

    return NextResponse.json({ students: formatted });
  } catch (error) {
    console.error('Admin students error:', error);
    return NextResponse.json({ students: [] });
  }
}
