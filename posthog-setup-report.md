# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the DevEvent Next.js App Router project. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics through `/ingest` and avoid ad blockers. Three components were instrumented to capture key user engagement events.

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the 'Explore Events' CTA button on the homepage hero section. | `app/components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details, with event title, slug, location, and date as properties. | `app/components/EventCard.tsx` |
| `create_event_clicked` | User clicks the 'Create Event' link in the navigation bar, indicating intent to create a new event. | `app/components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/507698/dashboard/1832936)
- [Explore Events button clicks (wizard)](https://us.posthog.com/project/507698/insights/0NbHfHnj)
- [Event card clicks by event (wizard)](https://us.posthog.com/project/507698/insights/KJpETX8C)
- [Create Event intent clicks (wizard)](https://us.posthog.com/project/507698/insights/pLdT6fdh)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` (or any bootstrap/onboarding scripts) so collaborators know what values to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
