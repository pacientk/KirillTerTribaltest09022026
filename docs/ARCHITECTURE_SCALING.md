# Architecture Scaling Recommendations

## 1. Specific Improvements

### 1.1 File Structure

```
src/
├── @shared/
│   ├── ui/           # Button, Input, Modal, Card
│   ├── hooks/        # useDebounce, useLocalStorage
│   ├── lib/          # Utilities, constants
│   └── api/          # HTTP client, interceptors
├── @features/
│   ├── chat/         # Chat business logic
│   ├── preview/      # Preview logic
│   └── file-upload/  # File upload handling
├── @widgets/         # Composite UI blocks (scale L)
└── @pages/           # Application pages
```

**Benefits:**
- Clear separation of shared/feature code
- Easy dependency tracking
- Simplified code review

### 1.2 State Management

| State Type | Tool | When to Use |
|------------|------|-------------|
| Local | useState | Single component state |
| Server | React Query | API caching, synchronization |
| Global UI | Zustand | Themes, modals, toasts |
| Forms | React Hook Form | Validation, complex forms |

### 1.3 Styling (Scale L+)

**Current:** Tailwind CSS — excellent for rapid development.

**When scaling, add:**

1. **Design Tokens** (CSS variables)
```css
:root {
  --color-primary: #3b82f6;
  --spacing-md: 1rem;
  --radius-lg: 0.75rem;
}
```

2. **styled-components** for dynamic themes
```typescript
const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  background: ${p => p.$variant === 'primary'
    ? p.theme.colors.primary
    : p.theme.colors.secondary};
`;
```

**When to switch to styled-components:**
- Dynamic themes needed (light/dark + custom)
- Many conditional styles based on props
- SSR with critical CSS required

### 1.4 API Layer

**Current:** Direct calls in `mockApi.ts`

**Recommendation:** Abstract through services

```typescript
// @shared/api/client.ts
export const apiClient = {
  generate: (prompt: string) => http.post<GenerateResponse>('/generate', { prompt }),
  history: () => http.get<Message[]>('/history'),
};

// Type generation from OpenAPI
// npx openapi-typescript api.yaml -o src/@shared/api/types.ts
```

---

## 2. Implementation Priority

1. **Immediate (low risk):**
   - Create `@shared/ui/` for reusable components
   - Enable TypeScript strict mode

2. **When growing to 20+ components:**
   - React Query for API
   - Feature-based folder structure

3. **When team grows to 5+ people:**
   - Feature Sliced Design
   - Zustand for global state
   - Storybook for UI components

4. **At 100+ components:**
   - Monorepo (Turborepo/Nx)
   - Design system as a separate package
