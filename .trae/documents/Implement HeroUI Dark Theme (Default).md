I will implement a "primarily dark theme option for light" (Dark Mode by default) for the Jewelry app, following the HeroUI v3 design system.

## Plan

### 1. Update Theme Logic
- **Modify `jewelry/src/hooks/useTheme.ts`**:
  - Change the default theme logic to prefer `'dark'` if no `localStorage` value exists (ignoring system preference or defaulting to dark).
  - Ensure the theme is applied to `document.documentElement` correctly.

### 2. Configure Dark Mode Colors
- **Modify `jewelry/tailwind.config.js`**:
  - Add specific semantic color tokens for dark mode support (e.g., `background`, `foreground`, `surface`).
  - Update the `neutral` color palette if necessary to ensure it covers deep dark shades (e.g., `#0A0A0A`).

### 3. Implement Global Dark Styles
- **Modify `jewelry/src/index.css`**:
  - Set default background and text colors for the `body` element using the new dark mode tokens (e.g., `@apply bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-white`).
  - *Correction*: Since the request is "primarily dark", I will make the default styles dark, or ensure the `dark` class is applied by default.

### 4. Update Components for Dark Mode
- **Refactor `Layout.tsx`**:
  - Add a **Theme Toggle Button** (Sun/Moon icon) to the header.
  - Update header and footer backgrounds to support dark mode (e.g., `bg-white dark:bg-neutral-900`).
  - Update text colors to be readable in dark mode (`text-neutral-900` -> `dark:text-white`).
- **Refactor `Button.tsx`**:
  - Update `secondary` and `ghost` variants to look good on dark backgrounds (adjust hover states and text colors).
- **Refactor `Input.tsx`**:
  - Update input backgrounds and borders for dark mode (`bg-white` -> `dark:bg-neutral-800`, `border-neutral-200` -> `dark:border-neutral-700`).

### 5. Verification
- Start the dev server and verify:
  - The app loads in **Dark Mode** by default for a new user.
  - The UI elements (Header, Footer, Inputs, Buttons) look correct in dark mode (contrast, visibility).
  - Toggling the theme switches to Light Mode and back correctly.
