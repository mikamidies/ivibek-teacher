# Ivybek Teacher Platform - AI Agent Instructions

## Project Overview

Nuxt 3 application for mentor/teacher consultancy platform connecting with the Ivybek API (`api.ivybek.com`). Uses Ant Design Vue for UI components, TypeScript, and auto-imports for composables.

## Architecture & Key Patterns

### Authentication Flow

- **Cookie-based auth**: Access token (15min TTL) + refresh token (30 days) stored in cookies via `useCookie()`
- **Composable pattern**: All auth logic centralized in `composables/auth.ts` - use `const { user, login, logout } = useAuth()`
- **Auto-refresh**: `plugins/token-refresh.client.ts` refreshes tokens every 14 minutes automatically
- **Global middleware**: `middleware/auth.global.ts` protects all routes except `/auth/*` pages
- **User initialization**: `plugins/auth-init.client.ts` fetches user profile on mount if token exists
- **401 handling**: `plugins/api.ts` automatically logs out on 401 responses

### API Integration

- Base URL: `https://api.ivybek.com/api/v1/mentor/*`
- Use native `$fetch` for API calls (imported globally by Nuxt)
- All API calls in `composables/auth.ts` include proper error handling with Russian error messages
- Token passed via `Authorization: Bearer ${accessToken.value}` header

### UI & Styling Conventions

- **Ant Design Vue**: Installed via `plugins/antdv.client.ts`, available globally without imports
- **Custom CSS variables** in `assets/css/main.css`:
  - Primary colors: `--blue` (#2b7fff), `--green` (#00c16a)
  - Backgrounds: `--light-blue`, `--light-green` for status badges
  - Text: `--black`, `--light-grey`, `--text-grey`
  - Borders: `--border` (#f3f4f6), `--border-darker`
- **Status badges**: Use `.status` class with color modifiers (`.red`, `.yellow`)
- **Layout**: Fixed 264px sidebar, main content with `margin-left: 264px`
- **Font**: Inter (Google Fonts) with weights 400-700

### Page & Layout Patterns

- **Page metadata**: Use `definePageMeta({ layoutTitle: "Title" })` to set header title
- **Auth pages**: Use `definePageMeta({ layout: "auth" })` for login/register pages
- **Default layout** (`layouts/default.vue`): Sidebar + Header + slot structure
- **Route access**: Header title from `route.meta?.layoutTitle`, rendered in `components/layout/header.vue`

### Component Organization

- `components/layout/`: Sidebar and header navigation
- `components/cards/`: Reusable card components (PersonalCard, MyInfoCard, GeneralCard)
- `PageBanner.vue`: Colored banner with title and icon for page headers

### TypeScript & Auto-imports

- Nuxt auto-imports: `ref`, `computed`, `useState`, `useCookie`, `navigateTo`, `definePageMeta`, etc.
- No manual imports needed for Vue composition API or Nuxt utils
- TypeScript interfaces defined inline in `composables/auth.ts` (User, UserInfo, AuthResponse)

## Development Workflow

### Commands (PowerShell)

```powershell
npm install              # Install dependencies
npm run dev             # Dev server on http://localhost:3000
npm run build           # Production build
npm run preview         # Preview production build
```

### Key Files to Reference

- **Auth logic**: `composables/auth.ts` (login, register, profile update, token refresh)
- **Protected routes**: `middleware/auth.global.ts`
- **Styling base**: `assets/css/main.css`, `assets/css/antd-overrides.css`
- **Config**: `nuxt.config.ts` for modules, fonts, CSS imports

## Code Examples

### Making authenticated API calls

```typescript
const { accessToken } = useAuth();
const data = await $fetch("https://api.ivybek.com/api/v1/mentor/endpoint", {
  headers: { Authorization: `Bearer ${accessToken.value}` },
});
```

### Using Ant Design components

```vue
<a-button type="primary" :loading="loading">Submit</a-button>
<a-input v-model:value="username" placeholder="Username" />
<a-modal v-model:visible="visible" title="Modal Title">...</a-modal>
```

### Page with custom header title

```vue
<script setup>
definePageMeta({ layoutTitle: "Students" });
</script>
```

## Critical Notes

- All user-facing messages in **Russian** (error messages, UI labels)
- User state managed via `useState<User | null>("user")` for SSR compatibility
- Client-only plugins suffix: `.client.ts` (auth, antdv, token refresh)
- Icons via `nuxt-icon` package: `<Icon name="lucide:icon-name" />`
- Images via `@nuxt/image`: `<img src="/images/file.jpg" />` (auto WebP conversion)

## Project-Specific Decisions

- **No separate API service layer**: Direct `$fetch` calls in composables
- **Hardcoded API base**: `https://api.ivybek.com` in `auth.ts` (not env-based)
- **Cookie-first auth**: No localStorage/sessionStorage usage
- **Global middleware**: All routes protected by default, whitelist auth pages
- **Timezone & relationship fields**: Exposed in User schema but not fully implemented in UI
