import Link from 'next/link';
import Image from 'next/image';

import type { Locale, Market } from '@eal/domain';
import ealLogo from '../../../../Logo/Logo.png';

import { text } from '../content/copy';
import { toRoute } from './routes';

interface SiteFooterProperties {
  readonly locale: Locale;
  readonly market: Market;
}

export function SiteFooter({ locale, market }: SiteFooterProperties) {
  const basePath = '/' + locale + '/' + market;
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <Image alt="EAL" className="footer-logo" src={ealLogo} />
          <p>{text(locale, 'demoNotice')}</p>
        </div>
        <div className="footer-links">
          <Link href={toRoute(basePath + '/ownership')}>{text(locale, 'ownership')}</Link>
          <Link href={toRoute(basePath + '/support')}>{text(locale, 'support')}</Link>
          <Link href={toRoute(basePath + '/retailers')}>{text(locale, 'retailers')}</Link>
          <Link href={toRoute(basePath + '/privacy')}>{text(locale, 'privacy')}</Link>
          <Link href={toRoute(basePath + '/accessibility')}>{text(locale, 'accessibility')}</Link>
          <a href="#main-content">{text(locale, 'backToTop')}</a>
        </div>
      </div>
    </footer>
  );
}
