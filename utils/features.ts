import featuresConfig from "@config/features.json";

export function isFeatureEnabled(
  featureName: keyof typeof featuresConfig.features
): boolean {
  return featuresConfig.features[featureName] ?? false;
}
