import type { Locale, MarketLocaleContext } from '@eal/domain';

export type CopyKey =
  | 'chooseLanguage'
  | 'chooseMarket'
  | 'continue'
  | 'vehicleMediaPending'
  | 'contentPending'
  | 'commercialUnavailable'
  | 'viewVehicles'
  | 'exploreTechnology'
  | 'configure'
  | 'bookDrive'
  | 'vehicles'
  | 'technology'
  | 'design'
  | 'sustainability'
  | 'ourStory'
  | 'search'
  | 'legal'
  | 'privacy'
  | 'accessibility'
  | 'market'
  | 'language'
  | 'demoNotice'
  | 'acceptEssential'
  | 'managePreferences'
  | 'allModels'
  | 'mediaManifest'
  | 'modelOverview'
  | 'technologyOverview'
  | 'serviceUnavailable'
  | 'serviceDataNotice'
  | 'tryAgain'
  | 'backToTop'
  | 'entryKicker'
  | 'entryTitle'
  | 'entryDescription'
  | 'english'
  | 'simplifiedChinese'
  | 'australia'
  | 'china'
  | 'ownership'
  | 'support'
  | 'retailers'
  | 'configuratorHeading'
  | 'configuratorPending'
  | 'trim'
  | 'exterior'
  | 'interior'
  | 'wheels'
  | 'packages'
  | 'summary'
  | 'skipToContent'
  | 'ealHome'
  | 'primaryNavigation'
  | 'mobileNavigation'
  | 'openNavigation'
  | 'closeNavigation'
  | 'switchLanguage'
  | 'cookieConsent'
  | 'preferenceTitle'
  | 'preferenceDescription'
  | 'close'
  | 'previousModel'
  | 'nextModel'
  | 'filterBy'
  | 'compare'
  | 'removeCompare'
  | 'noResults'
  | 'all'
  | 'suv'
  | 'sedan'
  | 'grandTourer'
  | 'modelSections'
  | 'overview'
  | 'exterior'
  | 'interior'
  | 'trims'
  | 'specifications'
  | 'gallery'
  | 'commerce'
  | 'technology800v'
  | 'technologyBattery'
  | 'technologyDriving'
  | 'technologySoftware'
  | 'technologyEnergy'
  | 'safety'
  | 'buildSummary'
  | 'summaryPending'
  | 'saveBuild'
  | 'shareBuild'
  | 'buildSaved'
  | 'buildLinkCopied'
  | 'localDemoSave'
  | 'service'
  | 'requestService'
  | 'inventory'
  | 'contact'
  | 'tradeIn'
  | 'reserve'
  | 'finance'
  | 'savedBuilds'
  | 'searchResults'
  | 'news'
  | 'editorialReadiness'
  | 'editorialPending'
  | 'readArticle'
  | 'relatedContent'
  | 'datePending'
  | 'searchNoResults'
  | 'searchRecovery'
  | 'inventorySearchSeparate'
  | 'searchSuggestions'
  | 'legalPending'
  | 'legalVersion'
  | 'viewDisclosure'
  | 'cookies'
  | 'terms'
  | 'financeDisclosure'
  | 'reservationDisclosure'
  | 'vehicleDataDisclosure'
  | 'driverAssistanceDisclosure'
  | 'dimensions'
  | 'battery'
  | 'charging'
  | 'performance'
  | 'specification'
  | 'status'
  | 'bodyType'
  | 'availability'
  | 'compareVehicles'
  | 'compareInstructions'
  | 'noComparison'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'submitRequest'
  | 'requestPending'
  | 'searchInput'
  | 'searchSubmit'
  | 'viewerRegion'
  | 'dragHint'
  | 'startViewer'
  | 'previousFrame'
  | 'nextFrame'
  | 'framePosition'
  | 'expand'
  | 'collapse'
  | 'stageList'
  | 'stagePosition'
  | 'homeReadiness'
  | 'productInformationStatus'
  | 'catalog'
  | 'media';

