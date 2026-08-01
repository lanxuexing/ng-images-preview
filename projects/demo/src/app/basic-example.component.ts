import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesPreviewDirective, ToolbarConfig, ImagesPreviewService, ImagesGalleryComponent } from 'ng-images-preview';

@Component({
  selector: 'app-basic-example',
  standalone: true,
  imports: [CommonModule, ImagesPreviewDirective, ImagesGalleryComponent],
  template: `
    <div class="space-y-12 animate-in fade-in duration-500">
      
      <!-- Apple Hero Banner -->
      <section class="text-center py-10 md:py-16 max-w-3xl mx-auto space-y-6">
        <div class="inline-flex items-center gap-2 apple-badge">
          <span>Angular 18 · 19 · 20 · 21 · 22+</span>
          <span class="w-1 h-1 rounded-full bg-current"></span>
          <span>Zero Dependency</span>
        </div>

        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white leading-tight">
          Native Gestures.<br class="hidden sm:inline" /> Fluid Experience.
        </h1>

        <p class="text-base md:text-xl text-[#86868b] dark:text-[#a1a1a6] font-normal leading-relaxed max-w-2xl mx-auto">
          High-performance Image Preview & Gallery for Angular 18+. Features mobile pinch-to-zoom, pull-to-close momentum, auto-thumbnails & smart preloading.
        </p>

        <div class="flex items-center justify-center gap-4 pt-2">
          <button (click)="openServicePreview()"
                  class="apple-press bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 rounded-full font-medium text-sm shadow-md transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Launch via Service API
          </button>
          
          <a href="https://github.com/lanxuexing/ng-images-preview"
             target="_blank"
             class="apple-press bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white px-6 py-3 rounded-full font-medium text-sm transition-all border border-black/5 dark:border-white/10">
            View Docs
          </a>
        </div>
      </section>

      <!-- Apple Bento Grid Showcase -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Bento Card 1: Touch Gestures -->
        <div class="apple-card p-6 md:p-8 flex flex-col justify-between md:col-span-2 relative overflow-hidden">
          <div class="space-y-3 z-10">
            <span class="apple-badge">Mobile Ready</span>
            <h3 class="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Pinch-to-Zoom & Pull-to-Close</h3>
            <p class="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed max-w-md">
              Native-like touch interactions with velocity history tracking, interactive inertia spring momentum, and double-tap zoom.
            </p>
          </div>
          <div class="pt-6 flex gap-3 text-xs font-semibold text-[#0071e3] dark:text-[#0a84ff]">
            <span>✨ Double Tap</span> · <span>🤌 Pinch Scale</span> · <span>👇 Drag to Dismiss</span>
          </div>
        </div>

        <!-- Bento Card 2: Angular Version Compatibility -->
        <div class="apple-card p-6 md:p-8 flex flex-col justify-between">
          <div class="space-y-3">
            <span class="apple-badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Compatibility</span>
            <h3 class="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Angular 18 – 22+</h3>
            <p class="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
              Full compatibility across Angular 18, 19, 20, 21 and Angular 22+ with APF partial compilation.
            </p>
          </div>
          <div class="pt-4 flex flex-wrap gap-1.5 text-[11px] font-mono font-semibold">
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">v18</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">v19</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">v20</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">v21</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">v22+</span>
          </div>
        </div>
      </section>

      <!-- Interactive Gallery Grid -->
      <section class="apple-card p-6 md:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
          <div>
            <h2 class="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Interactive Gallery Showcase</h2>
            <p class="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Click any card below to launch the overlay preview.</p>
          </div>
          <button (click)="openServicePreview()"
                  class="apple-press text-xs font-medium text-[#0071e3] dark:text-[#0a84ff] bg-[#0071e3]/10 dark:bg-[#0a84ff]/15 px-3 py-1.5 rounded-full hover:bg-[#0071e3]/20 transition-colors">
            Open Full Gallery
          </button>
        </div>

        <!-- Grid Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Card 1: Gallery Mode -->
          <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer apple-card apple-press"
               [ngImagesPreview]="imageList[0]"
               [previewImages]="imageList">
            <img [src]="imageList[0]" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Nature" />
            <div class="absolute top-3 left-3">
              <span class="apple-badge bg-black/60 text-white border-none backdrop-blur-md">Gallery</span>
            </div>
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span class="bg-white/90 text-[#1d1d1f] px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md">View Gallery</span>
            </div>
          </div>

          <!-- Card 2: High Res -->
          <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer apple-card apple-press"
               [ngImagesPreview]="imageList[1]">
            <img [src]="imageList[1]" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Waterfall" />
            <div class="absolute top-3 left-3">
              <span class="apple-badge bg-black/60 text-white border-none backdrop-blur-md">High Res</span>
            </div>
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span class="bg-white/90 text-[#1d1d1f] px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md">Zoom View</span>
            </div>
          </div>

          <!-- Card 3: Zero Config -->
          <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer apple-card apple-press"
               ngImagesPreview>
            <img [src]="imageList[2]" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Mountain" />
            <div class="absolute top-3 left-3">
              <span class="apple-badge bg-emerald-500/80 text-white border-none backdrop-blur-md">Zero Config</span>
            </div>
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span class="bg-white/90 text-[#1d1d1f] px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md">Quick View</span>
            </div>
          </div>

          <!-- Card 4: Minimal Toolbar -->
          <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer apple-card apple-press"
               ngImagesPreview
               [toolbarConfig]="minToolbarConfig">
            <img [src]="imageList[3]" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Architecture" />
            <div class="absolute top-3 left-3">
              <span class="apple-badge bg-purple-500/80 text-white border-none backdrop-blur-md">Minimal Toolbar</span>
            </div>
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span class="bg-white/90 text-[#1d1d1f] px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md">View Image</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Prebuilt Gallery Grid Component -->
      <section class="apple-card p-6 md:p-8 space-y-6">
        <div class="border-b border-black/5 dark:border-white/10 pb-6">
          <span class="apple-badge mb-2">Component</span>
          <h2 class="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">ImagesGalleryComponent</h2>
          <p class="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Ready-to-use grid layout component with built-in preview handlers.</p>
        </div>
        <ng-images-gallery [images]="largeImageList" [columns]="4" gap="16px" [aspectRatio]="'4/3'"></ng-images-gallery>
      </section>

      <!-- Code Snippet -->
      <section class="apple-card p-6 md:p-8 space-y-4">
        <h3 class="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Quick Setup Code</h3>
        <pre><code><span class="hl-kw">import</span> {{ '{' }} <span class="hl-title">ImagesPreviewDirective</span> {{ '}' }} <span class="hl-kw">from</span> <span class="hl-str">'ng-images-preview'</span>;

<span class="hl-dec">&#64;Component</span>({{ '{' }}
  <span class="hl-attr">standalone</span>: <span class="hl-kw">true</span>,
  <span class="hl-attr">imports</span>: [<span class="hl-title">ImagesPreviewDirective</span>],
  <span class="hl-attr">template</span>: <span class="hl-str">\`&lt;<span class="hl-tag">img</span> <span class="hl-attr">[src]</span>="imgUrl" <span class="hl-attr">[ngImagesPreview]</span>="highResUrl" /&gt;\`</span>
{{ '}' }})
<span class="hl-kw">export</span> <span class="hl-kw">class</span> <span class="hl-title">AppComponent</span> {{ '{' }} {{ '}' }}</code></pre>
      </section>
    </div>
  `,
})
export class BasicExampleComponent {
  imageList = [
    'https://picsum.photos/id/10/2500/1667',
    'https://picsum.photos/id/1015/2500/1667',
    'https://picsum.photos/id/20/3670/2462',
    'https://picsum.photos/id/25/5000/3333',
    'https://picsum.photos/id/28/4928/3264',
  ];

  largeImageList = Array.from({ length: 8 }, (_, i) => `https://picsum.photos/id/${60 + i}/1200/800`);

  minToolbarConfig: ToolbarConfig = {
    showRotate: false,
    showFlip: false,
    showZoom: true
  };

  private previewService = inject(ImagesPreviewService);

  openServicePreview() {
    this.previewService.open(this.imageList[0], {
      images: this.imageList,
      initialIndex: 0,
      showThumbnails: true,
      showToolbar: true
    });
  }
}
