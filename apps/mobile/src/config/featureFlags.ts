export const featureFlags = {
  oauthGoogle: true,
  showNativeHeader: false, // Controls whether React Navigation's native header/back button is shown
} as const;

export type FeatureFlags = typeof featureFlags;

export function useFeatureFlags(): FeatureFlags {
  return featureFlags;
}

