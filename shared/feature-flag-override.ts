import { cookies } from "next/headers";
import {
  FeatureFlagOverrideCookie,
  FeatureFlagOverrideEnabledValue,
  FeatureFlagOverrideHeader,
  PrelecaoPublicaFeatureFlag,
} from "./feature-flag-contract";

export { FeatureFlagOverrideCookie, FeatureFlagOverrideEnabledValue, FeatureFlagOverrideHeader } from "./feature-flag-contract";

export async function prelecaoPublicaCookieOverride(): Promise<boolean> {
  return (await cookies()).get(FeatureFlagOverrideCookie)?.value === FeatureFlagOverrideEnabledValue;
}

export async function featureFlagOverrideHeaders(): Promise<Headers> {
  const headers = new Headers();
  if (await prelecaoPublicaCookieOverride()) {
    headers.set(FeatureFlagOverrideHeader, PrelecaoPublicaFeatureFlag);
  }
  return headers;
}
