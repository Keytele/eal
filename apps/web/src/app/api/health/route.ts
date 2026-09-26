import { NextResponse } from 'next/server';

import { createRequestTraceContext } from '../../../server/observability/request-context';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const trace = createRequestTraceContext(request);
  return NextResponse.json(
    {
      status: 'ok',
      checks: { application: 'ok' },
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-Correlation-Id': trace.correlationId,
      },
    },
  );
}