const additionalEnglishCopy: Pick<
  Record<CopyKey, string>,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'submitRequest'
  | 'requestPending'
  | 'searchInput'
  | 'searchSubmit'
  | 'viewerRegion'
  | 'dragHint'
  | 'startViewer'
  | 'previousFrame'
  | 'nextFrame'
  | 'framePosition'
  | 'expand'
  | 'collapse'
  | 'stageList'
  | 'stagePosition'
  | 'homeReadiness'
  | 'productInformationStatus'
  | 'catalog'
  | 'media'
> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  submitRequest: 'Submit request',
  requestPending: 'This request is ready for an approved service connection.',
  searchInput: 'Search EAL',
  searchSubmit: 'Search',
  viewerRegion: 'Vehicle 360 view',
  dragHint: 'Use arrow keys or drag to change the view.',
  startViewer: 'Open 360 view',
  previousFrame: 'Previous view',
  nextFrame: 'Next view',
  framePosition: 'View {current} of {total}',
  expand: 'Explore sequence',
  collapse: 'Close sequence',
  stageList: 'Technical sequence stages',
  stagePosition: 'Stage {current} of {total}',
  homeReadiness:
    'The production experience is ready for approved market content, vehicle media, and operational data.',
  productInformationStatus: 'Product information status',
  catalog: 'Catalog',
  media: 'Media',
};

const additionalChineseCopy: typeof additionalEnglishCopy = {
  firstName: '\u540d',
  lastName: '\u59d3',
  email: '\u7535\u5b50\u90ae\u4ef6',
  submitRequest: '\u63d0\u4ea4\u8bf7\u6c42',
  requestPending:
    '\u8be5\u8bf7\u6c42\u5df2\u51c6\u5907\u597d\u63a5\u5165\u7ecf\u6279\u51c6\u7684\u670d\u52a1\u3002',
  searchInput: '\u641c\u7d22 EAL',
  searchSubmit: '\u641c\u7d22',
  viewerRegion: '\u8f66\u8f86 360 \u89c6\u56fe',
  dragHint: '\u4f7f\u7528\u65b9\u5411\u952e\u6216\u62d6\u52a8\u5207\u6362\u89c6\u56fe\u3002',
  startViewer: '\u6253\u5f00 360 \u89c6\u56fe',
  previousFrame: '\u4e0a\u4e00\u4e2a\u89c6\u56fe',
  nextFrame: '\u4e0b\u4e00\u4e2a\u89c6\u56fe',
  framePosition: '\u89c6\u56fe {current}/{total}',
  expand: '\u5c55\u5f00\u5e8f\u5217',
  collapse: '\u5173\u95ed\u5e8f\u5217',
  stageList: '\u6280\u672f\u5e8f\u5217\u9636\u6bb5',
  stagePosition: '\u9636\u6bb5 {current}/{total}',
  homeReadiness:
    '\u751f\u4ea7\u7ea7\u4f53\u9a8c\u5df2\u51c6\u5907\u597d\u63a5\u5165\u7ecf\u6279\u51c6\u7684\u5e02\u573a\u5185\u5bb9\u3001\u8f66\u8f86\u5a92\u4f53\u4e0e\u8fd0\u8425\u6570\u636e\u3002',
  productInformationStatus: '\u4ea7\u54c1\u4fe1\u606f\u72b6\u6001',
  catalog: '\u4ea7\u54c1\u76ee\u5f55',
  media: '\u5a92\u4f53',
};

