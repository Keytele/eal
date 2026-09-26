'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import type { Locale, Market } from '@eal/domain';

interface WebVitalsReporterProperties {
  readonly locale: Locale;
  readonly market: Market;
}

interface MetricSample {
  readonly metric: 'LCP' | 'INP' | 'CLS';
  readonly value: number;
  readonly rating: 'good' | 'needs-improvement' | 'poor';
}

/** Consent-gated, same-origin RUM for the three launch metrics. */
export function WebVitalsReporter({ locale, market }: WebVitalsReporterProperties) {
  const pathname = usePathname();

  useEffect(() => {
    const storageKey = 'eal-consent-' + locale + '-' + market;
    const hasAnalyticsConsent = () => window.localStorage.getItem(storageKey) === 'analytics';
    const samples = new Map<MetricSample['metric'], MetricSample>();
    const send = () => {
      if (!hasAnalyticsConsent() || samples.size === 0) {
        return;
      }
      const payload = JSON.stringify({
        locale,
        market,
        pageType: pathname?.split('/').filter(Boolean).slice(2, 3)[0] ?? 'home',
        samples: [...samples.values()],
      });
      navigator.sendBeacon?.('/api/web-vitals', payload);
    };
    const observers: PerformanceObserver[] = [];
    if (typeof PerformanceObserver === 'function') {
      observe(
        'largest-contentful-paint',
        (list) => {
          const entry = list.getEntries().at(-1);
          if (entry !== undefined) {
            samples.set('LCP', toSample('LCP', entry.startTime, 2500, 4000));
          }
        },
        observers,
      );
      observe(
        'layout-shift',
        (list) => {
          const value = list.getEntries().reduce((total, entry) => {
            const candidate = entry as PerformanceEntry & {
              readonly hadRecentInput?: boolean;
              readonly value?: number;
            };
            return total + (candidate.hadRecentInput === true ? 0 : (candidate.value ?? 0));
          }, 0);
          samples.set('CLS', toSample('CLS', value, 0.1, 0.25));
        },
        observers,
      );
      observe(
        'event',
        (list) => {
          const value = list.getEntries().reduce((max, entry) => Math.max(max, entry.duration), 0);
          if (value > 0) {
            samples.set('INP', toSample('INP', value, 200, 500));
          }
        },
        observers,
      );
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        send();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    const timer = window.setTimeout(send, 10_000);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observers.forEach((observer) => observer.disconnect());
      send();
    };
  }, [locale, market, pathname]);

  return null;
}

function observe(
  type: string,
  callback: (list: PerformanceObserverEntryList) => void,
  observers: PerformanceObserver[],
) {
  try {
    const observer = new PerformanceObserver(callback);
    observer.observe({ type, buffered: true });
    observers.push(observer);
  } catch {
    // Older browsers simply do not contribute that metric.
  }
}

function toSample(
  metric: MetricSample['metric'],
  value: number,
  good: number,
  poor: number,
): MetricSample {
  return {
    metric,
    value: Number(value.toFixed(3)),
    rating: value <= good ? 'good' : value <= poor ? 'needs-improvement' : 'poor',
  };
}
