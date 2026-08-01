import { Component, inject, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesGalleryComponent, ImagesPreviewService } from 'ng-images-preview';

@Component({
  selector: 'app-advanced-features',
  standalone: true,
  imports: [CommonModule, ImagesGalleryComponent],
  template: `
    <div class="space-y-10 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      <!-- Apple Section Header -->
      <header class="space-y-3">
        <div class="inline-flex items-center gap-2 apple-badge">
          <span>Advanced API</span>
          <span class="w-1 h-1 rounded-full bg-current"></span>
          <span>Power Features</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold text-[#1d1d1f] dark:text-white tracking-tight">
          Advanced Capabilities
        </h1>
        <p class="text-base md:text-lg text-[#86868b] dark:text-[#a1a1a6] leading-relaxed max-w-2xl">
          Explore programmatic service invocation, standalone gallery grid components, and mixed hybrid media slides.
        </p>
      </header>

      <!-- Section 1: Standalone Gallery Grid -->
      <section class="apple-card p-6 md:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-6">
          <div>
            <h2 class="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Standalone Grid Component</h2>
            <p class="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">&lt;ng-images-gallery&gt; responsive layout component.</p>
          </div>
          <span class="apple-badge">Component</span>
        </div>

        <ng-images-gallery [images]="galleryImages" [columns]="3" gap="12px"></ng-images-gallery>

        <pre><code>&lt;ng-images-gallery [images]="galleryImages" [columns]="3" gap="12px" /&gt;</code></pre>
      </section>

      <!-- Section 2: Programmatic Service API -->
      <section class="apple-card p-6 md:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-6">
          <div>
            <h2 class="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Programmatic Service API</h2>
            <p class="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Open image overlays programmatically from TypeScript without directive tags.</p>
          </div>
          <span class="apple-badge">Service</span>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
          <div>
            <h4 class="text-base font-semibold text-[#1d1d1f] dark:text-white">Trigger Service Launch</h4>
            <p class="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">Calls <code class="font-mono">ImagesPreviewService.open(src, config)</code></p>
          </div>
          <button (click)="openViaService()"
                  class="apple-press bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 rounded-full font-medium text-xs shadow-md transition-all">
            Launch Service Preview
          </button>
        </div>

        <pre><code>import {{ '{' }} ImagesPreviewService {{ '}' }} from 'ng-images-preview';

const service = inject(ImagesPreviewService);

service.open('high-res.jpg', {{ '{' }}
  images: ['img1.jpg', 'img2.jpg'],
  initialIndex: 0
{{ '}' }});</code></pre>
      </section>

      <!-- Section 3: Mixed Content / Hybrid Slides -->
      <section class="apple-card p-6 md:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-6">
          <div>
            <h2 class="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Mixed Hybrid Media Slides</h2>
            <p class="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Mix images with Angular TemplateRefs (video players, interactive cards) in a single gallery stream.</p>
          </div>
          <span class="apple-badge">Hybrid</span>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div (click)="openMixedContent(0)" class="aspect-square rounded-xl overflow-hidden cursor-pointer apple-card apple-press relative">
            <img [src]="mixedImages[0]" class="w-full h-full object-cover" alt="Image slide 1">
            <span class="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-md">Image</span>
          </div>

          <div (click)="openMixedContent(1)" class="aspect-square rounded-xl overflow-hidden cursor-pointer apple-card apple-press relative bg-black/80 flex items-center justify-center">
            <div class="text-center p-2">
              <svg class="w-8 h-8 text-[#0071e3] mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-[10px] font-bold text-white uppercase tracking-wider">Template Slide</span>
            </div>
          </div>

          <div (click)="openMixedContent(2)" class="aspect-square rounded-xl overflow-hidden cursor-pointer apple-card apple-press relative">
            <img [src]="mixedImages[2]" class="w-full h-full object-cover" alt="Image slide 2">
            <span class="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-md">Image</span>
          </div>
        </div>
      </section>

      <!-- Template Definition for Mixed Content -->
      <ng-template #videoSlide>
        <div class="w-full h-full flex items-center justify-center bg-black/90 p-6" (click)="$event.stopPropagation()">
          <div class="apple-card p-8 max-w-md text-center space-y-4">
            <div class="w-12 h-12 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center mx-auto">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-[#1d1d1f] dark:text-white">Custom Angular Template Slide</h3>
            <p class="text-xs text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
              Embed interactive video players, PDF viewers, or custom Angular components seamlessly within your image gallery navigation stream.
            </p>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class AdvancedFeaturesComponent implements AfterViewInit {
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

  mixedImages: any[] = [
    'https://picsum.photos/id/20/1200/800',
    null,
    'https://picsum.photos/id/22/1200/800'
  ];

  ngAfterViewInit() {
    this.mixedImages[1] = this.videoSlide;
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
      showThumbnails: true
    });
  }
}
