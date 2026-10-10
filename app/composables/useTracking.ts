import type { TrackingEvent } from '~~/shared/types/tracking'

// Analytics are off by default (ANALYTICS_PROVIDER=none, section 12) and this
// adapter is the one place a real provider's script would ever get loaded —
// deliberately not wired to an actual GA/Meta Pixel/etc. yet, since loading a
// third-party script the owner hasn't configured and consented to would
// violate the same section. When a real provider is added, load its script
// here (consent-gated if that policy applies), not anywhere else in the app.
export function useTracking() {
  const provider = useRuntimeConfig().public.analyticsProvider

  function track(event: TrackingEvent) {
    if (provider === 'none' || !provider) return
    if (import.meta.dev) {
      console.debug('[tracking]', event)
    }
    // No real sink configured in this MVP — see the comment above.
  }

  return { track }
}
