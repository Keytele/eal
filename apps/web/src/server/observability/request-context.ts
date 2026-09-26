import 'server-only';

import { randomUUID } from 'node:crypto';

import { isSafeIdentifier } from '@eal/domain';

export interface RequestTraceContext {
  readonly correlationId: string;
  readonly traceParent?: string;
}

export function createRequestTraceContext(request: Request): RequestTraceContext {
  const candidate = request.headers.get('x-correlation-id');
  const traceParent = request.headers.get('traceparent') ?? undefined;
  return {
    correlationId: candidate !== null && isSafeIdentifier(candidate) ? candidate : randomUUID(),
    ...(traceParent === undefined ? {} : { traceParent }),
  };
}
