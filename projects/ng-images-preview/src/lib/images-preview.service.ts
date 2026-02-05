import { ApplicationRef, EnvironmentInjector, Injectable, createComponent, inject } from '@angular/core';
import { ImagesPreviewComponent } from './images-preview.component';
import { ImagesPreviewConfig, ImagesPreviewRef } from './images-preview-ref';
import { OverlayManager } from './utils/overlay-manager';

/**
 * Service to programmatically open the image preview.
 * This is the primary API for using the library via TypeScript.
 */
@Injectable({
    providedIn: 'root'
})
export class ImagesPreviewService {
    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);
    private overlayManager = inject(OverlayManager);

    /**
     * Opens the image preview overlay.
     * 
     * @param src The URL of the image to display (or the first image if showing a gaallery).
     * @param config Optional configuration object to customize the preview (images list, toolbar, etc.).
     * @returns An `ImagesPreviewRef` that can be used to close the preview or listen for close events.
     */
    open(src: string, config: ImagesPreviewConfig = {}): ImagesPreviewRef {
        // Create Component
        const componentRef = createComponent(ImagesPreviewComponent, {
            environmentInjector: this.injector
        });

        // Initialize Inputs
        componentRef.setInput('src', src);
        if (config.openerRect) componentRef.setInput('openerRect', config.openerRect);

        if (config.images) componentRef.setInput('images', config.images);
        if (config.initialIndex !== undefined) componentRef.setInput('initialIndex', config.initialIndex);
        if (config.customTemplate) componentRef.setInput('customTemplate', config.customTemplate);
        if (config.toolbarConfig) componentRef.setInput('toolbarConfig', config.toolbarConfig);
        if (config.srcset) componentRef.setInput('srcset', config.srcset);
        if (config.srcsets) componentRef.setInput('srcsets', config.srcsets);

        if (config.showNavigation !== undefined) componentRef.setInput('showNavigation', config.showNavigation);
        if (config.showCounter !== undefined) componentRef.setInput('showCounter', config.showCounter);
        if (config.showThumbnails !== undefined) componentRef.setInput('showThumbnails', config.showThumbnails);
        if (config.showToolbar !== undefined) componentRef.setInput('showToolbar', config.showToolbar);
        if (config.toolbarExtensions) componentRef.setInput('toolbarExtensions', config.toolbarExtensions);

        // Attach to DOM
        this.overlayManager.attach(componentRef, this.appRef);
        this.overlayManager.blockScroll();

        // Create Ref
        const ref = new ImagesPreviewRef(() => {
            this.overlayManager.detach(componentRef, this.appRef);
            this.overlayManager.unblockScroll();
        });

        // Wire up close callback from component to Ref
        componentRef.instance.closeCallback = () => ref.close();

        return ref;
    }
}
