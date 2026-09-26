import { z } from 'zod';

import { createFixedWindowRateLimit } from '@eal/domain';

import { createStructuredLogEntry, writeStructuredLog } from '../../../server/observability/logger';

const metricSchema = z.object({
  metric: z.enum(['LCP', 'INP', 'CLS']),
  value: z.number().finite().nonnegative().max(60_000),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
});
const payloadSchema = z.object({
  locale: z.enum(['en', 'zh-Hans']),
  market: z.enum(['au', 'cn']),
  pageType: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  samples: z.array(metricSchema).min(1).max(3),
});
const rateLimit = createFixedWindowRateLimit(60, 60_000);

export async function POST(request: Request) {
  const key = request.headers.get('x-forwarded-for') ?? 'anonymous';
  if (!rateLimit.check(key).allowed) {
    return Response.json({ error: 'rate-limited' }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid-json' }, { status: 400 });
  }
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'invalid-payload' }, { status: 400 });
  }
  writeStructuredLog(
    createStructuredLogEntry('info', 'web-vitals', {
      locale: parsed.data.locale,
      market: parsed.data.market,
      pageType: parsed.data.pageType,
      samples: parsed.data.samples.map(({ metric, value, rating }) => ({ metric, value, rating })),
    }),
  );
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
