import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesPreviewDirective } from 'ng-images-preview';

@Component({
  selector: 'app-basic-example',
  standalone: true,
  imports: [CommonModule, ImagesPreviewDirective],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <header class="mb-10">
        <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Basic Usage</h2>
        <p class="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
          The simplest way to use the library is adding the
          <code
            class="bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 text-indigo-600 text-sm font-mono font-medium"
            >ngImagesPreview</code
          >
          directive to any image.
        </p>
      </header>

      <section
        class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-5 md:p-8 mb-12"
      >
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-xl font-bold text-slate-900">Gallery Mode</h3>
            <p class="text-sm text-slate-500 mt-1">Full gallery with navigation</p>
          </div>
          <span
            class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider"
            >Interactive</span
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Example 1 -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            [ngImagesPreview]="imageList[0]"
            [previewImages]="imageList"
          >
            <img
              src="https://picsum.photos/id/10/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Nature Scene"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >View Gallery</span
              >
            </div>
          </div>

          <!-- Example 2: Single High Res -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            [ngImagesPreview]="imageList[1]"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-black/50 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">High Res</span>
            </div>
            <img
              src="https://picsum.photos/id/15/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Waterfall"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >View High Res</span
              >
            </div>
          </div>

          <!-- Example 3: Simple Auto -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            ngImagesPreview
          >
           <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-emerald-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">Zero Config</span>
            </div>
            <img
              src="https://picsum.photos/id/20/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Notes"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >Quick View</span
              >
            </div>
          </div>
        </div>
      </section>

      <section class="bg-slate-900 rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden group">
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
        <pre class="font-mono text-sm leading-relaxed overflow-x-auto"><code class="language-html"><span class="text-slate-500">&lt;!-- 1. Gallery Mode --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"thumb.jpg"</span> 
  <span class="text-sky-300">[ngImagesPreview]</span>=<span class="text-emerald-300">"full.jpg"</span>
  <span class="text-sky-300">[previewImages]</span>=<span class="text-emerald-300">"['img1.jpg', 'img2.jpg']"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 2. Single High-Res Image --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"thumb.jpg"</span> 
  <span class="text-sky-300">[ngImagesPreview]</span>=<span class="text-emerald-300">"full.jpg"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 3. Zero Config (Auto Source) --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"image.jpg"</span> 
  <span class="text-sky-300">ngImagesPreview</span><span class="text-violet-400">&gt;</span></code></pre>
      </section>
    </div>
  `,
})
export class BasicExampleComponent {
  imageList = [
    'https://picsum.photos/id/10/2500/1667',
    'https://picsum.photos/id/15/2500/1667',
    'https://picsum.photos/id/20/3670/2462',
    'https://picsum.photos/id/25/5000/3333',
    'https://picsum.photos/id/28/4928/3264',
  ];
}
