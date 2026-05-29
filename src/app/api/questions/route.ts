import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const moduleParam = req.nextUrl.searchParams.get('module');
    const topicParam = req.nextUrl.searchParams.get('topic');

    if (!moduleParam) {
      return NextResponse.json({ error: 'Module parameter required' }, { status: 400 });
    }

    const where: Record<string, string | boolean> = { module: moduleParam, isActive: true };
    if (topicParam) where.topic = topicParam;

    const questions = await db.question.findMany({
      where,
      orderBy: { difficulty: 'asc' },
    });

    // Parse options from JSON string
    const parsed = questions.map(q => ({
      ...q,
      options: JSON.parse(q.options),
    }));

    return NextResponse.json({ questions: parsed });
  } catch (error) {
    console.error('Questions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
