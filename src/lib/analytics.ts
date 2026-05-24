type AnalyticsEvent =
  | 'page_viewed'
  | 'currency_changed'
  | 'nisab_threshold_selected'
  | 'calculator_input_started'
  | 'calculator_completed'
  | 'reminder_email_submitted'
  | 'blog_article_opened';

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with analytics provider (PostHog / GA4)
    console.log('[Analytics]', event, properties);
  }
}
