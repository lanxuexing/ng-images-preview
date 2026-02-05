import { Injectable, Renderer2, RendererFactory2, PLATFORM_ID, ComponentRef, ApplicationRef, EmbeddedViewRef, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Manages overlay interactions including DOM attachment, scroll blocking, and focus trapping.
 * This service provides a lightweight alternative to CDK Overlay for the image preview.
 */
@Injectable({
    providedIn: 'root'
})
export class OverlayManager {
    private rendererFactory = inject(RendererFactory2);
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);
    private renderer: Renderer2;
    private scrollBlocked = false;
    private originalPadding = '';
    private originalOverflow = '';

    constructor() {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    /**
     * Blocks the body scroll to prevent background scrolling while the overlay is open.
     * Calculates the scrollbar width and adds padding to the body to prevent layout shifts.
     */
    blockScroll(): void {
        if (!isPlatformBrowser(this.platformId) || this.scrollBlocked) return;

        const body = this.document.body;
        const scrollBarWidth = window.innerWidth - this.document.documentElement.clientWidth;

        this.originalPadding = body.style.paddingRight;
        this.originalOverflow = body.style.overflow;

        if (scrollBarWidth > 0) {
            this.renderer.setStyle(body, 'padding-right', `${scrollBarWidth}px`);
        }
        this.renderer.setStyle(body, 'overflow', 'hidden');
        this.scrollBlocked = true;
    }

    /**
     * Unblocks the body scroll and restores the original padding.
     * Should be called when the overlay is closed.
     */
    unblockScroll(): void {
        if (!isPlatformBrowser(this.platformId) || !this.scrollBlocked) return;

        const body = this.document.body;

        this.renderer.setStyle(body, 'padding-right', this.originalPadding);
        this.renderer.setStyle(body, 'overflow', this.originalOverflow);


        this.scrollBlocked = false;
    }

    /**
     * Attaches a component to the application body.
     * @param componentRef The component reference to attach.
     * @param appRef The application reference (needed to attach the view).
     */
    attach(componentRef: ComponentRef<unknown>, appRef: ApplicationRef): void {
        if (!isPlatformBrowser(this.platformId)) return;

        appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
        this.renderer.appendChild(this.document.body, domElem);
    }

    /**
     * Detaches and destroys a component from the application.
     * @param componentRef The component reference to detach.
     * @param appRef The application reference.
     */
    detach(componentRef: ComponentRef<unknown>, appRef: ApplicationRef): void {
        if (!isPlatformBrowser(this.platformId)) return;

        appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }

    /**
     * Creates a keyboard event handler that traps focus within the specified element.
     * Handles Tab and Shift+Tab to cycle focus between the first and last focusable elements.
     * @param element The container element to trap focus within.
     * @returns A function to handle 'keydown' events.
     */
    trapFocus(element: HTMLElement): (event: KeyboardEvent) => void {
        const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

        return (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                const focusableElements = Array.from(element.querySelectorAll(focusableElementsString)) as HTMLElement[];
                const firstTabStop = focusableElements[0];
                const lastTabStop = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstTabStop) {
                        event.preventDefault();
                        lastTabStop.focus();
                    }
                } else {
                    if (document.activeElement === lastTabStop) {
                        event.preventDefault();
                        firstTabStop.focus();
                    }
                }
            }
        };
    }
}
