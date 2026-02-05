
import {
    Directive,
    ElementRef,
    Input,
    TemplateRef,
    inject,
    OnDestroy,
    PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImagesPreviewContext, ToolbarConfig } from './images-preview.component';
import { ImagesPreviewService } from './images-preview.service';
import { ImagesPreviewRef } from './images-preview-ref';

/**
 * Directive to open the image preview.
 * Can be used on any element, but auto-detects `src` on `img` or nested `img`.
 */
@Directive({
    selector: '[ngImagesPreview]',
    host: {
        '(click)': 'onClick($event)',
        '[style.cursor]': '"pointer"'
    }
})
export class ImagesPreviewDirective implements OnDestroy {
    /**
     * High resolution image source to display in preview.
     * If empty, tries to read `src` from host element or first child `img`.
     */
    @Input('ngImagesPreview') highResSrc = '';

    /**
     * List of images for gallery navigation.
     * If provided, enables previous/next navigation buttons.
     */
    @Input() previewImages: string[] = [];

    /**
     * Custom template to use for the preview.
     * If provided, overrides the default viewer UI.
     */
    @Input() previewTemplate?: TemplateRef<ImagesPreviewContext>;

    /**
     * Configuration for the toolbar buttons.
     */
    @Input() toolbarConfig?: ToolbarConfig;

    /**
     * Optional srcset for the single image.
     */
    @Input() srcset?: string;

    /**
     * List of srcsets corresponding to the `previewImages` array.
     */
    @Input() srcsets?: string[];

    /**
     * Whether to show the thumbnail strip.
     * @default true
     */
    @Input() showThumbnails = true;

    /**
     * Whether to show the toolbar.
     * @default true
     */
    @Input() showToolbar = true;

    /**
     * Whether to show next/prev navigation arrows.
     * @default true
     */
    @Input() showNavigation = true;

    /**
     * Whether to show the image counter (e.g. "1 / 5").
     * @default true
     */
    @Input() showCounter = true;

    /**
     * Custom template to render in the toolbar (e.g. for download buttons).
     */
    @Input() toolbarExtensions: TemplateRef<unknown> | null = null;

    /**
     * Type guard helper for strict template type checking.
     * Allows Angular Language Service to infer types in `previewTemplate`.
     */
    static ngTemplateContextGuard(
        directive: ImagesPreviewDirective,
        context: unknown
    ): context is ImagesPreviewContext {
        return true;
    }

    private ref: ImagesPreviewRef | null = null;
    private service = inject(ImagesPreviewService);
    private el = inject(ElementRef<HTMLElement>);
    private platformId = inject(PLATFORM_ID);

    onClick(event: Event): void {
        event.stopPropagation();

        // Prevent duplicate open
        if (this.ref) return;

        // Determine Source
        const hostEl = this.el.nativeElement;
        let src = this.highResSrc || hostEl.getAttribute('src') || (hostEl as HTMLImageElement).src;

        // If no src found on host, try to find an img child
        if (!src) {
            const imgChild = hostEl.querySelector('img');
            if (imgChild) {
                src = imgChild.getAttribute('src') || imgChild.src;
            }
        }

        src = src || '';

        if (src) {
            const rect = hostEl.getBoundingClientRect();
            this.openPreview(src, rect);
        }
    }

    private openPreview(src: string, rect: DOMRect): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.ref = this.service.open(src, {
            images: this.previewImages,
            initialIndex: this.previewImages.indexOf(src),
            customTemplate: this.previewTemplate,
            toolbarConfig: this.toolbarConfig,
            srcset: this.srcset,
            srcsets: this.srcsets,
            showThumbnails: this.showThumbnails,
            showNavigation: this.showNavigation,
            showCounter: this.showCounter,
            showToolbar: this.showToolbar,
            toolbarExtensions: this.toolbarExtensions,
            openerRect: rect
        });

        this.ref.afterClosed$.subscribe(() => {
            this.ref = null;
        });
    }

    private destroyPreview(): void {
        if (this.ref) {
            this.ref.close();
            this.ref = null;
        }
    }

    ngOnDestroy(): void {
        this.destroyPreview();
    }
}
