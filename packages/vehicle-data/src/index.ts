export const EAL_MODEL_CODES = ['c2', 's4', 's6', 'x4', 'x6', 'r9'] as const;

export type EalModelCode = (typeof EAL_MODEL_CODES)[number];

export interface ModelPlaceholder {
  readonly code: EalModelCode;
  readonly category: 'sedan' | 'suv' | 'grand-tourer';
  readonly mediaStatus: 'pending';
  readonly contentStatus: 'pending';
}

/**
 * Presentation-safe model registry. It intentionally contains model identity
 * only: no production specifications, pricing, availability, or claims.
 */
export const MODEL_PLACEHOLDERS: readonly ModelPlaceholder[] = [
  { code: 'c2', category: 'suv', mediaStatus: 'pending', contentStatus: 'pending' },
  { code: 's4', category: 'sedan', mediaStatus: 'pending', contentStatus: 'pending' },
  { code: 's6', category: 'sedan', mediaStatus: 'pending', contentStatus: 'pending' },
  { code: 'x4', category: 'suv', mediaStatus: 'pending', contentStatus: 'pending' },
  { code: 'x6', category: 'suv', mediaStatus: 'pending', contentStatus: 'pending' },
  {
    code: 'r9',
    category: 'grand-tourer',
    mediaStatus: 'pending',
    contentStatus: 'pending',
  },
] as const;
