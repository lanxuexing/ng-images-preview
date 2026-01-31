
import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    TemplateRef,
    ApplicationRef,
    EnvironmentInjector,
    createComponent,
    ComponentRef,
    inject,
    OnDestroy,
    PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImagesPreviewComponent, ImagesPreviewContext, ToolbarConfig } from './images-preview.component';

/**
 * Directive to open the image preview.
 * Can be used on any element, but auto-detects `src` on `img` or nested `img`.
 */
@Directive({
    selector: '[ngImagesPreview]',
    standalone: true
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
    @Input() toolbarExtensions: TemplateRef<any> | null = null;

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

    private componentRef: ComponentRef<ImagesPreviewComponent> | null = null;

    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);
    private el = inject(ElementRef<HTMLElement>);
    private platformId = inject(PLATFORM_ID);

    @HostListener('click', ['$event'])
    onClick(event: Event): void {
        event.stopPropagation();

        // Prevent duplicate open
        if (this.componentRef) return;

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

    @HostListener('style.cursor')
    readonly cursor = 'pointer';

    private openPreview(src: string, rect: DOMRect): void {
        if (!isPlatformBrowser(this.platformId)) return;

        // Create Component
        this.componentRef = createComponent(ImagesPreviewComponent, {
            environmentInjector: this.injector
        });

        // Set Inputs
        this.componentRef.setInput('src', src);
        this.componentRef.setInput('openerRect', rect);

        if (this.previewImages.length > 0) {
            this.componentRef.setInput('images', this.previewImages);
            const index = this.previewImages.indexOf(src);
            this.componentRef.setInput('initialIndex', index >= 0 ? index : 0);
        }

        if (this.previewTemplate) {
            this.componentRef.setInput('customTemplate', this.previewTemplate);
        }

        if (this.toolbarConfig) {
            this.componentRef.setInput('toolbarConfig', this.toolbarConfig);
        }

        if (this.srcset) {
            this.componentRef.setInput('srcset', this.srcset);
        }

        if (this.srcsets) {
            this.componentRef.setInput('srcsets', this.srcsets);
        }
        this.componentRef.setInput('showThumbnails', this.showThumbnails);
        this.componentRef.setInput('showNavigation', this.showNavigation);
        this.componentRef.setInput('showCounter', this.showCounter);
        this.componentRef.setInput('showToolbar', this.showToolbar);
        this.componentRef.setInput('toolbarExtensions', this.toolbarExtensions);

        // Set Callbacks
        this.componentRef.instance.closeCallback = () => this.destroyPreview();

        // Attach to App
        this.appRef.attachView(this.componentRef.hostView);

        // Append to Body
        const domElem = (this.componentRef.hostView as unknown as { rootNodes: HTMLElement[] }).rootNodes[0];
        document.body.appendChild(domElem);
    }

    private destroyPreview(): void {
        if (this.componentRef) {
            this.appRef.detachView(this.componentRef.hostView);
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    ngOnDestroy(): void {
        this.destroyPreview();
    }
}
