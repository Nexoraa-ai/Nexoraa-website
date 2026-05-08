# Codebase Issue Findings and Task Proposals

## 1) Typo Fix Task
**Issue found:** `README.md` has malformed content at the end of the `Customize` section, where `public/...` is immediately followed by another markdown header (`# Nexoraa-website`) with no newline separation, which reads like an accidental paste/formatting typo.

**Proposed task:**
- Clean up the README ending by separating/removing the accidental trailing header block.
- Keep a single canonical project title/header and ensure markdown formatting is valid.

**Why this matters:**
- Improves first-run developer experience and avoids confusing, duplicated branding text.

## 2) Bug Fix Task
**Issue found:** SEO endpoints and metadata currently use placeholder domain `https://nexoraa.example` (`app/layout.tsx`, `app/robots.txt/route.ts`, `app/sitemap.xml/route.ts`).

**Proposed task:**
- Replace hardcoded placeholder base URL with an environment-driven canonical site URL (for example `NEXT_PUBLIC_SITE_URL` or server-only `SITE_URL`) and use it consistently in:
  - `metadataBase` in `app/layout.tsx`
  - sitemap `<loc>` generation in `app/sitemap.xml/route.ts`
  - robots sitemap pointer in `app/robots.txt/route.ts`
- Add safe fallback behavior for local development.

**Why this matters:**
- Prevents shipping invalid canonical URLs/sitemap links, which can hurt indexing and SEO.

## 3) Code Comment / Documentation Discrepancy Task
**Issue found:** `README.md` says contact is a "Simple form (replace endpoint as needed)", but both homepage and `/contact` currently hardcode `action="https://formsubmit.co"` with no documented setup details, env var, or replace path guidance in code.

**Proposed task:**
- Update README to explicitly document how form submissions are currently handled and how to configure/replace the endpoint.
- Optionally add a small inline comment near form `action` attributes to point to the configuration/docs section.

**Why this matters:**
- Aligns documentation with implementation and reduces deployment surprises.

## 4) Test Improvement Task
**Issue found:** No automated tests are present for critical content-routing helpers and dynamic routes (e.g., `unitBySlug`, `postBySlug`, and route param assumptions).

**Proposed task:**
- Add lightweight unit tests for `content/units.ts` and `content/blog.ts` helper functions:
  - returns expected entity for known slug
  - returns `undefined` for invalid slug
- Add one integration-style test (or route-level test) ensuring unknown blog/unit slugs trigger not-found behavior.

**Why this matters:**
- Protects against regressions in static params, internal linking, and route rendering behavior.
