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
- ⌨️ **键盘支持**: 方向键导航，ESC 关闭。
- 🔍 **缩放与平移**: 流畅的缩放和平移交互。
- 🔄 **旋转与翻转**: 内置图片操作工具栏。
- 🧩 **自定义模板**: 通过 `ng-template` 完全掌控预览界面。
- ♿ **无障碍支持**: ARIA 标签及焦点管理。
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

### 1. 导入 Directive

在你的独立组件 (standalone component) 或模块中注册 `ImagesPreviewDirective`。

```typescript
import { ImagesPreviewDirective } from 'ng-images-preview';

@Component({
  standalone: true,
  imports: [ImagesPreviewDirective, ...]
})
export class MyComponent {}
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
传入图片列表到 `previewImages` 以启用画廊导航 (箭头、滑动)。
```html
<img 
  src="item1.jpg" 
  [ngImagesPreview]="'item1-highres.jpg'"
  [previewImages]="['item1-highres.jpg', 'item2-highres.jpg', 'item3-highres.jpg']">
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

### 组件输入 (`ImagesPreviewComponent`)

如果你直接使用该组件：

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **必填** | 要显示的图片源。 |
| `images` | `string[]` | `[]` | 画廊图片列表。 |
| `initialIndex` | `number` | `0` | 画廊初始索引。 |
| `customTemplate` | `TemplateRef` | `undefined` | 覆盖层内容的自定义模板。 |

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
