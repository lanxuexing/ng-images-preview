import { Subject } from 'rxjs';

import { TemplateRef } from '@angular/core';
import { ImagesPreviewContext, ToolbarConfig } from './images-preview.component';

/**
 * Configuration options for opening an image preview.
 */
export interface ImagesPreviewConfig {
    /**
     * List of image URLs or Templates to display in the gallery.
     * If provided, enables navigation between these items.
     * @type {Array<string | TemplateRef<unknown>>}
     */
    images?: (string | TemplateRef<unknown>)[];

    /**
     * The index of the initial image to display.
     * @default 0
     */
    initialIndex?: number;

    /**
     * Custom template to render instead of the default preview UI.
     * This template receives `ImagesPreviewContext` as context.
     */
    customTemplate?: TemplateRef<ImagesPreviewContext> | null;

    /**
     * Configuration for the toolbar buttons (zoom, rotate, flip).
     */
    toolbarConfig?: ToolbarConfig;

    /**
     * `srcset` attribute for the single image.
     * Used for responsive image loading.
     */
    srcset?: string;

    /**
     * List of `srcset` strings corresponding to the `images` array.
     * Each entry should match the index of the image in the `images` array.
     */
    srcsets?: string[];

    /**
     * Whether to show navigation arrows (next/prev).
     * @default true
     */
    showNavigation?: boolean;

    /**
     * Whether to show the image counter (e.g., "1 / 5").
     * @default true
     */
    showCounter?: boolean;

    /**
     * Whether to show the thumbnail strip at the bottom.
     * @default true
     */
    showThumbnails?: boolean;

    /**
     * Whether to show the toolbar actions.
     * @default true
     */
    showToolbar?: boolean;

    /**
     * Custom template to extend the toolbar with additional buttons.
     */
    toolbarExtensions?: TemplateRef<unknown> | null;

    /**
     * The bounding rectangle of the element that opened the preview.
     * Used for the initial FLIP animation (zooming out from the thumbnail).
     */
    openerRect?: DOMRect;
}

/**
 * Reference to an opened image preview.
 * Can be used to close the preview or listen for closure events.
 */
export class ImagesPreviewRef {
    private readonly _afterClosed = new Subject<void>();

    /**
     * Observable that emits when the preview is closed.
     */
    afterClosed$ = this._afterClosed.asObservable();

    constructor(private overlayCallback: () => void) { }

    /**
     * Closes the image preview.
     */
    close(): void {
        this.overlayCallback();
        this._afterClosed.next();
        this._afterClosed.complete();
    }
}
