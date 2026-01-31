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
- **Gallery Mode**: Pass `[previewImages]` to enable swiping, arrow navigation, and a **Thumbnail Strip**.
- **Mobile Optimized**: Inertia scrolling, rubber-banding, pinch-zoom, swipe-to-change, and **Pull-to-Close**.
- **Customizable**: Styling via CSS variables, UI via `ng-template`, and **Toolbar Extensions**.
- **Performance**: Smart **Buffer Preloading** (-1, 0, +1) for instant gallery navigation.
- **Hybrid Support**: Support for both Standalone and **NgModule** applications.

## Recent Changes (v2.0+)
1.  **Architecture**: Rebuilt core with **Signals** and `computed` state for high-performance reactivity.
2.  **Gallery Revamp**: Added auto-scrolling **Thumbnail Strip** and CSS-buffered **Slide Transitions**.
3.  **Gestures**: Implemented multi-touch **Pinch-to-Zoom** and drag-to-dismiss **Pull-to-Close**.
4.  **Extensibility**: Added `toolbarExtensions` to allow custom buttons (e.g., Download) in the toolbar.
5.  **Hybrid Compatibility**: Created `NgImagesPreviewModule` to support legacy Angular applications.
6.  **SSR**: Ensure all browser globals are guarded with `isPlatformBrowser`.

## Development Guidelines
- **Run Demo**: `npm start`
- **Build Lib**: `npm run build:lib`
- **Formatting**: Uses Prettier (no auto-run on save, run manually).
- **State**: Prefer `signal`, `computed`, and `effect` over `BehaviorSubject`.
