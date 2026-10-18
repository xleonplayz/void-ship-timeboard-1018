# Timeboard

A small international team planner with a real browser interface, server-side IANA timezone conversion and a UTF-8 iCalendar download. Synthetic events and budgets only; no accounts or secrets. Requires Node.js with Intl/ICU support. Run `npm start` (PORT defaults to 3000).

This fixture tests the two occurrences of 02:30 during Berlin's autumn clock change, the missing spring hour, New York's autumn change, fractional offsets, local date/year boundaries, locale-sensitive currency formatting, and folded Unicode calendar lines. UTC instants are the source of truth. The 90-minute handover crosses a clock change deliberately.

Endpoints: `/health`, `/api/schedule?zone=Europe/Berlin&locale=de-DE`, `/api/convert?instant=2026-10-25T00%3A30%3A00Z&zone=Europe/Berlin&locale=de-DE`, `/calendar.ics`. Small independent controls are under `/diagnostic/date`, `/diagnostic/intl`, `/diagnostic/parts`, `/diagnostic/number`.

`TEAM_LABEL` is an optional public display label, not a credential. All runtime state derives from source and query parameters; there is no volatile booking database. The app reports conversion errors directly and does not substitute browser-computed results for failed server conversion.
