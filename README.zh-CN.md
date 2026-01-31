<div align="center">

# ngImagesPreview

Angular 18+ 的轻量级、现代化且支持无障碍访问的图片预览库，基于 Signals 和原生 CSS 构建。

[![NPM package](https://img.shields.io/npm/v/ng-images-preview.svg?style=flat-square)](https://npmjs.org/package/ng-images-preview)
[![GitHub Release Date](https://img.shields.io/github/release-date/lanxuexing/ng-images-preview.svg?style=flat-square)](https://github.com/lanxuexing/ng-images-preview/releases)
[![GitHub repo size](https://img.shields.io/github/repo-size/lanxuexing/ng-images-preview.svg?style=flat-square)](https://github.com/lanxuexing/ng-images-preview)
[![GitHub Stars](https://img.shields.io/github/stars/lanxuexing/ng-images-preview.svg?style=flat-square)](https://github.com/lanxuexing/ng-images-preview/stargazers)
[![CI/CD](https://github.com/lanxuexing/ng-images-preview/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/lanxuexing/ng-images-preview/actions)
[![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![Signals](https://img.shields.io/badge/Signals-optimized-blue.svg?style=flat-square&logo=dynamic-365&logoColor=white)](https://angular.dev/guide/signals)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[English](./README.md) | 中文

## 🔗 在线演示
查看组件实际效果：**[https://lanxuexing.github.io/ng-images-preview/](https://lanxuexing.github.io/ng-images-preview/)**

</div>

---

## ✨ 特性

- 🚀 **基于 Signals**: 响应式设计，高性能。
- 🎨 **原生 CSS**: 无第三方依赖，可通过 CSS 变量完全定制。
- 🖼️ **多图画廊**: 支持箭头导航或滑动切换图片列表。
- 📱 **移动端就绪**: 支持滑动切换、双击缩放、捏合缩放手势。
- 🖱️ **鼠标手势适配**: PC 端支持鼠标横向滑动切换图片，并支持惯性效果。
- 👆 **下拉关闭**: 向下拖拽即可关闭预览 (类原生体验)。
- 🎞️ **高级转场动画**: 精调 400ms 贝塞尔曲线，带来更丝滑、更具质感的切换体验。
- 🎞️ **缩略图栏**: 支持自动滚动缩略图，快速预览与切换。
- 🧩 **工具栏扩展**: 支持通过模板注入自定义按钮 (如下载)。
- 🤝 **混合支持**: 完美兼容 Standalone 组件和传统的 NgModule 模式。
- ⌨️ **键盘支持**: 方向键导航，ESC 关闭。
- 🔍 **缩放与平移**: 流畅的缩放和平移交互。
- 🔄 **旋转与翻转**: 内置图片操作工具栏。
- 🎨 **自定义模板**: 通过 `ng-template` 完全掌控预览界面。
- ♿ **无障碍支持**: ARIA 标签及焦点管理。
- ⚡ **高性能**: 智能预加载与缓冲算法，画廊切换更流畅。
- 🌏 **SSR 支持**: 完美兼容 Angular Universal/SSR 服务端渲染。
- 🌗 **深色模式支持**: 无缝继承系统偏好或应用样式。

## 📦 安装

本组件作为 Angular Library 发布。

```bash
npm install ng-images-preview
```

## 🚀 快速开始

### ⚠️ 前置条件: 启用动画

本库依赖 Angular Animations。请确保你的应用已启用动画支持。

**Standalone 应用 (app.config.ts):**
```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations()]
};
```

**NgModule 应用 (app.module.ts):**
```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [BrowserAnimationsModule]
})
export class AppModule { }
```

在你的独立组件 (standalone component) 或模块中注册该库。

#### Standalone 模式 (推荐)
```typescript
import { ImagesPreviewDirective } from 'ng-images-preview';

@Component({
  standalone: true,
  imports: [ImagesPreviewDirective, ...]
})
export class MyComponent {}
```

#### NgModule 模式 (传统支持)
```typescript
import { NgImagesPreviewModule } from 'ng-images-preview';

@NgModule({
  imports: [NgImagesPreviewModule, ...]
})
export class AppModule {}
```

### 2. 基本用法

**选项 A: 零配置** (自动检测源)
```html
<!-- 直接在 img 标签上使用 -->
<img src="small.jpg" ngImagesPreview>

<!-- 在容器上使用 (自动查找内部 img) -->
<div ngImagesPreview><img src="small.jpg"></div>
```

**选项 B: 指定高清源**
```html
<img src="small.jpg" [ngImagesPreview]="'huge-original.jpg'">
```

**选项 C: 画廊模式**
传入图片列表到 `previewImages` 以启用画廊导航及自动 **缩略图栏**。
```html
<img 
  src="item1.jpg" 
  [ngImagesPreview]="'item1-highres.jpg'"
  [previewImages]="['item1.jpg', 'item2.jpg', 'item3.jpg']">
```

**选项 D: 工具栏扩展**
使用 `ng-template` 添加自定义按钮 (比如下载按钮)。
```html
<ng-template #myExtraButtons>
  <button class="toolbar-btn" (click)="download()">
    <svg>...</svg>
  </button>
</ng-template>

<img src="pic.jpg" ngImagesPreview [toolbarExtensions]="myExtraButtons">
```

**选项 E: 响应式性能 (Srcsets)**
支持响应式图片，在移动端加载更快的资源。
```html
<img 
  src="thumb.jpg" 
  ngImagesPreview 
  [previewSrcsets]="['image-400w.jpg 400w, image-800w.jpg 800w']">
```

### 3. 自定义模板

通过提供模板完全掌控 UI。

```html
<ng-template #myPreview let-state let-actions="actions">
  <div class="custom-overlay">
    <img [src]="state.src" [style.transform]="'scale(' + state.scale + ') rotate(' + state.rotate + 'deg)'">
    <button (click)="actions.zoomIn()">放大</button>
    <button (click)="actions.close()">关闭</button>
  </div>
</ng-template>

<img src="thumb.jpg" ngImagesPreview="large.jpg" [previewTemplate]="myPreview">
```

## ⚙️ 配置

### 指令输入 (`ImagesPreviewDirective`)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `ngImagesPreview` | `string` | `''` | 高清图片 URL。如果为空，则尝试从宿主或子 `img` 读取 `src`。 |
| `previewImages` | `string[]` | `[]` | 用于画廊导航的图片 URL 列表。 |
| `previewTemplate` | `TemplateRef` | `undefined` | 用于替代默认查看器的自定义模板。 |
| `previewSrcsets` | `string[]` | `[]` | 用于画廊导航的 `srcset` 字符串列表。 |
| `showNavigation` | `boolean` | `true` | 是否显示侧边的上一张/下一张切换按钮。 |
| `showCounter` | `boolean` | `true` | 是否显示图片计数器 (如 "1 / 5")。 |
| `showThumbnails` | `boolean` | `true` | 是否显示缩略图栏。 |
| `showToolbar` | `boolean` | `true` | 是否显示顶部工具栏。 |
| `toolbarExtensions`| `TemplateRef` | `undefined` | 工具栏按钮的自定义模板。 |

### 组件输入 (`ImagesPreviewComponent`)

如果你直接使用该组件：

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **必填** | 要显示的图片源。 |
| `images` | `string[]` | `[]` | 画廊图片列表。 |
| `initialIndex` | `number` | `0` | 画廊初始索引。 |
| `customTemplate` | `TemplateRef` | `undefined` | 覆盖层内容的自定义模板。 |
| `srcsets` | `string[]` | `[]` | 图片的 `srcset` 列表。 |
| `showNavigation` | `boolean` | `true` | 是否显示侧边的上一张/下一张切换按钮。 |
| `showCounter` | `boolean` | `true` | 是否显示图片计数器 (如 "1 / 5")。 |
| `showThumbnails` | `boolean` | `true` | 是否显示缩略图栏。 |
| `showToolbar` | `boolean` | `true` | 是否显示顶部工具栏。 |
| `toolbarExtensions`| `TemplateRef` | `undefined` | 工具栏按钮的自定义模板。 |

### 模板上下文 (用于自定义模板)

使用 `previewTemplate` 时，你可以访问：

#### `state` (状态)
| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| `src` | `string` | 当前图片源。 |
| `scale` | `number` | 当前缩放比例 (最小: 0.5, 最大: 5)。 |
| `rotate` | `number` | 旋转角度。 |
| `flipH` | `boolean` | 水平翻转状态。 |
| `flipV` | `boolean` | 垂直翻转状态。 |
| `isLoading` | `boolean` | 图片是否正在加载。 |
| `hasError` | `boolean` | 图片是否加载失败。 |
| `currentIndex` | `number` | 当前图片在画廊中的索引 (从 0 开始)。 |
| `total` | `number` | 画廊中的图片总数。 |

#### `actions` (操作)
| 方法 | 描述 |
| :--- | :--- |
| `zoomIn()` | 放大。 |
| `zoomOut()` | 缩小。 |
| `rotateLeft()` | 向左旋转 90 度。 |
| `rotateRight()` | 向右旋转 90 度。 |
| `flipHorizontal()` | 水平翻转。 |
| `flipVertical()` | 垂直翻转。 |
| `reset()` | 重置所有变换。 |
| `close()` | 关闭预览。 |
| `next()` | 下一张 (画廊)。 |
| `prev()` | 上一张 (画廊)。 |
| `jumpTo(index)` | 跳转到指定索引 (画廊)。 |

### CSS 变量 (主题定制)

你可以通过在 `styles.css` 或组件样式中覆盖这些 CSS 变量来定制外观：

```css
:root {
  /* 背景与遮罩 */
  --ng-img-background: rgba(0, 0, 0, 0.95);
  --ng-img-text-color: rgba(255, 255, 255, 0.8);
  --ng-img-z-index: 50;
  
  /* 工具栏 */
  --ng-img-toolbar-bg: rgba(255, 255, 255, 0.1);
  --ng-img-toolbar-hover: rgba(255, 255, 255, 0.2);
  --ng-img-gap: 16px;
  
  /* 缩略图 */
  --ng-img-thumb-strip-bg: rgba(0, 0, 0, 0.4);
  --ng-img-thumb-width: 60px;
  --ng-img-thumb-height: 40px;
  --ng-img-thumb-gap: 8px;
  --ng-img-thumb-border-radius: 6px;
  --ng-img-thumb-active-border: white;
  --ng-img-thumb-z-index: 55; /* 默认值为基础 z-index + 5 */
  
  /* 其他 */
  --ng-img-item-bg: rgba(0, 0, 0, 0.3);
}
```



## 🛠 开发

本项目是一个 Angular Workspace。

- **Library 路径**: `projects/ng-images-preview`
- **Demo 路径**: `projects/demo`

### 脚本
- `npm start`: 运行 Demo 应用。
- `npm run build:lib`: 构建生产环境 Library。
- `npm run build:demo`: 构建生产环境 Demo 应用。
- `npm test`: 运行单元测试。
- `npm list`: 运行 Lint 检查。

---

Built with ❤️ for the Angular Community.
