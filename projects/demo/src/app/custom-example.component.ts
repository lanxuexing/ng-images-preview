import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesPreviewDirective } from 'ng-images-preview';

@Component({
  selector: 'app-custom-example',
  standalone: true,
  imports: [CommonModule, ImagesPreviewDirective],
  template: `
    <div class="space-y-10 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <!-- Apple Section Header -->
      <header class="space-y-3">
        <div class="inline-flex items-center gap-2 apple-badge">
          <span>Template API</span>
          <span class="w-1 h-1 rounded-full bg-current"></span>
          <span>Full UI Control</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold text-[#1d1d1f] dark:text-white tracking-tight">
          Custom Template Integration
        </h1>
        <p class="text-base md:text-lg text-[#86868b] dark:text-[#a1a1a6] leading-relaxed max-w-2xl">
          Take total control over the overlay rendering by supplying a custom <code class="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-xs text-[#0071e3] dark:text-[#0a84ff]">ng-template</code> context.
        </p>
      </header>

      <!-- Interactive Preview Card -->
      <section class="apple-card p-6 md:p-10 space-y-8">
        <div class="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-6">
          <div>
            <h3 class="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Bespoke Overlay Demo</h3>
            <p class="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Click the card below to trigger your customized overlay.</p>
          </div>
          <span class="apple-badge">Interactive</span>
        </div>

        <div class="flex justify-center">
          <div class="group relative max-w-md rounded-2xl overflow-hidden cursor-pointer apple-card apple-press border border-black/5 dark:border-white/10"
               ngImagesPreview="https://picsum.photos/id/25/5000/3333"
               [previewTemplate]="myCustomPreview">
            <div class="relative overflow-hidden aspect-[4/3]">
              <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                   src="https://picsum.photos/id/25/800/600"
                   alt="iPod" />
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span class="bg-white/90 text-[#1d1d1f] px-5 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md">
                  Launch Bespoke UI
                </span>
              </div>
            </div>

            <div class="p-6 space-y-2">
              <h4 class="text-lg font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                Custom Template Preview
              </h4>
              <p class="text-xs text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Render custom status headers, bespoke zoom controls, or integrated action toolbars directly inside Angular <code class="font-mono">ng-template</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bespoke Template Definition -->
      <ng-template #myCustomPreview let-state let-actions="actions">
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl transition-colors duration-300">
          
          <!-- Top Floating Glass Info Header -->
          <div class="absolute top-6 left-6 right-6 flex justify-between items-center z-10"
               (click)="$event.stopPropagation()"
               (keydown.enter)="$event.stopPropagation()"
               tabindex="-1">
            <div class="apple-glass px-4 py-1.5 rounded-full text-xs font-mono text-white/90">
              Zoom: {{ (state.scale * 100).toFixed(0) }}% | Rotate: {{ state.rotate }}°
            </div>
            <button (click)="actions.close()"
                    class="apple-press bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2.5 rounded-full backdrop-blur-md transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Main Image -->
          <div class="relative w-full h-full flex items-center justify-center overflow-hidden p-8" (wheel)="actions.zoomIn()">
            <img [src]="state.src"
                 class="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-200"
                 [style.transform]="'scale(' + state.scale + ') rotate(' + state.rotate + 'deg) scaleX(' + (state.flipH ? -1 : 1) + ') scaleY(' + (state.flipV ? -1 : 1) + ')'"
                 alt="Custom Preview">
          </div>

          <!-- Bottom Control Pill -->
          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 apple-glass px-6 py-2.5 rounded-full flex items-center gap-5 shadow-2xl"
               (click)="$event.stopPropagation()"
               (keydown.enter)="$event.stopPropagation()"
               tabindex="-1">
            <button (click)="actions.zoomOut()" class="apple-press text-white/90 hover:text-white font-bold text-lg px-2">-</button>
            <div class="w-px h-4 bg-white/20"></div>
            <button (click)="actions.zoomIn()" class="apple-press text-white/90 hover:text-white font-bold text-lg px-2">+</button>
            <div class="w-px h-4 bg-white/20"></div>
            <button (click)="actions.rotateLeft()" class="apple-press text-white/80 hover:text-white px-2 text-xs font-semibold uppercase">Rotate L</button>
            <button (click)="actions.rotateRight()" class="apple-press text-white/80 hover:text-white px-2 text-xs font-semibold uppercase">Rotate R</button>
          </div>

        </div>
      </ng-template>

      <!-- Implementation Code Block -->
      <section class="apple-card p-6 md:p-8 space-y-4">
        <h3 class="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Code Implementation</h3>
        <pre><code>&lt;ng-template #myPreview let-state let-actions="actions"&gt;
  &lt;div class="my-custom-overlay"&gt;
    &lt;img [src]="state.src" [style.transform]="'scale(' + state.scale + ')'"&gt;
    &lt;button (click)="actions.close()"&gt;Close&lt;/button&gt;
  &lt;/div&gt;
&lt;/ng-template&gt;

&lt;img [ngImagesPreview]="fullResUrl" [previewTemplate]="myPreview" src="thumb.jpg" /&gt;</code></pre>
      </section>
    </div>
  `
})
export class CustomExampleComponent { }
