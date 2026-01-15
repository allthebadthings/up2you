## Problem
The selected `span` element (quantity display) and the surrounding Product Page have hardcoded light-mode colors (e.g., `border-gray-300`, `text-gray-900`). This causes visibility issues in dark mode, such as invisible borders or dark text on dark backgrounds.

## Proposed Fixes
I will update `jewelry/src/pages/Product.tsx` to include dark mode classes (`dark:...`) for:

1.  **Quantity Selector (Selected Element):**
    *   Update borders: `border-gray-300` → `dark:border-neutral-600`.
    *   Update text: Ensure numbers are white in dark mode.
    *   Update buttons: Fix hover states (`dark:hover:bg-neutral-700`).

2.  **Page Container & Typography:**
    *   Background: `bg-gray-50` → `dark:bg-neutral-900`.
    *   Headings: `text-gray-900` → `dark:text-white`.
    *   Body text: `text-gray-600/700` → `dark:text-neutral-300/400`.

3.  **Components:**
    *   **Image Gallery:** Fix thumbnail borders.
    *   **Action Buttons (Heart/Share):** Fix borders and hover backgrounds.
    *   **Bundle Details:** Update background to `dark:bg-neutral-800`.

This will ensure the Product Page looks correct and consistent with the dark theme fixes applied to the Cart page.
