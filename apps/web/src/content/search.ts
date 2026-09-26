import type { Locale, MarketLocaleContext, SearchResult } from '@eal/domain';

interface SearchDocument {
  readonly id: string;
  readonly kind: SearchResult['kind'];
  readonly path: string;
  readonly title: Readonly<Record<Locale, string>>;
  readonly aliases: Readonly<Record<Locale, readonly string[]>>;
}

const SEARCH_DOCUMENTS: readonly SearchDocument[] = [
  ...(['c2', 's4', 's6', 'x4', 'x6', 'r9'] as const).map((model) => ({
    id: 'vehicle-' + model,
    kind: 'vehicle' as const,
    path: '/vehicles/' + model,
    title: { en: model.toUpperCase(), 'zh-Hans': model.toUpperCase() },
    aliases: { en: [model, 'vehicle'], 'zh-Hans': [model, '车型', '汽车'] },
  })),
  {
    id: 'technology-800v',
    kind: 'technology',
    path: '/technology/800v-architecture',
    title: { en: '800V architecture', 'zh-Hans': '800V 架构' },
    aliases: { en: ['charging', 'platform', 'technology'], 'zh-Hans': ['充电', '平台', '科技'] },
  },
  {
    id: 'technology-battery',
    kind: 'technology',
    path: '/technology/battery-charging',
    title: { en: 'Battery and charging', 'zh-Hans': '电池与充电' },
    aliases: { en: ['battery', 'charge', 'energy'], 'zh-Hans': ['电池', '充电', '能源'] },
  },
  {
    id: 'technology-driving',
    kind: 'technology',
    path: '/technology/intelligent-driving',
    title: { en: 'Intelligent driving', 'zh-Hans': '智能驾驶' },
    aliases: { en: ['driver assistance', 'safety'], 'zh-Hans': ['驾驶辅助', '安全'] },
  },
  {
    id: 'technology-software',
    kind: 'technology',
    path: '/technology/software-connectivity',
    title: { en: 'Software and connectivity', 'zh-Hans': '软件与互联' },
    aliases: {
      en: ['software', 'connectivity', 'digital key'],
      'zh-Hans': ['软件', '互联', '数字钥匙'],
    },
  },
  {
    id: 'technology-energy',
    kind: 'technology',
    path: '/technology/energy-ecosystem',
    title: { en: 'Energy ecosystem', 'zh-Hans': '能源生态' },
    aliases: { en: ['energy', 'home charging'], 'zh-Hans': ['能源', '家庭充电'] },
  },
  {
    id: 'technology-safety',
    kind: 'technology',
    path: '/technology/safety',
    title: { en: 'Safety', 'zh-Hans': '安全' },
    aliases: { en: ['safety'], 'zh-Hans': ['安全'] },
  },
  {
    id: 'support',
    kind: 'support',
    path: '/support',
    title: { en: 'Support', 'zh-Hans': '支持' },
    aliases: { en: ['help', 'service'], 'zh-Hans': ['帮助', '服务'] },
  },
  {
    id: 'retailers',
    kind: 'retailer',
    path: '/retailers',
    title: { en: 'Retailers', 'zh-Hans': '零售商' },
    aliases: { en: ['dealer', 'store', 'retailer'], 'zh-Hans': ['经销商', '门店', '零售商'] },
  },
  {
    id: 'news',
    kind: 'news',
    path: '/news',
    title: { en: 'News', 'zh-Hans': '新闻' },
    aliases: { en: ['updates', 'stories'], 'zh-Hans': ['动态', '故事'] },
  },
] as const;

const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  ['ev', 'electric', 'vehicle', 'vehicles', 'car', 'cars', '车型', '汽车', '车辆'],
  ['dealer', 'dealers', 'retailer', 'retailers', 'store', '经销商', '零售商', '门店'],
  ['charge', 'charging', 'charger', '充电'],
  ['driver', 'driving', 'adas', '驾驶', '驾驶辅助'],
  ['software', 'connectivity', 'connected', '软件', '互联'],
  ['help', 'support', 'service', '帮助', '支持', '服务'],
  ['news', 'story', 'stories', 'update', 'updates', '新闻', '动态'],
];

export function tokenizeSearchTerm(value: string, locale: Locale): readonly string[] {
  const normalized = value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase(locale === 'zh-Hans' ? 'zh-CN' : 'en-AU');
  if (normalized.length === 0) {
    return [];
  }

  const tokens =
    locale === 'zh-Hans'
      ? Array.from(normalized).filter((token) => /[\p{L}\p{N}]/u.test(token))
      : normalized
          .split(/[^\p{L}\p{N}]+/u)
          .filter((token) => token.length > 1 || /\d/u.test(token));
  return Array.from(new Set([normalized, ...tokens]));
}

export function expandSearchTerms(value: string, locale: Locale): readonly string[] {
  const tokens = tokenizeSearchTerm(value, locale);
  const expanded = new Set(tokens);
  for (const group of SYNONYM_GROUPS) {
    if (group.some((term) => tokens.includes(term))) {
      group.forEach((term) => expanded.add(term));
    }
  }
  return [...expanded];
}

export function searchSiteIndex(
  context: MarketLocaleContext,
  value: string,
): readonly SearchResult[] {
  const terms = expandSearchTerms(value, context.locale);
  if (terms.length === 0) {
    return [];
  }

  const basePath = '/' + context.locale + '/' + context.market;
  return SEARCH_DOCUMENTS.filter((document) => {
    const searchable = [
      document.title[context.locale],
      ...document.aliases[context.locale],
      document.title.en,
      ...document.aliases.en,
    ]
      .join(' ')
      .normalize('NFKC')
      .toLocaleLowerCase(context.locale === 'zh-Hans' ? 'zh-CN' : 'en-AU');
    return terms.some((term) => searchable.includes(term));
  }).map((document) => ({
    id: document.id,
    kind: document.kind,
    title: {
      defaultLocale: context.locale,
      values: { [context.locale]: document.title[context.locale] },
    },
    path: basePath + document.path,
  }));
}

export function searchSuggestions(locale: Locale): readonly string[] {
  return locale === 'zh-Hans'
    ? ['车型', '电池', '智能驾驶', '零售商']
    : ['vehicles', 'battery', 'intelligent driving', 'retailers'];
}
