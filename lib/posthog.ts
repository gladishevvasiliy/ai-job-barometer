import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: false // We'll handle this manually
    })
  }
}

export const captureEvent = (name: string, properties?: Record<string, any>) => {
  posthog.capture(name, properties)
}
