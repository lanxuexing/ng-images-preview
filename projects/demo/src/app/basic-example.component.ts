import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesPreviewDirective, ToolbarConfig, ImagesPreviewService, ImagesGalleryComponent } from 'ng-images-preview';

@Component({
  selector: 'app-basic-example',
  standalone: true,
  imports: [CommonModule, ImagesPreviewDirective, ImagesGalleryComponent],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <header class="mb-10">
        <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Basic Usage</h2>
        <p class="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          The simplest way to use the library is adding the
          <code
            class="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded px-1.5 py-0.5 text-indigo-600 dark:text-indigo-400 text-sm font-mono font-medium"
            >ngImagesPreview</code
          >
          directive to any image.
        </p>
      </header>

      <section
        class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/50 dark:border-slate-800/50 p-5 md:p-8 mb-12"
      >
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Gallery Mode</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Full gallery with navigation</p>
          </div>
          <span
            class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider"
            >Interactive</span
          >
        </div>

        
        <div class="mb-8">
            <button 
                (click)="openServicePreview()"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
                Open via Service API
            </button>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Calls <code>service.open(src, config)</code> directly.
            </p>
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

         
          <!-- Example 4: Custom Toolbar -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            ngImagesPreview
            [toolbarConfig]="minToolbarConfig"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-violet-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">Reduced Toolbar</span>
            </div>
            <img
              src="https://picsum.photos/id/42/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Coffee"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >View (No Rotate)</span
              >
            </div>
          </div>

          <!-- Example 5: Responsive -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            ngImagesPreview
            [srcset]="srcsetString"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-pink-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">Srcset</span>
            </div>
            <img
              src="https://picsum.photos/id/55/800/600"
              [srcset]="srcsetString"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Responsive"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >Responsive View</span
              >
            </div>
          </div>

          
          <!-- Example 6: Large Gallery (Thumbnails) -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            [ngImagesPreview]="largeImageList[0]"
            [previewImages]="largeImageList"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-orange-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">Thumbnails</span>
            </div>
            <img
              src="https://picsum.photos/id/60/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Large Gallery"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >View Large Gallery</span
              >
            </div>
            </div>

          
          <!-- Example 7: Thumbnails Disabled -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            [ngImagesPreview]="largeImageList[0]"
            [previewImages]="largeImageList"
            [showThumbnails]="false"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-gray-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">No Thumbnails</span>
            </div>
            <img
              src="https://picsum.photos/id/80/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="No Thumbnails"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >View Gallery (No Thumbs)</span
              >
            </div>
          </div>


          


          <!-- Example 8: Minimalist Mode -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            [ngImagesPreview]="largeImageList[0]"
            [previewImages]="largeImageList"
            [showThumbnails]="false"
            [showToolbar]="false"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">Minimalist</span>
            </div>
            <img
              src="https://picsum.photos/id/100/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Minimalist"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >Pure View</span>
            </div>
          </div>

          <!-- Example 9: Download Button Extension -->
           <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            [ngImagesPreview]="largeImageList[0]"
            [previewImages]="largeImageList"
            [toolbarExtensions]="downloadTpl"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-blue-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">Download Btn</span>
            </div>
            <img
              src="https://picsum.photos/id/11/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Download"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >View & Download</span>
            </div>
          </div>

          <!-- Example 10: Navigation Disabled -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            [ngImagesPreview]="largeImageList[0]"
            [previewImages]="largeImageList"
            [showNavigation]="false"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-amber-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">No Arrows</span>
            </div>
            <img
              src="https://picsum.photos/id/120/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="No Navigation Arrows"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >Gesture Only View</span>
            </div>
          </div>

          <!-- Example 11: Pure Minimalist (Counter + Close only) -->
          <div
            class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02]"
            [ngImagesPreview]="largeImageList[1]"
            [previewImages]="largeImageList"
            [showNavigation]="false"
            [showCounter]="true"
            [showToolbar]="false"
            [showThumbnails]="false"
          >
            <div class="absolute top-4 left-4 z-10">
                <span class="px-2 py-1 bg-rose-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">Pure Minimalist</span>
            </div>
            <img
              src="https://picsum.photos/id/130/800/600"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Pure Minimalist View"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            >
              <span
                class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white/20 transition-colors"
                >Counter & Close only</span>
            </div>
          </div>
        </div>
      </section>

      <!-- New Gallery Component Section -->
      <section
        class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/50 dark:border-slate-800/50 p-5 md:p-8 mb-12"
      >
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">NG Images Gallery</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Ready-to-use grid component</p>
          </div>
          <span
            class="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider"
            >New</span
          >
        </div>

        <ng-images-gallery 
            [images]="largeImageList" 
            [columns]="4" 
            gap="12px"
            aspectRatio="16 / 9"
        ></ng-images-gallery>
      </section>

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
  <span class="text-sky-300">ngImagesPreview</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 4. Custom Toolbar --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"image.jpg"</span> 
  <span class="text-sky-300">ngImagesPreview</span>
  <span class="text-sky-300">[toolbarConfig]</span>=<span class="text-emerald-300">"{{ '{' }} showRotate: false {{ '}' }}"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 5. Responsive (Srcset) --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"image.jpg"</span> 
  <span class="text-sky-300">ngImagesPreview</span>
  <span class="text-sky-300">[srcset]</span>=<span class="text-emerald-300">"'img-400w.jpg 400w, img-800w.jpg 800w'"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 6. Thumbnails (Auto-appears for >1 images) --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"thumb.jpg"</span> 
  <span class="text-sky-300">[ngImagesPreview]</span>=<span class="text-emerald-300">"full.jpg"</span>
  <span class="text-sky-300">[previewImages]</span>=<span class="text-emerald-300">"largeList"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 7. Thumbnails Disabled --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"thumb.jpg"</span> 
  <span class="text-sky-300">[ngImagesPreview]</span>=<span class="text-emerald-300">"full.jpg"</span>
  <span class="text-sky-300">[previewImages]</span>=<span class="text-emerald-300">"largeList"</span>
  <span class="text-sky-300">[showThumbnails]</span>=<span class="text-emerald-300">"false"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 8. Minimalist (No GUI) --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"img.jpg"</span> 
  <span class="text-sky-300">[ngImagesPreview]</span>=<span class="text-emerald-300">"full.jpg"</span>
  <span class="text-sky-300">[showThumbnails]</span>=<span class="text-emerald-300">"false"</span>
  <span class="text-sky-300">[showToolbar]</span>=<span class="text-emerald-300">"false"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 9. Custom Extension (Download) --&gt;</span>
<span class="text-violet-400">&lt;ng-template</span> <span class="text-sky-300">#dlBtn</span> <span class="text-sky-300">let-img</span><span class="text-violet-400">&gt;</span>
  <span class="text-violet-400">&lt;button</span> <span class="text-sky-300">(click)</span>=<span class="text-emerald-300">"download(img)"</span><span class="text-violet-400">&gt;</span>Download<span class="text-violet-400">&lt;/button&gt;</span>
<span class="text-violet-400">&lt;/ng-template&gt;</span>

<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"img.jpg"</span> 
  <span class="text-sky-300">ngImagesPreview</span>
  <span class="text-sky-300">[toolbarExtensions]</span>=<span class="text-emerald-300">"dlBtn"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 10. Navigation Disabled (Gesture Only) --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"img.jpg"</span> 
  <span class="text-sky-300">ngImagesPreview</span>
  <span class="text-sky-300">[previewImages]</span>=<span class="text-emerald-300">"largeList"</span>
  <span class="text-sky-300">[showNavigation]</span>=<span class="text-emerald-300">"false"</span>
  <span class="text-sky-300">[showCounter]</span>=<span class="text-emerald-300">"true"</span><span class="text-violet-400">&gt;</span>

<span class="text-slate-500">&lt;!-- 11. Pure Minimalist (Counter + Close Only) --&gt;</span>
<span class="text-violet-400">&lt;img</span> 
  <span class="text-sky-300">src</span>=<span class="text-emerald-300">"img.jpg"</span> 
  <span class="text-sky-300">ngImagesPreview</span>
  <span class="text-sky-300">[previewImages]</span>=<span class="text-emerald-300">"largeList"</span>
  <span class="text-sky-300">[showNavigation]</span>=<span class="text-emerald-300">"false"</span>
  <span class="text-sky-300">[showToolbar]</span>=<span class="text-emerald-300">"false"</span>
  <span class="text-sky-300">[showThumbnails]</span>=<span class="text-emerald-300">"false"</span>
  <span class="text-sky-300">[showCounter]</span>=<span class="text-emerald-300">"true"</span><span class="text-violet-400">&gt;</span></code></pre>


      </section>

      <!-- Custom Templates -->
      <ng-template #downloadTpl let-img>
        <button 
          class="p-2 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
          (click)="downloadImage(img); $event.stopPropagation()"
          title="Download Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </button>
      </ng-template>
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

  largeImageList = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/id/${60 + i}/1200/800`);

  minToolbarConfig: ToolbarConfig = {
    showRotate: false,
    showFlip: false,
    showZoom: true
  };

  srcsetString = `https://picsum.photos/id/55/400/300 400w, 
                  https://picsum.photos/id/55/800/600 800w, 
                  https://picsum.photos/id/55/1600/1200 1600w`;

  downloadImage(url: string) {
    // Fake download for demo
    alert(`Downloading image: ${url}`);
    /*
    // Real implementation:
    const a = document.createElement('a');
    a.href = url;
    a.download = 'download.jpg';
    a.click();
    */
  }

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
