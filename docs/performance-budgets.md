# Performance and motion budgets

The launch budgets live in [../performance-budget.json](../performance-budget.json). The file is the CI source of truth for synthetic route checks and the route-level motion audit.

The current gates are:

- LCP ≤ 2.5 seconds, INP ≤ 200 ms, and CLS ≤ 0.1 on the target device profile.
- JavaScript ≤ 240 KB and the current-page image budget ≤ 500 KB before approved exceptions.
- No third-party requests before consent; advanced media is lazy and feature-flagged.
- Hero reveal completes within 1.8 seconds, section reveals travel no more than 24 px, and offscreen observers are disconnected.

`pnpm check:performance` validates the budget document. A CI runner with the approved staging origin must additionally record route measurements and attach the report to the release evidence.
