import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const totalStudents = await db.user.count({ where: { isAdmin: false } });
    const totalAssessments = await db.assessment.count();
    const completedAssessments = await db.assessment.count({ where: { status: 'completed' } });
    const pendingFlags = await db.reviewFlag.count({ where: { resolved: false } });

    // Level distribution
    const profiles = await db.profile.findMany();
    const levelDistribution = [0, 1, 2, 3].map(level => ({
      level,
      count: profiles.filter(p => p.currentLevel === level).length,
    }));

    // Average scores
    const completedAssessmentRecords = await db.assessment.findMany({
      where: { status: 'completed', spOverall: { not: null } },
    });

    const avgScores = {
      speaking: completedAssessmentRecords.length > 0
        ? completedAssessmentRecords.reduce((sum, a) => sum + (a.spOverall || 0), 0) / completedAssessmentRecords.length
        : 0,
      listening: completedAssessmentRecords.length > 0
        ? completedAssessmentRecords.reduce((sum, a) => sum + (a.liOverall || 0), 0) / completedAssessmentRecords.length
        : 0,
      vocabulary: completedAssessmentRecords.length > 0
        ? completedAssessmentRecords.reduce((sum, a) => sum + (a.voOverall || 0), 0) / completedAssessmentRecords.length
        : 0,
      grammar: completedAssessmentRecords.length > 0
        ? completedAssessmentRecords.reduce((sum, a) => sum + (a.grPercentage || 0), 0) / completedAssessmentRecords.length
        : 0,
    };

    return NextResponse.json({
      totalStudents,
      totalAssessments,
      completedAssessments,
      pendingFlags,
      levelDistribution,
      avgScores,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    // Return default analytics on error instead of failing
    return NextResponse.json({
      totalStudents: 0,
      totalAssessments: 0,
      completedAssessments: 0,
      pendingFlags: 0,
      levelDistribution: [
        { level: 0, count: 0 },
        { level: 1, count: 0 },
        { level: 2, count: 0 },
        { level: 3, count: 0 },
      ],
      avgScores: { speaking: 0, listening: 0, vocabulary: 0, grammar: 0 },
    });
  }
}
