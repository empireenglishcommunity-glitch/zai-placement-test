import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Extract user ID from session
    let userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

    // Fallback: find by email
    if (!userId && session?.user?.email) {
      const user = await db.user.findUnique({ where: { email: session.user.email } });
      userId = user?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user profile
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure profile exists for the user (create if missing)
    let profile = user.profile;
    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId: user.id,
          currentLevel: 0,
          assessmentCount: 0,
        },
      }).catch(() => null);
    }

    // Get all assessments for this user
    const assessments = await db.assessment.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 20,
    }).catch(() => []);

    // Get the latest completed assessment (if any)
    const latestCompleted = assessments.length > 0
      ? await db.assessment.findFirst({
          where: { userId, status: 'completed' },
          orderBy: { completedAt: 'desc' },
        }).catch(() => null)
      : null;

    // Calculate module progress from assessments
    const moduleProgress: Record<string, {
      status: 'not_started' | 'in_progress' | 'completed';
      score: number | null;
      level: number | null;
    }> = {
      speaking: { status: 'not_started', score: null, level: null },
      listening: { status: 'not_started', score: null, level: null },
      reading: { status: 'not_started', score: null, level: null },
      writing: { status: 'not_started', score: null, level: null },
      vocabulary: { status: 'not_started', score: null, level: null },
      grammar: { status: 'not_started', score: null, level: null },
    };

    // Process assessments to determine module status
    const inProgressAssessment = assessments.find(a => a.status === 'in_progress');

    for (const assessment of assessments) {
      // Speaking
      if ((assessment.speakingScore !== null || assessment.spOverall !== null) && moduleProgress.speaking.status !== 'completed') {
        moduleProgress.speaking = {
          status: 'completed',
          score: Math.round(assessment.speakingScore ?? assessment.spOverall ?? 0),
          level: assessment.spLevel ?? (assessment.speakingScore ? (assessment.speakingScore >= 24 ? 3 : assessment.speakingScore >= 16 ? 2 : assessment.speakingScore >= 8 ? 1 : 0) : null),
        };
      } else if (inProgressAssessment?.currentModule === 'speaking' && moduleProgress.speaking.status === 'not_started') {
        moduleProgress.speaking.status = 'in_progress';
      }

      // Listening
      if ((assessment.listeningScore !== null || assessment.liOverall !== null) && moduleProgress.listening.status !== 'completed') {
        moduleProgress.listening = {
          status: 'completed',
          score: Math.round(assessment.listeningScore ?? assessment.liOverall ?? 0),
          level: assessment.liLevel ?? (assessment.listeningScore ? (assessment.listeningScore >= 24 ? 3 : assessment.listeningScore >= 16 ? 2 : assessment.listeningScore >= 8 ? 1 : 0) : null),
        };
      } else if (inProgressAssessment?.currentModule === 'listening' && moduleProgress.listening.status === 'not_started') {
        moduleProgress.listening.status = 'in_progress';
      }

      // Vocabulary
      if (assessment.voOverall !== null) {
        moduleProgress.vocabulary = {
          status: 'completed',
          score: Math.round(assessment.voOverall),
          level: assessment.voLevel,
        };
      } else if (inProgressAssessment?.currentModule === 'vocabulary' && moduleProgress.vocabulary.status === 'not_started') {
        moduleProgress.vocabulary.status = 'in_progress';
      }

      // Grammar
      if (assessment.grPercentage !== null) {
        moduleProgress.grammar = {
          status: 'completed',
          score: Math.round(assessment.grPercentage),
          level: assessment.grLevel,
        };
      } else if (inProgressAssessment?.currentModule === 'grammar' && moduleProgress.grammar.status === 'not_started') {
        moduleProgress.grammar.status = 'in_progress';
      }

      // Reading (TOEFL)
      if (assessment.readingScore !== null && moduleProgress.reading.status !== 'completed') {
        moduleProgress.reading = {
          status: 'completed',
          score: Math.round(assessment.readingScore),
          level: assessment.readingScore >= 24 ? 3 : assessment.readingScore >= 16 ? 2 : assessment.readingScore >= 8 ? 1 : 0,
        };
      } else if (inProgressAssessment?.currentModule === 'reading' && moduleProgress.reading.status === 'not_started') {
        moduleProgress.reading.status = 'in_progress';
      }

      // Writing (TOEFL)
      if (assessment.writingScore !== null && moduleProgress.writing.status !== 'completed') {
        moduleProgress.writing = {
          status: 'completed',
          score: Math.round(assessment.writingScore),
          level: assessment.writingScore >= 24 ? 3 : assessment.writingScore >= 16 ? 2 : assessment.writingScore >= 8 ? 1 : 0,
        };
      } else if (inProgressAssessment?.currentModule === 'writing' && moduleProgress.writing.status === 'not_started') {
        moduleProgress.writing.status = 'in_progress';
      }

      // Also check new TOEFL listening/speaking score fields
      if (assessment.listeningScore !== null && moduleProgress.listening.status !== 'completed') {
        moduleProgress.listening = {
          status: 'completed',
          score: Math.round(assessment.listeningScore),
          level: assessment.listeningScore >= 24 ? 3 : assessment.listeningScore >= 16 ? 2 : assessment.listeningScore >= 8 ? 1 : 0,
        };
      }
      if (assessment.speakingScore !== null && moduleProgress.speaking.status !== 'completed') {
        moduleProgress.speaking = {
          status: 'completed',
          score: Math.round(assessment.speakingScore),
          level: assessment.speakingScore >= 24 ? 3 : assessment.speakingScore >= 16 ? 2 : assessment.speakingScore >= 8 ? 1 : 0,
        };
      }
    }

    // Build activity feed from assessments
    const activity = assessments
      .filter(a => a.status === 'completed' || a.status === 'in_progress')
      .slice(0, 10)
      .map((a) => {
        const moduleName = a.currentModule || 'unknown';
        const moduleLabels: Record<string, string> = {
          speaking: 'Speaking',
          listening: 'Listening',
          reading: 'Reading',
          writing: 'Writing',
          vocabulary: 'Vocabulary',
          grammar: 'Grammar',
        };

        let action = '';
        let score: number | null = null;

        if (a.status === 'completed') {
          action = `Completed Trial of ${moduleLabels[moduleName] || moduleName}`;
          if (moduleName === 'vocabulary' && a.voOverall !== null) score = Math.round(a.voOverall);
          else if (moduleName === 'grammar' && a.grPercentage !== null) score = Math.round(a.grPercentage);
          else if (moduleName === 'speaking' && a.spOverall !== null) score = Math.round(a.spOverall);
          else if (moduleName === 'listening' && a.liOverall !== null) score = Math.round(a.liOverall);
        } else {
          action = `Started Trial of ${moduleLabels[moduleName] || moduleName}`;
        }

        return {
          id: a.id,
          timestamp: a.completedAt?.toISOString() || a.startedAt.toISOString(),
          module: moduleLabels[moduleName] || moduleName,
          action,
          score,
        };
      });

    // Calculate stats
    const completedCount = Object.values(moduleProgress).filter(m => m.status === 'completed').length;
    const currentLevel = profile?.currentLevel ?? 0;
    const vocabEstimate = latestCompleted?.voEstimatedSize
      ? Math.round(latestCompleted.voEstimatedSize)
      : null;

    // Calculate rank from completed module levels (majority rule + speaking tiebreaker)
    let computedLevel = 0;
    const moduleLevels = Object.values(moduleProgress)
      .filter(m => m.level !== null && m.level !== undefined)
      .map(m => m.level as number);

    if (moduleLevels.length > 0) {
      // Count frequency of each level
      const levelCounts: Record<number, number> = {};
      for (const lvl of moduleLevels) {
        levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
      }

      // Find majority level
      let maxCount = 0;
      let isTie = false;
      for (const [level, count] of Object.entries(levelCounts)) {
        if (count > maxCount) {
          maxCount = count;
          computedLevel = parseInt(level);
          isTie = false;
        } else if (count === maxCount) {
          isTie = true;
        }
      }

      // Tiebreaker: speaking level wins
      if (isTie && moduleProgress.speaking.level !== null) {
        computedLevel = moduleProgress.speaking.level;
      }
    }

    const finalLevel = Math.max(currentLevel, computedLevel);

    // Update profile level if computed level is higher
    if (computedLevel > currentLevel && profile) {
      await db.profile.update({
        where: { userId },
        data: { currentLevel: computedLevel, assessmentCount: completedCount },
      }).catch(() => {});
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Recruit',
      },
      profile: {
        currentLevel: finalLevel,
        assessmentCount: completedCount,
        streak: profile?.streak ?? 0,
      },
      moduleProgress,
      activity,
      stats: {
        assessmentsCompleted: completedCount,
        currentLevel: finalLevel,
        vocabularyEstimate: vocabEstimate,
        grammarScore: moduleProgress.grammar.score,
      },
      hasAssessments: assessments.length > 0,
    });
  } catch (error) {
    console.error('[dashboard_api] Error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
