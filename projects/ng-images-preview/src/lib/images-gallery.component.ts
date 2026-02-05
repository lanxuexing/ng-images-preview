
import { Component, ChangeDetectionStrategy, input, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ImagesPreviewService } from './images-preview.service';

/**
 * A responsive grid gallery component that automatically wires up the image preview.
 */
@Component({
    selector: 'ng-images-gallery',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage],
    template: `
    <div class="gallery-grid" [style.--grid-gap]="gap()" [style.--grid-cols]="columns()">
      @for (img of images(); track img; let i = $index) {
        <div 
          class="gallery-item" 
          (click)="openPreview(i)"
          [style.aspect-ratio]="aspectRatio()"
          [style.cursor]="'pointer'"
          (keydown.enter)="openPreview(i)"
          tabindex="0"
          role="button"
          aria-label="View image in full screen"
        >
          <img [ngSrc]="img" [fill]="true" alt="Gallery image" class="gallery-img">
        </div>
      }
    </div>
  `,
    styles: [`
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(var(--grid-cols, 3), 1fr);
      gap: var(--grid-gap, 8px);
    }
    .gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      background-color: #f0f0f0;
      transition: opacity 0.2s;
    }
    .gallery-item:hover {
      opacity: 0.9;
    }
    .gallery-img {
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .gallery-item:hover .gallery-img {
      transform: scale(1.05);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ImagesGalleryComponent {
    /**
     * List of images to display in the grid.
     */
    images = input.required<string[]>();

    /**
     * Number of columns in the grid.
     * @default 3
     */
    columns = input(3);

    /**
     * Gap between images in pixels.
     * @default '8px'
     */
    gap = input('8px');

    /**
     * Aspect ratio of the thumbnails.
     * @default '1 / 1' (Square)
     */
    aspectRatio = input('1 / 1');

    private service = inject(ImagesPreviewService);

    openPreview(index: number) {
        this.service.open(this.images()[index], {
            images: this.images(),
            initialIndex: index,
            // Pass other defaults if needed, or let service handle it
        });
    }
}
