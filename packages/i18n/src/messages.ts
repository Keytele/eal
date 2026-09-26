import type { Locale } from '@eal/domain';

export type UiMessageNamespace =
  'action' | 'catalog' | 'error' | 'fallback' | 'form' | 'status' | 'validation';
export type UiMessageKey = `${UiMessageNamespace}.${string}`;
export type MessageValue = string | number | Date;
export type MessageValues = Readonly<Record<string, MessageValue>>;
export type MessageCatalog = Readonly<Partial<Record<UiMessageKey, string>>>;

export const REQUIRED_CORE_MESSAGE_KEYS = [
  'error.general',
  'error.serviceUnavailable',
  'error.validation',
  'error.notFound',
  'error.conflict',
  'error.unauthorized',
  'error.forbidden',
  'error.rateLimited',
  'error.timeout',
  'error.unavailable',
  'fallback.translationUnavailable',
] as const satisfies readonly UiMessageKey[];

export const CORE_MESSAGE_CATALOGS: Readonly<Record<Locale, MessageCatalog>> = {
  en: {
    'error.general': 'Something went wrong. Please try again.',
    'error.serviceUnavailable': 'This service is currently unavailable.',
    'error.validation': 'Check the highlighted information and try again.',
    'error.notFound': 'The requested item is unavailable.',
    'error.conflict': 'This request can no longer be completed.',
    'error.unauthorized': 'You need to sign in to continue.',
    'error.forbidden': 'You do not have access to this action.',
    'error.rateLimited': 'Please wait before trying again.',
    'error.timeout': 'The request timed out. Please try again.',
    'error.unavailable': 'This option is unavailable.',
    'fallback.translationUnavailable': 'This page is not available in the selected language.',
  },
  'zh-Hans': {
    'error.general': '出现问题，请重试。',
    'error.serviceUnavailable': '此服务暂时不可用。',
    'error.validation': '请检查标记的信息后重试。',
    'error.notFound': '所请求的内容不可用。',
    'error.conflict': '此请求已无法完成。',
    'error.unauthorized': '请先登录再继续。',
    'error.forbidden': '您没有执行此操作的权限。',
    'error.rateLimited': '请稍后再试。',
    'error.timeout': '请求超时，请重试。',
    'error.unavailable': '此选项不可用。',
    'fallback.translationUnavailable': '所选语言暂不提供此页面。',
  },
};

export function getMessage(catalog: MessageCatalog, key: UiMessageKey): string | undefined {
  return catalog[key];
}

/** Missing translations are explicit: callers choose a translated fallback UI. */
export function formatMessage(
  catalog: MessageCatalog,
  key: UiMessageKey,
  values: MessageValues = {},
): string | undefined {
  const template = getMessage(catalog, key);
  if (template === undefined) {
    return undefined;
  }

  return template.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (placeholder, name: string) => {
    const value = values[name];
    return value === undefined
      ? placeholder
      : value instanceof Date
        ? value.toISOString()
        : String(value);
  });
}

export function hasRequiredCoreMessages(catalog: MessageCatalog): boolean {
  return REQUIRED_CORE_MESSAGE_KEYS.every(
    (key) => typeof catalog[key] === 'string' && catalog[key].trim().length > 0,
  );
}
