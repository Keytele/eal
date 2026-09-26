'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { Locale, Market } from '@eal/domain';
import { MODEL_PLACEHOLDERS } from '@eal/vehicle-data';
import ealLogo from '../../../../Logo/Logo.png';

import { text } from '../content/copy';
import { toRoute } from './routes';

interface SiteHeaderProperties {
  readonly locale: Locale;
  readonly market: Market;
}

export function SiteHeader({ locale, market }: SiteHeaderProperties) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktopPanel, setDesktopPanel] = useState<'vehicles' | 'technology'>();
  const menuButtonReference = useRef<HTMLButtonElement>(null);
  const basePath = '/' + locale + '/' + market;
  const alternateLocale = locale === 'en' ? 'zh-Hans' : 'en';
  const routeSuffix = pathname?.startsWith(basePath) ? pathname.slice(basePath.length) : '';
  const alternateLocaleHref = '/' + alternateLocale + '/' + market + routeSuffix;

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 20);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }
      setOpen(false);
      setDesktopPanel(undefined);
      menuButtonReference.current?.focus();
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const navigation = [
    [text(locale, 'design'), '/design'],
    [text(locale, 'sustainability'), '/sustainability'],
    [text(locale, 'ourStory'), '/about'],
  ] as const;

  return (
    <header className={['site-header', scrolled ? 'site-header-scrolled' : ''].join(' ')}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-header-inner">
        <Link aria-label={text(locale, 'ealHome')} className="brand-link" href={toRoute(basePath)}>
          <Image alt="" priority src={ealLogo} />
        </Link>
        <nav aria-label={text(locale, 'primaryNavigation')} className="desktop-navigation">
          <button
            aria-controls="vehicles-menu"
            aria-expanded={desktopPanel === 'vehicles'}
            onClick={() =>
              setDesktopPanel((current) => (current === 'vehicles' ? undefined : 'vehicles'))
            }
            type="button"
          >
            {text(locale, 'vehicles')}
          </button>
          <button
            aria-controls="technology-menu"
            aria-expanded={desktopPanel === 'technology'}
            onClick={() =>
              setDesktopPanel((current) => (current === 'technology' ? undefined : 'technology'))
            }
            type="button"
          >
            {text(locale, 'technology')}
          </button>
          {navigation.map(([label, suffix]) => (
            <Link href={toRoute(basePath + suffix)} key={suffix}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-utility" href={toRoute(basePath + '/search')}>
            {text(locale, 'search')}
          </Link>
          <Link
            aria-label={text(locale, 'switchLanguage')}
            className="header-utility"
            href={toRoute(alternateLocaleHref)}
          >
            {locale === 'en' ? text(locale, 'simplifiedChinese') : text(locale, 'english')}
          </Link>
          <Link className="button button-header" href={toRoute(basePath + '/test-drive')}>
            {text(locale, 'bookDrive')}
          </Link>
          <button
            aria-expanded={open}
            aria-label={open ? text(locale, 'closeNavigation') : text(locale, 'openNavigation')}
            className="menu-button"
            onClick={() => setOpen((value) => !value)}
            ref={menuButtonReference}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      {desktopPanel === 'vehicles' ? (
        <div className="mega-menu" id="vehicles-menu">
          <div className="mega-menu-inner">
            <div>
              <p className="section-kicker">{text(locale, 'allModels')}</p>
              <Link
                href={toRoute(basePath + '/vehicles')}
                onClick={() => setDesktopPanel(undefined)}
              >
                {text(locale, 'vehicles')}
              </Link>
            </div>
            <div className="mega-menu-grid">
              {MODEL_PLACEHOLDERS.map((model) => (
                <Link
                  href={toRoute(basePath + '/vehicles/' + model.code)}
                  key={model.code}
                  onClick={() => setDesktopPanel(undefined)}
                >
                  <span>{model.code.toUpperCase()}</span>
                  <small>{text(locale, 'contentPending')}</small>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {desktopPanel === 'technology' ? (
        <div className="mega-menu" id="technology-menu">
          <div className="mega-menu-inner">
            <div>
              <p className="section-kicker">{text(locale, 'technologyOverview')}</p>
              <Link
                href={toRoute(basePath + '/technology')}
                onClick={() => setDesktopPanel(undefined)}
              >
                {text(locale, 'technology')}
              </Link>
            </div>
            <div className="mega-menu-grid">
              {['800v-architecture', 'battery-charging', 'intelligent-driving'].map((slug) => (
                <Link
                  href={toRoute(basePath + '/technology/' + slug)}
                  key={slug}
                  onClick={() => setDesktopPanel(undefined)}
                >
                  <span>{slug.replaceAll('-', ' ')}</span>
                  <small>{text(locale, 'contentPending')}</small>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {open ? (
        <nav aria-label={text(locale, 'mobileNavigation')} className="mobile-navigation">
          <Link href={toRoute(basePath + '/vehicles')} onClick={() => setOpen(false)}>
            {text(locale, 'vehicles')}
          </Link>
          <Link href={toRoute(basePath + '/technology')} onClick={() => setOpen(false)}>
            {text(locale, 'technology')}
          </Link>
          {navigation.map(([label, suffix]) => (
            <Link href={toRoute(basePath + suffix)} key={suffix} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href={toRoute(basePath + '/shop')} onClick={() => setOpen(false)}>
            {text(locale, 'configure')}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
