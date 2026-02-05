<div align="center">

# ngImagesPreview

A lightweight, modern, and accessible Image Preview library for Angular 18+, built with Signals and Vanilla CSS.

[![NPM package](https://img.shields.io/npm/v/ng-images-preview.svg?style=flat-square)](https://npmjs.org/package/ng-images-preview)
[![GitHub Release Date](https://img.shields.io/github/release-date/lanxuexing/ng-images-preview.svg?style=flat-square)](https://github.com/lanxuexing/ng-images-preview/releases)
[![GitHub repo size](https://img.shields.io/github/repo-size/lanxuexing/ng-images-preview.svg?style=flat-square)](https://github.com/lanxuexing/ng-images-preview)
[![GitHub Stars](https://img.shields.io/github/stars/lanxuexing/ng-images-preview.svg?style=flat-square)](https://github.com/lanxuexing/ng-images-preview/stargazers)
[![CI/CD](https://github.com/lanxuexing/ng-images-preview/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/lanxuexing/ng-images-preview/actions)
[![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![Signals](https://img.shields.io/badge/Signals-optimized-blue.svg?style=flat-square&logo=dynamic-365&logoColor=white)](https://angular.dev/guide/signals)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[中文版](./README.zh-CN.md) | English

## 🔗 Live Demo
Check out the component in action: **[https://lanxuexing.github.io/ng-images-preview/](https://lanxuexing.github.io/ng-images-preview/)**

</div>

---

## ✨ Features

- 🚀 **Signals-Based**: High performance and reactive by design.
- 🎨 **Vanilla CSS**: Zero dependencies, fully customizable via CSS variables.
- � **Service API**: Open previews programmatically via `ImagesPreviewService` without touching templates.
- 🧱 **Gallery Component**: Ready-to-use `<ng-images-gallery>` grid component.
- 🧩 **Mixed Content**: Support for mixing Images and `TemplateRef` (Videos, PDFs) in the same gallery.
- �🖼️ **Multi-Image Gallery**: Navigate through a list of images with arrows or swipe gestures.
- 📱 **Mobile Ready**: Swipe to navigate, double-tap to zoom, pinch-to-zoom gestures.
- 🖱️ **PC Friendly**: Mouse horizontal swipe navigation with inertia.
- 👆 **Pull-to-Close**: Drag down to close the preview (like native apps).
- 🎞️ **Premium Transitions**: Refined 400ms cubic-bezier easing for a high-end feel.
- 🎞️ **Thumbnail Strip**: Quick preview and navigation with an auto-scrolling strip.
- 🧩 **Toolbar Extensions**: Inject custom buttons (like Download) into the toolbar.
- 🤝 **Hybrid Support**: Fully compatible with both Standalone and NgModule-based apps.
- ⌨️ **Keyboard Support**: Arrow keys to navigate, ESC to close.
- 🔍 **Zoom & Pan**: Smooth zooming and panning interactions.
- 🔄 **Rotate & Flip**: Built-in toolbar for image manipulation.
- 🎨 **Custom Template**: Complete control over the preview UI via `ng-template`.
- ♿ **Accessible**: ARIA labels and focus management.
- ⚡ **Performance**: Smart image preloading and buffering for smoother navigation.
- 🌏 **SSR Safe**: Fully compatible with Angular Universal/SSR.
- 🌗 **Dark Mode Ready**: Inherits system preferences or app styles seamlessly.

## 📦 Installation

This component is available as an Angular Library.

```bash
npm install ng-images-preview
```

## 🚀 Quick Start

### ⚠️ Prerequisite: Enable Animations

This library relies on Angular animations. You must enable them in your application.

**Standalone (app.config.ts):**
```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations()]
};
```

**NgModule (app.module.ts):**
```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [BrowserAnimationsModule]
})
export class AppModule { }
```

Register the library in your standalone component or module.

#### Standalone (Recommended)
```typescript
import { ImagesPreviewDirective } from 'ng-images-preview';

@Component({
  standalone: true,
  imports: [ImagesPreviewDirective, ...]
})
export class MyComponent {}
```

#### NgModule (Legacy Support)
```typescript
import { NgImagesPreviewModule } from 'ng-images-preview';

@NgModule({
  imports: [NgImagesPreviewModule, ...]
})
export class AppModule {}
```

### 2. Cookbook / Usage Examples

#### A. Service-Based API (Programmatic)
Ideal for buttons, dynamic actions, or when you don't want to pollute your template with directives.

```typescript
import { Component, inject } from '@angular/core';
import { ImagesPreviewService } from 'ng-images-preview';

@Component({ ... })
export class MyComponent {
  private previewService = inject(ImagesPreviewService);

  openGallery() {
    this.previewService.open('first.jpg', {
      images: ['first.jpg', 'second.jpg', 'third.jpg'], // Array of images
      initialIndex: 0, // Start at index 0
      showThumbnails: true
    });
  }
}
```

#### B. The Gallery Component (`<ng-images-gallery>`)
A ready-to-use responsive grid that handles the layout and click events for you.

```typescript
import { ImagesGalleryComponent } from 'ng-images-preview';

@Component({
  imports: [ImagesGalleryComponent],
  template: `
    <ng-images-gallery 
      [images]="['img1.jpg', 'img2.jpg', 'img3.jpg']" 
      [columns]="3" 
      gap="10px">
    </ng-images-gallery>
  `
})
class MyComponent {}
```

#### C. Directive (The "classic" way)
Attach the preview behavior to any existing image or element.

```html
<!-- Simple Single Image -->
<img src="small.jpg" ngImagesPreview>

<!-- Separate High-Res Source -->
<img src="small.jpg" [ngImagesPreview]="'huge-original.jpg'">

<!-- Gallery Mode on an Image -->
<img 
  src="thumb.jpg" 
  [ngImagesPreview]="'full.jpg'"
  [previewImages]="['full.jpg', 'other.jpg']">
```

#### D. Mixed Content (Images + Templates)
You can mix images with custom templates (like Video players) in the same gallery slide.

```typescript
// In your component
@ViewChild('videoTpl') videoTpl: TemplateRef<any>;

openMixedGallery() {
  this.service.open('img1.jpg', {
    images: [
      'img1.jpg',
      this.videoTpl, // Use a TemplateRef here!
      'img3.jpg'
    ]
  });
}
```

### 3. Custom Template (Complete UI Override)
Take full control of the preview overlay UI.

```html
<ng-template #myPreview let-state let-actions="actions">
  <div class="custom-overlay">
    <!-- Render content based on state -->
    <ng-container *ngIf="isTemplate(state.src)">
        <ng-container *ngTemplateOutlet="state.src"></ng-container>
    </ng-container>
    <img *ngIf="!isTemplate(state.src)" [src]="state.src">
    
    <button (click)="actions.zoomIn()">Zoom +</button>
    <button (click)="actions.close()">Close</button>
  </div>
</ng-template>

<img src="thumb.jpg" ngImagesPreview [previewTemplate]="myPreview">
```

## 🌏 Server-Side Rendering (SSR)

This library is fully compatible with **Angular Universal** and **SSR** (Server-Side Rendering).

-   **Safe DOM Access**: All access to `window`, `document`, and `body` is guarded by `isPlatformBrowser` checks.
-   **No Hydration Mismatches**: The internal structure remains consistent between server and client.
-   **Performance**: The `ImagesGalleryComponent` uses `NgOptimizedImage` for LCP-friendly image loading.

## ⚙️ Configuration

### Directive Inputs (`ImagesPreviewDirective`)

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ngImagesPreview` | `string` | `''` | High-res URL. If empty, tries to read `src` from host or child `img`. |
| `previewImages` | `string[]` | `[]` | List of image URLs for gallery navigation. |
| `previewTemplate` | `TemplateRef` | `undefined` | Custom template to render instead of the default viewer. |
| `previewSrcsets` | `string[]` | `[]` | List of `srcset` strings for gallery navigation. |
| `showNavigation` | `boolean` | `true` | Whether to show next/prev arrow buttons. |
| `showCounter` | `boolean` | `true` | Whether to show the image counter (e.g. "1 / 5"). |
| `showThumbnails` | `boolean` | `true` | Whether to show the thumbnail strip. |
| `showToolbar` | `boolean` | `true` | Whether to show the top toolbar. |
| `toolbarExtensions`| `TemplateRef` | `undefined` | Custom template for toolbar buttons. |

### Component Inputs (`ImagesPreviewComponent`)

If you use the component directly:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **Required** | The image source to display. |
| `images` | `string[]` | `[]` | List of images for gallery. |
| `initialIndex` | `number` | `0` | Initial image index in gallery. |
| `customTemplate` | `TemplateRef` | `undefined` | Custom template for the overlay content. |
| `srcsets` | `string[]` | `[]` | List of `srcset` strings for images. |
| `showNavigation` | `boolean` | `true` | Whether to show next/prev arrow buttons. |
| `showCounter` | `boolean` | `true` | Whether to show the image counter (e.g. "1 / 5"). |
| `showThumbnails` | `boolean` | `true` | Whether to show the thumbnail strip. |
| `showToolbar` | `boolean` | `true` | Whether to show the top toolbar. |
| `toolbarExtensions`| `TemplateRef` | `undefined` | Custom template for toolbar buttons. |

### Template Context (for Custom Templates)

When using `previewTemplate`, you get access to:

#### `state`
| Property | Type | Description |
| :--- | :--- | :--- |
| `src` | `string` | Current image source. |
| `scale` | `number` | Current zoom level (min: 0.5, max: 5). |
| `rotate` | `number` | Rotation angle in degrees. |
| `flipH` | `boolean` | Horizontal flip state. |
| `flipV` | `boolean` | Vertical flip state. |
| `isLoading` | `boolean` | True if image is loading. |
| `hasError` | `boolean` | True if image failed to load. |
| `currentIndex` | `number` | Current index in gallery (0-based). |
| `total` | `number` | Total number of images in gallery. |

#### `actions`
| Method | Description |
| :--- | :--- |
| `zoomIn()` | Increase zoom level. |
| `zoomOut()` | Decrease zoom level. |
| `rotateLeft()` | Rotate -90 degrees. |
| `rotateRight()` | Rotate +90 degrees. |
| `flipHorizontal()` | Flip horizontally. |
| `flipVertical()` | Flip vertically. |
| `reset()` | Reset all transformations. |
| `close()` | Close the preview. |
| `next()` | Go to next image (if gallery). |
| `prev()` | Go to previous image (if gallery). |
| `jumpTo(index)` | Jump to a specific index in gallery. |

### CSS Variables (Theming)

You can customize the look and feel by overriding these CSS variables in your `styles.css` or component styles:

```css
:root {
  /* Overlay */
  --ng-img-background: rgba(0, 0, 0, 0.95);
  --ng-img-text-color: rgba(255, 255, 255, 0.8);
  --ng-img-z-index: 50;
  
  /* Toolbar */
  --ng-img-toolbar-bg: rgba(255, 255, 255, 0.1);
  --ng-img-toolbar-hover: rgba(255, 255, 255, 0.2);
  --ng-img-gap: 16px;
  
  /* Thumbnails */
  --ng-img-thumb-strip-bg: rgba(0, 0, 0, 0.4);
  --ng-img-thumb-width: 60px;
  --ng-img-thumb-height: 40px;
  --ng-img-thumb-gap: 8px;
  --ng-img-thumb-border-radius: 6px;
  --ng-img-thumb-active-border: white;
  --ng-img-thumb-z-index: 55; /* Default is base + 5 */
  
  /* Misc */
  --ng-img-item-bg: rgba(0, 0, 0, 0.3);
}
```



## 🛠 Development

This repository is structured as an Angular Workspace.

- **Library Path**: `projects/ng-images-preview`
- **Demo Path**: `projects/demo`

### Scripts
- `npm start`: Run the demo application.
- `npm run build:lib`: Build the library for production.
- `npm run build:demo`: Build the demo application.
- `npm test`: Run unit tests.
- `npm list`: Run linting.

---

Built with ❤️ for the Angular Community.
