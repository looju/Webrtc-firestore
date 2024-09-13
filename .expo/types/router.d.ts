/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/explore` | `/InlineAd` | `/_sitemap` | `/call` | `/explore` | `/join` | `/joinroom`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
