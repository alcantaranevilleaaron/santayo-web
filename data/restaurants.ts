import type { Restaurant } from "./restaurant.types";

export type { Restaurant };

import { HIGH_STREET_RESTAURANTS } from "./restaurants/high-street";
import { ONE_BONIFACIO_RESTAURANTS } from "./restaurants/one-bonifacio";
import { FORBESTOWN_RESTAURANTS } from "./restaurants/forbestown";
import { BURGOS_CIRCLE_RESTAURANTS } from "./restaurants/burgos-circle";
import { SHANGRI_LA_RESTAURANTS } from "./restaurants/shangri-la";
import { UPTOWN_RESTAURANTS } from "./restaurants/uptown";
import { BGC_RESTAURANTS } from "./restaurants/bgc";
import { AURA_MARKET_RESTAURANTS } from "./restaurants/aura-market";

export const RESTAURANTS: Restaurant[] = [
  ...HIGH_STREET_RESTAURANTS,
  ...ONE_BONIFACIO_RESTAURANTS,
  ...FORBESTOWN_RESTAURANTS,
  ...BURGOS_CIRCLE_RESTAURANTS,
  ...SHANGRI_LA_RESTAURANTS,
  ...UPTOWN_RESTAURANTS,
  ...BGC_RESTAURANTS,
  ...AURA_MARKET_RESTAURANTS,
];
