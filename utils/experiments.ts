export type CopyVariant = 'A' | 'B';

const STORAGE_KEY = 'bp_copy_variant_v1';

export const getCopyVariant = (): CopyVariant => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'A' || stored === 'B') return stored;
    const variant: CopyVariant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(STORAGE_KEY, variant);
    return variant;
  } catch {
    return 'A';
  }
};