const copy: Record<Locale, Record<CopyKey, string>> = {
  en: {
    ...additionalEnglishCopy,
    chooseLanguage: 'Choose language',
    chooseMarket: 'Choose market',
    continue: 'Continue',
    vehicleMediaPending: 'Approved vehicle media pending',
    contentPending: 'Approved content pending',
    commercialUnavailable:
      'Commercial information is unavailable until an approved provider is connected.',
    viewVehicles: 'View vehicles',
    exploreTechnology: 'Explore technology',
    configure: 'Configure',
    bookDrive: 'Book a test drive',
    vehicles: 'Vehicles',
    technology: 'Technology',
    design: 'Design',
    sustainability: 'Sustainability',
    ourStory: 'Our story',
    search: 'Search',
    legal: 'Legal',
    privacy: 'Privacy',
    accessibility: 'Accessibility',
    market: 'Market',
    language: 'Language',
    demoNotice: 'Local demonstration mode. No customer or commercial data is collected.',
    acceptEssential: 'Accept essential only',
    managePreferences: 'Manage preferences',
    allModels: 'All models',
    mediaManifest: 'See media manifest',
    modelOverview: 'Model overview',
    technologyOverview: 'Technology overview',
    serviceUnavailable: 'This service is not connected for this environment.',
    serviceDataNotice: 'No stale operational data is shown while the source is unavailable.',
    tryAgain: 'Try again',
    backToTop: 'Back to top',
    entryKicker: 'Electric mobility',
    entryTitle: 'Choose your market',
    entryDescription:
      'Language and market are selected separately to keep vehicle, legal, and commercial information accurate.',
    english: 'English',
    simplifiedChinese: 'Simplified Chinese',
    australia: 'Australia',
    china: 'China',
    ownership: 'Ownership',
    support: 'Support',
    retailers: 'Retailers',
    configuratorHeading: 'Configuration workspace',
    configuratorPending:
      'Approved configuration data is required before selections can be offered.',
    trim: 'Trim',
    exterior: 'Exterior',
    interior: 'Interior',
    wheels: 'Wheels',
    packages: 'Packages',
    summary: 'Summary',
    skipToContent: 'Skip to content',
    ealHome: 'EAL home',
    primaryNavigation: 'Primary navigation',
    mobileNavigation: 'Mobile navigation',
    openNavigation: 'Open navigation',
    closeNavigation: 'Close navigation',
    switchLanguage: 'Switch language',
    cookieConsent: 'Cookie consent',
    preferenceTitle: 'Privacy preferences',
    preferenceDescription:
      'Only essential storage is active in this local demonstration. Analytics and marketing remain disabled.',
    close: 'Close',
    previousModel: 'Previous model',
    nextModel: 'Next model',
    filterBy: 'Filter by body type',
    compare: 'Compare',
    removeCompare: 'Remove from compare',
    noResults: 'No approved vehicles match this selection.',
    all: 'All',
    suv: 'SUV',
    sedan: 'Sedan',
    grandTourer: 'Grand tourer',
    modelSections: 'Model sections',
    overview: 'Overview',
    trims: 'Trims',
    specifications: 'Specifications',
    gallery: 'Gallery',
    commerce: 'Shopping',
    technology800v: '800V architecture',
    technologyBattery: 'Battery and charging',
    technologyDriving: 'Intelligent driving',
    technologySoftware: 'Software and connectivity',
    technologyEnergy: 'Energy ecosystem',
    safety: 'Safety',
    buildSummary: 'Build summary',
    summaryPending: 'Approved pricing and availability are pending.',
    saveBuild: 'Save build',
    shareBuild: 'Share build',
    buildSaved: 'Build saved in this browser for this local demonstration.',
    buildLinkCopied: 'Build link copied.',
    localDemoSave: 'No account or production build is created in this environment.',
    service: 'Service',
    requestService: 'Request support',
    inventory: 'Inventory',
    contact: 'Contact',
    tradeIn: 'Trade-in',
    reserve: 'Reserve',
    finance: 'Finance',
    savedBuilds: 'Saved builds',
    searchResults: 'Search results',
    news: 'News',
    editorialReadiness: 'Approved stories will appear here when publication is complete.',
    editorialPending: 'News is not published for this market yet.',
    readArticle: 'Read article',
    relatedContent: 'Related content',
    datePending: 'Publication date pending',
    searchNoResults: 'No approved pages match this search.',
    searchRecovery: 'Try a model name, technology topic, or support term.',
    inventorySearchSeparate:
      'Live inventory is searched separately because it is operational data.',
    searchSuggestions: 'Suggested searches',
    legalPending: 'The current approved legal version is not published for this market.',
    legalVersion: 'Version',
    viewDisclosure: 'View disclosure',
    cookies: 'Cookies',
    terms: 'Terms',
    financeDisclosure: 'Finance disclosure',
    reservationDisclosure: 'Reservation disclosure',
    vehicleDataDisclosure: 'Vehicle data disclosure',
    driverAssistanceDisclosure: 'Driver-assistance disclosure',
    dimensions: 'Dimensions',
    battery: 'Battery',
    charging: 'Charging',
    performance: 'Performance',
    specification: 'Specification',
    status: 'Status',
    bodyType: 'Body type',
    availability: 'Availability',
    compareVehicles: 'Compare vehicles',
    compareInstructions: 'Choose at least two vehicles from the range to compare.',
    noComparison: 'No comparison selected',
  },
  'zh-Hans': {
    editorialReadiness:
      '\u7ecf\u6279\u51c6\u7684\u65b0\u95fb\u5c06\u5728\u5b8c\u6210\u53d1\u5e03\u540e\u663e\u793a\u3002',
    editorialPending: '\u5f53\u524d\u5e02\u573a\u5c1a\u672a\u53d1\u5e03\u65b0\u95fb\u3002',
    readArticle: '\u9605\u8bfb\u6587\u7ae0',
    relatedContent: '\u76f8\u5173\u5185\u5bb9',
    datePending: '\u53d1\u5e03\u65e5\u671f\u5f85\u5b9a',
    searchNoResults: '\u6ca1\u6709\u5339\u914d\u7684\u7ecf\u6279\u51c6\u9875\u9762\u3002',
    searchRecovery:
      '\u8bf7\u5c1d\u8bd5\u641c\u7d22\u8f66\u578b\u3001\u79d1\u6280\u4e3b\u9898\u6216\u652f\u6301\u5185\u5bb9\u3002',
    inventorySearchSeparate:
      '\u73b0\u8f66\u4fe1\u606f\u5c5e\u4e8e\u8fd0\u8425\u6570\u636e\uff0c\u9700\u4f7f\u7528\u5355\u72ec\u641c\u7d22\u3002',
    searchSuggestions: '\u5efa\u8bae\u641c\u7d22',
    legalPending:
      '\u5f53\u524d\u5e02\u573a\u5c1a\u672a\u53d1\u5e03\u7ecf\u6279\u51c6\u7684\u6cd5\u5f8b\u7248\u672c\u3002',
    legalVersion: '\u7248\u672c',
    viewDisclosure: '\u67e5\u770b\u62ab\u9732\u4fe1\u606f',
    cookies: '\u7f51\u7ad9 Cookie',
    terms: '\u4f7f\u7528\u6761\u6b3e',
    financeDisclosure: '\u91d1\u878d\u62ab\u9732\u4fe1\u606f',
    reservationDisclosure: '\u9884\u7ea6\u62ab\u9732\u4fe1\u606f',
    vehicleDataDisclosure: '\u8f66\u8f86\u6570\u636e\u62ab\u9732\u4fe1\u606f',
    driverAssistanceDisclosure: '\u9a7e\u9a76\u8f85\u52a9\u62ab\u9732\u4fe1\u606f',
    ...additionalChineseCopy,
    chooseLanguage: '选择语言',
    chooseMarket: '选择市场',
    continue: '继续',
    vehicleMediaPending: '待提供经批准的车辆媒体',
    contentPending: '待提供经批准的内容',
    commercialUnavailable: '在接入经批准的数据服务前，商业信息暂不可用。',
    viewVehicles: '浏览车型',
    exploreTechnology: '探索科技',
    configure: '配置车辆',
    bookDrive: '预约试驾',
    vehicles: '车型',
    technology: '科技',
    design: '设计',
    sustainability: '可持续发展',
    ourStory: '品牌故事',
    search: '搜索',
    legal: '法律信息',
    privacy: '隐私',
    accessibility: '无障碍',
    market: '市场',
    language: '语言',
    demoNotice: '本地演示模式，不收集客户或商业数据。',
    acceptEssential: '仅接受必要项目',
    managePreferences: '管理偏好',
    allModels: '全部车型',
    mediaManifest: '查看媒体清单',
    modelOverview: '车型概览',
    technologyOverview: '科技概览',
    serviceUnavailable: '此环境尚未接入该服务。',
    serviceDataNotice:
      '\u6570\u636e\u6e90\u4e0d\u53ef\u7528\u65f6\uff0c\u4e0d\u663e\u793a\u8fc7\u671f\u7684\u8fd0\u8425\u6570\u636e\u3002',
    tryAgain: '\u91cd\u8bd5',
    backToTop: '返回顶部',
    entryKicker: '纯电出行',
    entryTitle: '选择您的市场',
    entryDescription: '语言与市场分别选择，以确保车型、法律与商业信息准确。',
    english: '英语',
    simplifiedChinese: '简体中文',
    australia: '澳大利亚',
    china: '中国',
    ownership: '车主服务',
    support: '支持',
    retailers: '零售商',
    configuratorHeading: '车辆配置',
    configuratorPending: '需要经批准的配置数据后才能提供选项。',
    trim: '版本',
    exterior: '外观',
    interior: '内饰',
    wheels: '轮毂',
    packages: '套件',
    summary: '摘要',
    skipToContent: '跳至内容',
    ealHome: 'EAL 首页',
    primaryNavigation: '主导航',
    mobileNavigation: '移动端导航',
    openNavigation: '打开导航',
    closeNavigation: '关闭导航',
    switchLanguage: '切换语言',
    cookieConsent: 'Cookie 偏好设置',
    preferenceTitle: '隐私偏好设置',
    preferenceDescription: '此本地演示仅启用必要存储。分析和营销功能保持关闭。',
    close: '关闭',
    previousModel: '上一个车型',
    nextModel: '下一个车型',
    filterBy: '按车身类型筛选',
    compare: '对比',
    removeCompare: '从对比中移除',
    noResults: '没有符合此选择的经批准车型。',
    all: '全部',
    suv: 'SUV',
    sedan: '轿车',
    grandTourer: '豪华旅行车',
    modelSections: '车型分区',
    overview: '概览',
    trims: '版本',
    specifications: '规格',
    gallery: '图库',
    commerce: '购车',
    technology800v: '800V 架构',
    technologyBattery: '电池与充电',
    technologyDriving: '智能驾驶',
    technologySoftware: '软件与互联',
    technologyEnergy: '能源生态',
    safety: '安全',
    buildSummary: '配置摘要',
    summaryPending: '经批准的价格和可用性信息待提供。',
    saveBuild: '保存配置',
    shareBuild: '分享配置',
    buildSaved:
      '\u914d\u7f6e\u5df2\u4fdd\u5b58\u5728\u6b64\u6d4f\u89c8\u5668\u4e2d\uff0c\u4ec5\u7528\u4e8e\u672c\u5730\u6f14\u793a\u3002',
    buildLinkCopied: '\u914d\u7f6e\u94fe\u63a5\u5df2\u590d\u5236\u3002',
    localDemoSave:
      '\u6b64\u73af\u5883\u4e0d\u4f1a\u521b\u5efa\u8d26\u6237\u6216\u751f\u4ea7\u914d\u7f6e\u3002',
    service: '服务',
    requestService: '请求支持',
    inventory: '现车',
    contact: '联系',
    tradeIn: '置换',
    reserve: '预约',
    finance: '金融',
    savedBuilds: '已保存配置',
    searchResults: '搜索结果',
    news: '新闻',
    dimensions: '尺寸',
    battery: '电池',
    charging: '充电',
    performance: '性能',
    specification: '规格项目',
    status: '状态',
    bodyType: '车身类型',
    availability: '可用性',
    compareVehicles: '对比车型',
    compareInstructions: '从车型列表中至少选择两款车型进行对比。',
    noComparison: '尚未选择对比车型',
  },
};

export function text(locale: Locale, key: CopyKey): string {
  return copy[locale][key];
}

export function marketName(context: MarketLocaleContext): string {
  const names: Record<Locale, Record<MarketLocaleContext['market'], string>> = {
    en: { au: 'Australia', cn: 'China' },
    'zh-Hans': { au: '澳大利亚', cn: '中国' },
  };
  return names[context.locale][context.market];
}
