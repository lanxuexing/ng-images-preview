
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesPreviewDirective } from 'ng-images-preview';

@Component({
  selector: 'app-custom-example',
  standalone: true,
  imports: [CommonModule, ImagesPreviewDirective],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <header class="mb-10">
        <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Custom Template</h2>
        <p class="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Take full control of the preview UI by providing a
          <code
            class="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded px-1.5 py-0.5 text-indigo-600 dark:text-indigo-400 text-sm font-mono font-medium"
            >ng-template</code
          >.
        </p>
      </header>

      <section
        class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/50 dark:border-slate-800/50 p-5 md:p-12 mb-12"
      >
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Custom UI Integration</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Preview with completely custom controls and layout</p>
          </div>
          <span
            class="px-3 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-xs font-bold uppercase tracking-wider"
            >Advanced</span
          >
        </div>

        <div class="flex justify-center">
          <div
            class="group relative max-w-sm rounded-2xl overflow-hidden cursor-pointer shadow-2xl shadow-slate-200 dark:shadow-none hover:shadow-3xl hover:shadow-indigo-500/10 transition-all duration-500 bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700"
            ngImagesPreview="https://picsum.photos/id/25/5000/3333"
            [previewTemplate]="myCustomPreview"
          >
            <div class="relative overflow-hidden aspect-[4/3]">
              <img
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://picsum.photos/id/25/800/600"
                alt="iPod"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8"
              >
                <span
                  class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                  >Launch Custom UI</span
                >
              </div>
            </div>

            <div class="p-8">
              <h5
                class="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Custom Interaction
              </h5>
              <p class="font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                Click the image above to experience a bespoke preview interface implemented via the <span class="text-indigo-600 dark:text-indigo-400 font-medium">Template API</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Custom Template Definition -->
      <ng-template #myCustomPreview let-state let-actions="actions">
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors duration-300">
            
            <!-- Custom Header -->
            <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10" 
                 (click)="$event.stopPropagation()" 
                 (keydown.enter)="$event.stopPropagation()"
                 tabindex="-1">
                <div class="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-gray-600 dark:text-slate-400 transition-colors">
                    Zoom: {{ (state.scale * 100).toFixed(0) }}% | Rotation: {{ state.rotate }}°
                </div>
                <button (click)="actions.close()" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/50 p-2 rounded-full transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- Image with Transforms -->
             <div class="relative w-full h-full flex items-center justify-center overflow-hidden p-8" (wheel)="actions.zoomIn()">
                <img 
                    [src]="state.src" 
                    class="max-w-full max-h-full object-contain shadow-2xl rounded-lg transition-transform duration-200"
                    [style.transform]="'scale(' + state.scale + ') rotate(' + state.rotate + 'deg) scaleX(' + (state.flipH ? -1 : 1) + ') scaleY(' + (state.flipV ? -1 : 1) + ')'"
                    alt="Custom Preview">
             </div>

             <!-- Custom Bottom Toolbar -->
             <div class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-sm" 
                  (click)="$event.stopPropagation()"
                  (keydown.enter)="$event.stopPropagation()"
                  tabindex="-1">
                <button (click)="actions.zoomOut()" class="hover:text-blue-400 font-bold text-xl px-2">-</button>
                <div class="w-px h-6 bg-white/20"></div>
                <button (click)="actions.zoomIn()" class="hover:text-blue-400 font-bold text-xl px-2">+</button>
                <div class="w-px h-6 bg-white/20"></div>
                <button (click)="actions.rotateLeft()" class="hover:text-yellow-400 px-2 text-sm uppercase font-bold">Rot L</button>
                <button (click)="actions.rotateRight()" class="hover:text-yellow-400 px-2 text-sm uppercase font-bold">Rot R</button>
             </div>

        </div>
      </ng-template>

      <section class="bg-slate-900 dark:bg-black rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden group border border-white/5 dark:border-slate-800">
        <div
          class="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity"
        >
          <div class="flex space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <h3
          class="font-bold text-slate-100 mb-6 text-lg tracking-wide border-b border-slate-700/50 pb-4"
        >
          Implementation
        </h3>
        <pre class="font-mono text-sm leading-relaxed overflow-x-auto"><code class="language-html"><span class="text-slate-500">&lt;!-- 1. Define Template --&gt;</span>
<span class="text-violet-400">&lt;ng-template</span> <span class="text-sky-300">#myPreview</span> <span class="text-sky-300">let-state</span> <span class="text-sky-300">let-actions</span>=<span class="text-emerald-300">"actions"</span><span class="text-violet-400">&gt;</span>
  <span class="text-violet-400">&lt;div</span> <span class="text-sky-300">class</span>=<span class="text-emerald-300">"my-custom-overlay"</span><span class="text-violet-400">&gt;</span>
    <span class="text-violet-400">&lt;img</span> <span class="text-sky-300">[src]</span>=<span class="text-emerald-300">"state.src"</span> <span class="text-sky-300">[style.transform]</span>=<span class="text-emerald-300">"..."</span><span class="text-violet-400">&gt;</span>
    <span class="text-violet-400">&lt;button</span> <span class="text-sky-300">(click)</span>=<span class="text-emerald-300">"actions.close()"</span><span class="text-violet-400">&gt;</span>Close<span class="text-violet-400">&lt;/button&gt;</span>
  <span class="text-violet-400">&lt;/div&gt;</span>
<span class="text-violet-400">&lt;/ng-template&gt;</span>

<span class="text-slate-500">&lt;!-- 2. Use Directive --&gt;</span>
<span class="text-violet-400">&lt;div</span> 
  <span class="text-sky-300">ngImagesPreview</span>=<span class="text-emerald-300">"full.jpg"</span> 
  <span class="text-sky-300">[previewTemplate]</span>=<span class="text-emerald-300">"myPreview"</span><span class="text-violet-400">&gt;</span>
  
  <span class="text-violet-400">&lt;img</span> <span class="text-sky-300">src</span>=<span class="text-emerald-300">"thumb.jpg"</span><span class="text-violet-400">&gt;</span>
<span class="text-violet-400">&lt;/div&gt;</span></code></pre>
      </section>
    </div>
  `
})
export class CustomExampleComponent { }
