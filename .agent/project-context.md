# Project Context: ng-images-preview

## Overview
A lightweight, modern Angular 18+ Image Preview library built with High Performance Signals and Vanilla CSS.
It currently supports single image preview, multi-image gallery navigation, swipe gestures, zoom/pan/rotate, and completely custom templates.

## Architecture
- **Library Root**: `projects/ng-images-preview`
- **Demo Root**: `projects/demo`
- **Tech Stack**: Angular 18+, Signals, Vanilla CSS (No external UI dependencies).

## Core Components
### 1. `ImagePreviewDirective`
- **Selector**: `[ngImagesPreview]`
- **Input**: `[ngImagesPreview]` (High-res URL), `[previewImages]` (Gallery list)
- **Role**: Detects clicks, finds image source (auto-detects if empty), creates and attaches the overlay component dynamically.

### 2. `ImagePreviewComponent`
- **Selector**: `ng-images-preview`
- **Inputs**: `src`, `images`, `initialIndex`
- **Role**: Renders the overlay, handles gestures (Touch/Mouse), manages state (Zoom, Rotate, Index) using Signals.

## Key Features
- **Zero Config**: Helper directive auto-detects `src` from `<img>` tags.
- **Gallery Mode**: Pass `[previewImages]` to enable swiping and arrow navigation.
- **Mobile Optimized**: Inertia scrolling, rubber-banding, pinch-zoom, swipe-to-change.
- **Customizable**: Styling via CSS variables, UI via `ng-template`.

## Recent Changes (As of Jan 2026)
1.  **Renaming**: Selectors renamed from `app*` to `ng*` (`ngImagesPreview`, `ng-images-preview`) to align with Angular library standards.
2.  **UI Revamp**: Demo and Default UI updated with "Premium" aesthetics (Glassmorphism, deep shadows).
3.  **Refactor**: Removed `Renderer2` in favor of native DOM for performance; Optimized touch history buffer.
4.  **Fixes**: Fixed click interception by moving directive to container; Enabled swiping at 1x zoom.

## Development Guidelines
- **Run Demo**: `npm start`
- **Build Lib**: `npm run build:lib`
- **Formatting**: Uses Prettier (no auto-run on save, run manually).
- **State**: Prefer `signal`, `computed`, and `effect` over `BehaviorSubject`.
