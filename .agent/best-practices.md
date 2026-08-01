You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- **JSDoc**: All public APIs, Interfaces, Inputs, and Outputs MUST have JSDoc comments explaining their purpose, parameters, and return values.

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Project Structure & Naming
- **Files**: `kebab-case` (e.g., `user-profile.component.ts`).
- **Classes**: `PascalCase` (e.g., `UserProfileComponent`).
- **Selectors**: `kebab-case` with prefix (e.g., `ng-images-preview`).

## Library Specific Patterns
- **Signal Inputs**: Use `input()` and `input.required()` where possible. Avoid `@Input()`.
- **Hybrid Support**: When adding new standalone components/directives, ensure they are exported in `NgImagesPreviewModule`.
- **Performance**: Use `computed` for all derived UI state. Use `effect` only for side effects (like preloading).
- **SSR Safety**: Always inject `PLATFORM_ID` and use `isPlatformBrowser(platformId)` before accessing `window` or `document`.
- **Vanilla CSS**: Prefer CSS variables (`--var`) over inline styles for library theming.
- **Dependency Injection**: Use `inject()` for all dependency injection. Avoid constructor injection.
- **Host Bindings**: Use the `host` property in `@Component` or `@Directive` metadata instead of `@HostListener` or `@HostBinding` decorators.

## Apple Design & Performance Guidelines
See full specification in [.agent/apple-design.md](file:///Users/apple/Documents/Project/ng-images-preview/.agent/apple-design.md).
- **Latency Elimination**: Instant press feedback on `:active` (`transform: scale(0.97)`).
- **Fluid Motion**: Use Apple spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`) and interruptible transitions.
- **Visual Style**: SF Pro typography stack, Bento Grid structures, lightweight glassmorphism (`backdrop-filter: blur(16px)`).
- **Hardware Thermal Efficiency**: Restrict animations strictly to GPU compositor properties (`transform` & `opacity` only) to avoid CPU/GPU overheating.
