import 'server-only';

import { z } from 'zod';

const booleanEnvironmentValue = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => value === 'true');

const serverEnvironmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    EAL_DEPLOYMENT_ENV: z
      .enum(['local', 'preview', 'integration', 'staging', 'production'])
      .default('local'),
    EAL_APP_ORIGIN: z.string().url().optional(),
    EAL_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    EAL_COMMERCE_MUTATIONS_ENABLED: booleanEnvironmentValue,
    EAL_CMS_ENDPOINT: z.string().url().optional(),
    EAL_CMS_TOKEN: z.string().min(1).optional(),
    EAL_COMMERCE_PROVIDER_ENDPOINT: z.string().url().optional(),
    EAL_COMMERCE_PROVIDER_TOKEN: z.string().min(1).optional(),
    EAL_FEATURE_MARKET_AU: booleanEnvironmentValue,
    EAL_FEATURE_MARKET_CN: booleanEnvironmentValue,
    EAL_FEATURE_FINANCE: booleanEnvironmentValue,
    EAL_FEATURE_RESERVATION: booleanEnvironmentValue,
    EAL_FEATURE_PROVIDER_INTEGRATIONS: booleanEnvironmentValue,
  })
  .superRefine((environment, context) => {
    if (environment.EAL_DEPLOYMENT_ENV === 'production' && !environment.EAL_APP_ORIGIN) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'EAL_APP_ORIGIN is required in production.',
        path: ['EAL_APP_ORIGIN'],
      });
    }

    if (
      environment.EAL_COMMERCE_MUTATIONS_ENABLED &&
      (!environment.EAL_COMMERCE_PROVIDER_ENDPOINT || !environment.EAL_COMMERCE_PROVIDER_TOKEN)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A provider endpoint and token are required when commerce mutations are enabled.',
        path: ['EAL_COMMERCE_PROVIDER_ENDPOINT'],
      });
    }
  });

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

let cachedEnvironment: ServerEnvironment | undefined;

export function getServerEnvironment(
  source: Record<string, string | undefined> = process.env,
): ServerEnvironment {
  if (source === process.env && cachedEnvironment) {
    return cachedEnvironment;
  }

  const parsedEnvironment = serverEnvironmentSchema.safeParse(source);

  if (!parsedEnvironment.success) {
    throw new Error(`Invalid server environment: ${parsedEnvironment.error.message}`);
  }

  if (source === process.env) {
    cachedEnvironment = parsedEnvironment.data;
  }

  return parsedEnvironment.data;
}

export function clearServerEnvironmentForTests(): void {
  cachedEnvironment = undefined;
}
