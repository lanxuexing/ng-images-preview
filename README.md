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
Check out the component in action: **[https://lanxuexing.github.io/ng-images-preview/](https://lanxuexing.github.io/ng-images-preview/)** (After deployment)

</div>

---

## ✨ Features

- 🚀 **Signals-Based**: High performance and reactive by design.
- 🎨 **Vanilla CSS**: Zero dependencies, fully customizable via CSS variables.
- 🖼️ **Multi-Image Gallery**: Navigate through a list of images with arrows or swipe gestures.
- 📱 **Mobile Ready**: Swipe to navigate, double-tap to zoom, pinch-to-zoom gestures.
- ⌨️ **Keyboard Support**: Arrow keys to navigate, ESC to close.
- 🔍 **Zoom & Pan**: Smooth zooming and panning interactions.
- 🔄 **Rotate & Flip**: Built-in toolbar for image manipulation.
- 🧩 **Custom Template**: Complete control over the preview UI via `ng-template`.
- ♿ **Accessible**: ARIA labels and focus management.
- 🌗 **Dark Mode Ready**: Inherits system preferences or app styles seamlessly.

## 📦 Installation

This component is available as an Angular Library.

```bash
npm install ng-images-preview
```

## 🚀 Quick Start

### 1. Import Directive

Register `ImagesPreviewDirective` in your standalone component or module.

```typescript
import { ImagesPreviewDirective } from 'ng-images-preview';

@Component({
  standalone: true,
  imports: [ImagesPreviewDirective, ...]
})
export class MyComponent {}
```

### 2. Basic Usage

**Option A: Zero Config** (Auto-detects source)
```html
<!-- Direct usage on an img tag -->
<img src="small.jpg" ngImagesPreview>

<!-- Usage on a container (finds inner img) -->
<div ngImagesPreview><img src="small.jpg"></div>
```

**Option B: Separate High-Res Source**
```html
<img src="small.jpg" [ngImagesPreview]="'huge-original.jpg'">
```

**Option C: Gallery Mode**
Pass a list of images to `previewImages` to enable gallery navigation (arrows, swipe).
```html
<img 
  src="item1.jpg" 
  [ngImagesPreview]="'item1-highres.jpg'"
  [previewImages]="['item1-highres.jpg', 'item2-highres.jpg', 'item3-highres.jpg']">
```

### 3. Custom Template

Take full control of the UI by providing a template.

```html
<ng-template #myPreview let-state let-actions="actions">
  <div class="custom-overlay">
    <img [src]="state.src" [style.transform]="'scale(' + state.scale + ') rotate(' + state.rotate + 'deg)'">
    <button (click)="actions.zoomIn()">Zoom +</button>
    <button (click)="actions.close()">Close</button>
  </div>
</ng-template>

<img src="thumb.jpg" ngImagesPreview="large.jpg" [previewTemplate]="myPreview">
```

## ⚙️ Configuration

### Directive Inputs (`ImagesPreviewDirective`)

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ngImagesPreview` | `string` | `''` | High-res URL. If empty, tries to read `src` from host or child `img`. |
| `previewImages` | `string[]` | `[]` | List of image URLs for gallery navigation. |
| `previewTemplate` | `TemplateRef` | `undefined` | Custom template to render instead of the default viewer. |

### Component Inputs (`ImagesPreviewComponent`)

If you use the component directly:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **Required** | The image source to display. |
| `images` | `string[]` | `[]` | List of images for gallery. |
| `initialIndex` | `number` | `0` | Initial image index in gallery. |
| `customTemplate` | `TemplateRef` | `undefined` | Custom template for the overlay content. |

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
