export const featureFlags = {
  oauthGoogle: true,
} as const;

export type FeatureFlags = typeof featureFlags;

export function useFeatureFlags(): FeatureFlags {
  return featureFlags;
}

