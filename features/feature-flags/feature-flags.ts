import { backendGetJson } from "../../shared/backend";
import { prelecaoPublicaCookieOverride } from "../../shared/feature-flag-override";

export const FEATURE_PRELECAO_PUBLICA = "FEATURE_PRELECAO_PUBLICA";

type FeatureFlagName = typeof FEATURE_PRELECAO_PUBLICA;

type FeatureFlagState = {
  name: FeatureFlagName;
  enabled: boolean;
};

export interface FeatureFlags {
  isEnabled(name: FeatureFlagName): Promise<boolean>;
}

class BackendFeatureFlags implements FeatureFlags {
  async isEnabled(name: FeatureFlagName): Promise<boolean> {
    if (name === FEATURE_PRELECAO_PUBLICA && await prelecaoPublicaCookieOverride()) {
      return true;
    }

    const state = await backendGetJson<FeatureFlagState>(
      `/api/feature-flags/${pathByName[name]}`,
    );

    return state?.name === name && state.enabled === true;
  }
}

const pathByName: Record<FeatureFlagName, string> = {
  [FEATURE_PRELECAO_PUBLICA]: "prelecao-publica",
};

export const featureFlags: FeatureFlags = new BackendFeatureFlags();
