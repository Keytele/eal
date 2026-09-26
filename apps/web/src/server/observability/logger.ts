import 'server-only';

import { redactSensitiveRecord } from '@eal/domain';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface StructuredLogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
  readonly correlationId?: string;
  readonly context?: Readonly<Record<string, unknown>>;
}

export function createStructuredLogEntry(
  level: LogLevel,
  message: string,
  context?: Readonly<Record<string, unknown>>,
  correlationId?: string,
): StructuredLogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(correlationId === undefined ? {} : { correlationId }),
    ...(context === undefined ? {} : { context: redactSensitiveRecord(context) }),
  };
}

export function writeStructuredLog(entry: StructuredLogEntry): void {
  const line = JSON.stringify(entry);
  if (entry.level === 'error') {
    console.error(line);
  } else if (entry.level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}
