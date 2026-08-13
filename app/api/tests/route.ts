import { NextResponse } from 'next/server';
import { runPhase0Tests } from '../../../tests/phase0.test';

export async function GET() {
  const results = await runPhase0Tests();
  const allPassed = results.every((r) => r.passed);

  return NextResponse.json({
    success: allPassed,
    totalTests: results.length,
    passedCount: results.filter((r) => r.passed).length,
    results,
  });
}
