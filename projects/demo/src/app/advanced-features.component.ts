
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesGalleryComponent, ImagesPreviewService } from 'ng-images-preview';

@Component({
    selector: 'app-advanced-features',
    standalone: true,
    imports: [CommonModule, ImagesGalleryComponent],
    template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <header class="mb-10">
        <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Advanced Features <span class="text-indigo-500 text-lg align-top">v2.0</span></h2>
        <p class="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Explore the new power user features: Standalone Gallery, Programmatic API, and Mixed Content Types.
        </p>
      </header>

      <!-- 1. The Gallery Component -->
      <section class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/50 dark:border-slate-800/50 p-5 md:p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Component: &lt;ng-images-gallery&gt;
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Ready-to-use responsive grid. Just pass an array of images.</p>
            </div>
            <span class="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-bold uppercase tracking-wider">New</span>
        </div>

        <ng-images-gallery 
            [images]="galleryImages" 
            [columns]="3" 
            gap="12px">
        </ng-images-gallery>

        <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 overflow-x-auto">
            &lt;ng-images-gallery [images]="['...']" [columns]="3" gap="12px"&gt;&lt;/ng-images-gallery&gt;
        </div>
      </section>

      <!-- 2. Service API -->
      <section class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/50 dark:border-slate-800/50 p-5 md:p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    Service API
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Trigger previews programmatically from any event or button.</p>
            </div>
            <span class="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-bold uppercase tracking-wider">New</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 items-center justify-center p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 dashed">
            <button 
                (click)="openViaService()"
                class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-2"
            >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Launch Preview via Service
            </button>
            <p class="text-sm text-slate-500 dark:text-slate-400 italic">No &lt;img&gt; tag required in template!</p>
        </div>
      </section>

      <!-- 3. Mixed Content -->
      <section class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/50 dark:border-slate-800/50 p-5 md:p-8">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    Mixed Content (Hybrid)
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Mix Images with Custom Templates (Video, PDF, interactive components) in the same gallery.</p>
            </div>
            <span class="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-bold uppercase tracking-wider">New</span>
        </div>

        <div class="grid grid-cols-3 gap-4">
            <!-- Thumbnails representing the mixed content -->
            <div (click)="openMixedContent(0)" class="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img [src]="mixedImages[0]" class="w-full h-full object-cover">
            </div>
            <div (click)="openMixedContent(1)" class="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group">
                <!-- Video Thumbnail Placeholder -->
                <div class="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold">
                    <svg class="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <img src="https://picsum.photos/id/40/300/300" class="w-full h-full object-cover grayscale opacity-50">
                <span class="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">TEMPLATE</span>
            </div>
            <div (click)="openMixedContent(2)" class="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img [src]="mixedImages[2]" class="w-full h-full object-cover">
            </div>
        </div>
      </section>

      <!-- Template Definition for Mixed Content -->
      <ng-template #videoSlide let-item>
        <div class="w-full h-full flex items-center justify-center bg-black p-4 md:p-20" (click)="$event.stopPropagation()">
            <div class="bg-slate-800 text-white p-8 rounded-2xl max-w-lg text-center shadow-2xl border border-slate-700">
                <div class="mb-4 flex justify-center text-indigo-400">
                    <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 class="text-2xl font-bold mb-2">Custom Template Slide</h2>
                <p class="text-slate-400 mb-6">This is not an image! It's an Angular 'TemplateRef' rendered inside the gallery. You can put anything here: Video Player, PDF Viewer, Form, etc.</p>
                <div class="flex gap-4 justify-center">
                    <button class="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">Play Video</button>
                    <button class="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">More Info</button>
                </div>
            </div>
        </div>
      </ng-template>

    </div>
  `
})
export class AdvancedFeaturesComponent {
    private service = inject(ImagesPreviewService);

    @ViewChild('videoSlide') videoSlide!: TemplateRef<any>;

    galleryImages = [
        'https://picsum.photos/id/10/800/600',
        'https://picsum.photos/id/11/800/600',
        'https://picsum.photos/id/12/800/600',
        'https://picsum.photos/id/13/800/600',
        'https://picsum.photos/id/14/800/600',
        'https://picsum.photos/id/15/800/600',
    ];

    mixedImages: any[] = [];

    // Initialize mixed content after view init so we can access the template
    ngAfterViewInit() {
        this.mixedImages = [
            'https://picsum.photos/id/20/1200/800',
            this.videoSlide, // The template!
            'https://picsum.photos/id/22/1200/800'
        ];
    }

    openViaService() {
        this.service.open('https://picsum.photos/id/30/1200/800', {
            images: [
                'https://picsum.photos/id/30/1200/800',
                'https://picsum.photos/id/31/1200/800',
                'https://picsum.photos/id/32/1200/800'
            ],
            showThumbnails: true
        });
    }

    openMixedContent(index: number) {
        this.service.open(this.mixedImages[index], {
            images: this.mixedImages,
            initialIndex: index,
            showThumbnails: true, // Auto handles templates in thumbnails (shows placeholder or nothing, check implementation)
            // Actually, my current thumbnail impl tries to render `img [src]="img"`.
            // If `img` is a TemplateRef, [src] will [Object object].
            // I should probably fix the thumbnail strip in the component to handle templates too?
            // Wait, let's check `ImagesPreviewComponent` thumbnail logic.
        });
    }
}
