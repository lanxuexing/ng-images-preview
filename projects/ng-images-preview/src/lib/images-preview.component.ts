import {
    Component,
    ElementRef,
    HostListener,
    computed,
    input,
    signal,
    viewChildren,
    ChangeDetectionStrategy,
    TemplateRef,
    inject,
    effect,
    PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PREVIEW_ICONS } from './icons';
import { OverlayManager } from './utils/overlay-manager';

/**
 * Represents the internal state of the image preview.
 * Exposed to custom templates.
 */
export interface ImagesPreviewState {
    /** Current image source URL */
    src: string;
    /** Current zoom scale (1 = 100%) */
    scale: number;
    /** Current rotation in degrees */
    rotate: number;
    /** Whether the image is flipped horizontally */
    flipH: boolean;
    /** Whether the image is flipped vertically */
    flipV: boolean;
    /** Whether the current image is loading */
    isLoading: boolean;
    /** Whether the current image failed to load */
    hasError: boolean;
    /** Index of the current image in the list */
    currentIndex: number;
    /** Total number of images */
    total: number;
}

/**
 * Actions available to control the preview from a custom template.
 */
export interface ImagesPreviewActions {
    /** Zooms the current image in by a fixed step */
    zoomIn: () => void;
    /** Zooms the current image out by a fixed step */
    zoomOut: () => void;
    /** Rotates the current image 90 degrees counter-clockwise */
    rotateLeft: () => void;
    /** Rotates the current image 90 degrees clockwise */
    rotateRight: () => void;
    /** Flips the current image horizontally */
    flipHorizontal: () => void;
    /** Flips the current image vertically */
    flipVertical: () => void;
    /** Resets the current image's zoom, rotation, and flip state to default */
    reset: () => void;
    /** Closes the image preview overlay */
    close: () => void;
    /** Navigates to the next image in the gallery (if any) */
    next: () => void;
    /** Navigates to the previous image in the gallery (if any) */
    prev: () => void;
    /**
     * Jumps to a specific image index in the gallery.
     * @param index The 0-based index of the image to display.
     */
    jumpTo: (index: number) => void;
}

/**
 * Configuration for the toolbar.
 */
/**
 * Configuration for the toolbar visibility options.
 */
export interface ToolbarConfig {
    /** Show zoom buttons (+ / -) */
    showZoom?: boolean;
    /** Show rotate buttons */
    showRotate?: boolean;
    /** Show flip buttons */
    showFlip?: boolean;
}

/**
 * Context passed to the custom template.
 */
/**
 * Context passed to the custom template.
 */
export interface ImagesPreviewContext {
    /** The current state of the preview */
    $implicit: ImagesPreviewState;
    /** Actions to control the preview */
    actions: ImagesPreviewActions;
}

interface TrackingPoint {
    x: number;
    y: number;
    time: number;
}

interface ImageBufferItem {
    src: string | TemplateRef<unknown>;
    index: number;
    offset: number; // -1 (prev), 0 (curr), 1 (next)
    srcset?: string;
}

/**
 * Image Preview Overlay Component.
 * Displays images in a full-screen overlay with zoom, rotate, and pan capabilities.
 */
@Component({
    selector: 'ng-images-preview',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
      class="overlay"
      [@fadeInOut]
      (click)="close()"
      (keydown)="onOverlayKey($event)"
      tabindex="0"
      role="button"
      aria-label="Close preview overlay"
      [style.background-color]="overlayBackground()"
    >
      <!-- Custom Template Support -->
      @if (customTemplate(); as template) {
        <ng-container
          *ngTemplateOutlet="template; context: { $implicit: state(), actions: actions }"
        ></ng-container>
      } @else {
        <!-- Loading -->
        @if (!loadedImages().has(src()) && !hasError()) {
          <div class="loader">Loading...</div>
        }

        <!-- Error -->
        @if (hasError()) {
          <div class="error">Failed to load image</div>
        }

        <!-- Image Container -->
        <div
          class="image-container"
          (keydown)="onContainerKey($event)"
          (touchstart)="onTouchStart($event)"
          tabindex="-1"
        >
          @for (item of activeBuffer(); track item.index) {
            @if (isTemplate(item.src)) {
                <div
                    class="preview-image custom-content"
                    [class.opacity-0]="item.offset === 0 && !isLoaded(item.index)"
                    [class.dragging]="isDragging()"
                    [class.inertia]="isInertia()"
                    [class.flipping]="flipTransform() !== ''"
                    [class.pinching]="isPinching()"
                    [class.zoom-in]="scale() === 1"
                    [class.zoom-out]="scale() > 1"
                    [class.hidden]="item.offset !== 0 && scale() > 1"
                    [style.transform]="getTransform(item.offset)"
                    (mousedown)="onMouseDown($event)"
                    (click)="$event.stopPropagation()"
                    (keydown.enter)="$event.stopPropagation()"
                    tabindex="-1"
                >
                    <ng-container *ngTemplateOutlet="item.src; context: { $implicit: item }"></ng-container>
                </div>
            } @else {
                <img
                #imgRef
                [src]="item.src"
                [srcset]="item.srcset || ''"
                [class.opacity-0]="item.offset === 0 && (!loadedImages().has(asString(item.src)) || hasError())"
                class="preview-image"
                [class.dragging]="isDragging()"
                [class.inertia]="isInertia()"
                [class.flipping]="flipTransform() !== ''"
                (load)="onImageLoad(asString(item.src))"
                (error)="onImageError(asString(item.src))"
                (mousedown)="onMouseDown($event)"
                (click)="$event.stopPropagation()"
                (keydown.enter)="$event.stopPropagation()"
                tabindex="-1"
                [class.pinching]="isPinching()"
                [class.zoom-in]="scale() === 1"
                [class.zoom-out]="scale() > 1"
                [class.hidden]="item.offset !== 0 && scale() > 1"
                [style.transform]="getTransform(item.offset)"
                (load)="onImageLoad(asString(item.src))"
                (error)="onImageError(asString(item.src))"
                (mousedown)="onMouseDown($event)"
                (click)="$event.stopPropagation()"
                draggable="false"
                alt="Preview"
                />
            }
          }
        </div>

        <!-- Close Button -->
        <button class="close-btn" (click)="close()" aria-label="Close preview" [innerHTML]="icons.close">
        </button>

        <!-- Navigation Arrows -->
        @if (showNavigation() && images() && images()!.length > 1) {
          <!-- Check if not first -->
          @if (currentIndex() > 0) {
            <button
              class="nav-btn prev"
              (click)="prev(); $event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
              aria-label="Previous image"
              [innerHTML]="icons.prev"
            >
            </button>
          }
          <!-- Check if not last -->
          @if (currentIndex() < images()!.length - 1) {
            <button
              class="nav-btn next"
              (click)="next(); $event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
              aria-label="Next image"
              [innerHTML]="icons.next"
            >
            </button>
          }
        }

        <!-- Counter -->
        @if (showCounter() && images() && images()!.length > 1) {
          <div class="counter">{{ currentIndex() + 1 }} / {{ images()!.length }}</div>
        }

        <!-- Toolbar -->
        <!-- Toolbar -->
        @if (showToolbar()) {
        <div
          class="toolbar"
          (click)="$event.stopPropagation()"
          (keydown)="onToolbarKey($event)"
          tabindex="0"
        >
          <!-- Flip -->
          @if (toolbarConfig().showFlip) {
            <button class="toolbar-btn" (click)="flipHorizontal()" aria-label="Flip Horizontal" [innerHTML]="icons.flipH">
            </button>
            <button class="toolbar-btn" (click)="flipVertical()" aria-label="Flip Vertical" [innerHTML]="icons.flipV">
            </button>
          }
          
          <!-- Extensions (Custom Buttons) -->
          @if (toolbarExtensions()) {
            <ng-container *ngTemplateOutlet="toolbarExtensions(); context: { $implicit: images()![currentIndex()] }"></ng-container>
          }
          <!-- Rotate -->
          @if (toolbarConfig().showRotate) {
            <button class="toolbar-btn" (click)="rotateLeft()" aria-label="Rotate Left" [innerHTML]="icons.rotateLeft">
            </button>
            <button class="toolbar-btn" (click)="rotateRight()" aria-label="Rotate Right" [innerHTML]="icons.rotateRight">
            </button>
          }
          <!-- Zoom -->
          @if (toolbarConfig().showZoom) {
            <button class="toolbar-btn" (click)="zoomOut()" aria-label="Zoom Out" [innerHTML]="icons.zoomOut">
            </button>
            <button class="toolbar-btn" (click)="zoomIn()" aria-label="Zoom In" [innerHTML]="icons.zoomIn">
            </button>
          }
        </div>
        }
      }
      
      <!-- Thumbnails -->
      @if (images() && images()!.length > 1 && showThumbnails()) {
        <div class="thumbnail-strip" (click)="$event.stopPropagation()" (keydown.enter)="$event.stopPropagation()" tabindex="-1">
            @for (img of images(); track img; let i = $index) {
                <div 
                    #thumbRef
                    class="thumbnail-item" 
                    [class.active]="i === currentIndex()"
                    (click)="jumpTo(i)"
                    (keydown.enter)="jumpTo(i)"
                    tabindex="0"
                >
                    @if (isTemplate(img)) {
                        <div class="w-full h-full flex items-center justify-center bg-white/10 text-white/50">
                            <!-- Template Icon -->
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                        </div>
                    } @else {
                        <img [src]="img" loading="lazy" alt="Thumbnail">
                    }
                </div>
            }
        </div>
      }
    </div>
  `,
    styleUrls: ['./images-preview.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('200ms ease-out', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('300ms cubic-bezier(0.4, 0, 1, 1)', style({ opacity: 0 })),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(document:mouseup)': 'onMouseUp()',
        '(document:touchmove)': 'onTouchMove($event)',
        '(document:touchend)': 'onTouchEnd($event)',
        '(document:keydown.arrowleft)': 'prev()',
        '(document:keydown.arrowright)': 'next()',
        '(document:keydown.escape)': 'close()',
    },
})
export class ImagesPreviewComponent {
    private isClosing = signal(false);
    /**
     * The image source to display.
     * @required
     */
    src = input.required<string>();

    /**
     * List of image URLs for gallery navigation.
     * If not provided, only the single `src` image is shown.
     */
    /**
     * List of image URLs or Templates for gallery navigation.
     * If not provided, only the single `src` image is shown.
     */
    images = input<(string | TemplateRef<unknown>)[]>();

    /**
     * Optional srcset for the single image `src`.
     */
    srcset = input<string>();

    /**
     * List of srcsets corresponding to the `images` array.
     * Must be 1:1 mapped with `images`.
     */
    srcsets = input<string[]>();

    /**
     * Initial index for gallery navigation.
     * @default 0
     */
    initialIndex = input(0);

    /**
     * DOMRect of the element that opened the preview.
     * Used for FLIP animation calculation.
     */
    openerRect = input<DOMRect | undefined>(undefined);

    /**
     * Custom template to render instead of the default viewer.
     * Exposes `ImagesPreviewContext`.
     */
    customTemplate = input<TemplateRef<ImagesPreviewContext>>();

    /**
     * Configuration for the toolbar buttons.
     */
    toolbarConfig = input<ToolbarConfig>({
        showZoom: true,
        showRotate: true,
        showFlip: true,
    });

    /**
     * Callback function called when the preview is closed.
     */
    closeCallback: () => void = () => {
        /* noop */
    };

    imgRefs = viewChildren<ElementRef<HTMLImageElement>>('imgRef');

    thumbRefs = viewChildren<ElementRef<HTMLElement>>('thumbRef');

    // State signals
    currentIndex = signal(0);
    // isLoading = signal(true); // Replaced by per-image tracking
    hasError = signal(false);

    // Track loaded state for each image source
    loadedImages = signal<Set<string>>(new Set());

    /**
     * Whether to show next/prev navigation arrows.
     * @default true
     */
    showNavigation = input(true);

    /**
     * Whether to show the image counter (e.g. "1 / 5").
     * @default true
     */
    showCounter = input(true);

    /**
     * Whether to show the thumbnail strip at the bottom.
     * @default true
     */
    showThumbnails = input(true);

    /**
     * Whether to show the toolbar actions.
     * @default true
     */
    showToolbar = input(true);

    /**
     * Custom template to extend the toolbar with additional buttons.
     */
    toolbarExtensions = input<TemplateRef<unknown> | null>(null);

    activeBuffer = computed<ImageBufferItem[]>(() => {
        const imgs = this.images();
        const srcsets = this.srcsets();
        const current = this.currentIndex();

        // Single image or fallback
        if (!imgs || imgs.length === 0) {
            return [{ src: this.src(), index: 0, offset: 0, srcset: this.srcset() }];
        }

        const buffer: ImageBufferItem[] = [];
        const total = imgs.length;

        // Helper to get srcset safely
        const getSrcset = (i: number) => (srcsets && srcsets[i]) ? srcsets[i] : undefined;

        // Prev (-1)
        if (current > 0) {
            buffer.push({
                src: imgs[current - 1],
                index: current - 1,
                offset: -1,
                srcset: getSrcset(current - 1)
            });
        }

        // Current (0)
        buffer.push({
            src: imgs[current],
            index: current,
            offset: 0,
            srcset: getSrcset(current)
        });

        // Next (+1)
        if (current < total - 1) {
            buffer.push({
                src: imgs[current + 1],
                index: current + 1,
                offset: 1,
                srcset: getSrcset(current + 1)
            });
        }

        return buffer;
    });

    private platformId = inject(PLATFORM_ID);
    private sanitizer = inject(DomSanitizer);
    private el = inject(ElementRef);
    private overlayManager = inject(OverlayManager);

    // Icons map with SafeHtml
    icons: { [key in keyof typeof PREVIEW_ICONS]: SafeHtml };

    constructor() {
        // Sanitize icons once
        this.icons = Object.keys(PREVIEW_ICONS).reduce((acc, key) => {
            acc[key as keyof typeof PREVIEW_ICONS] = this.sanitizer.bypassSecurityTrustHtml(
                PREVIEW_ICONS[key as keyof typeof PREVIEW_ICONS]
            );
            return acc;
        }, {} as { [key in keyof typeof PREVIEW_ICONS]: SafeHtml });


        // defined in class body usually, but here to show logical grouping
        effect(
            () => {
                // Initialize index from input
                this.currentIndex.set(this.initialIndex());
            },
            { allowSignalWrites: true },
        );

        effect(
            () => {
                // Reset state when index changes
                this.currentIndex();
                this.hasError.set(false);
                this.reset(); // Reset zoom/rotate
            },
            { allowSignalWrites: true },
        );

        // Preload next/prev images
        effect(() => {
            const index = this.currentIndex();
            const images = this.images();

            if (isPlatformBrowser(this.platformId) && images && images.length > 0) {
                const srcsets = this.srcsets();
                const getSrcset = (i: number) => (srcsets && srcsets[i]) ? srcsets[i] : undefined;

                // Next
                if (index < images.length - 1) {
                    const nextSrc = images[index + 1];
                    if (typeof nextSrc === 'string') {
                        const img = new Image();
                        const s = getSrcset(index + 1);
                        if (s) img.srcset = s;
                        img.src = nextSrc;
                    }
                }
                // Prev
                if (index > 0) {
                    const prevSrc = images[index - 1];
                    if (typeof prevSrc === 'string') {
                        const img = new Image();
                        const s = getSrcset(index - 1);
                        if (s) img.srcset = s;
                        img.src = prevSrc;
                    }
                }
            }
        });

        effect(() => {
            // Handle FLIP on open
            const opener = this.openerRect();
            if (opener && !this.flipAnimDone) {
                // Defer to let the view render so we know final position
                setTimeout(() => this.runFlipAnimation(opener));
            }
        });

        // Auto-scroll thumbnails
        effect(() => {
            const index = this.currentIndex();
            const show = this.showThumbnails();
            const refs = this.thumbRefs();

            if (show && refs && refs[index]) {
                const el = refs[index].nativeElement;
                const container = el.parentElement;

                if (container) {
                    const scrollLeft = el.offsetLeft + el.offsetWidth / 2 - container.offsetWidth / 2;
                    container.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    private flipAnimDone = false;

    scale = signal(1);
    translateX = signal(0);
    translateY = signal(0);
    rotate = signal(0);
    flipH = signal(false);
    flipV = signal(false);

    isDragging = signal(false);
    isInertia = signal(false);

    // Touch state
    private initialPinchDistance = 0;
    private initialScale = 1;
    isPinching = signal(false);

    // Computed state object for template
    state = computed<ImagesPreviewState>(() => ({
        src: this.src(),
        scale: this.scale(),
        rotate: this.rotate(),
        flipH: this.flipH(),
        flipV: this.flipV(),
        isLoading: !this.loadedImages().has(this.src() || '') && !this.hasError(),
        hasError: this.hasError(),
        currentIndex: this.currentIndex(),
        total: this.images()?.length ?? 1,
    }));

    // Actions object for template
    actions: ImagesPreviewActions = {
        zoomIn: () => this.zoomIn(),
        zoomOut: () => this.zoomOut(),
        rotateLeft: () => this.rotateLeft(),
        rotateRight: () => this.rotateRight(),
        flipHorizontal: () => this.flipHorizontal(),
        flipVertical: () => this.flipVertical(),
        reset: () => this.reset(),
        close: () => this.close(),
        next: () => this.next(),
        prev: () => this.prev(),
        jumpTo: (index: number) => this.jumpTo(index),
    };

    private readonly MIN_SCALE = 0.5;
    private readonly MAX_SCALE = 5;
    private readonly ZOOM_STEP = 0.5;

    private startX = 0;
    private startY = 0;
    private lastTranslateX = 0;
    private lastTranslateY = 0;

    // Physics state
    private velocityX = 0;
    private velocityY = 0;
    private touchHistory: TrackingPoint[] = [];
    private cachedConstraints: { maxX: number; maxY: number } | null = null;
    private lastTimestamp = 0;
    private rafId: number | null = null;
    private readonly FRICTION = 0.95; // Super smooth glide
    private readonly VELOCITY_THRESHOLD = 0.01;
    private readonly MAX_VELOCITY = 3; // Cap speed to prevent teleporting

    /**
     * Gesture Locking: 'horizontal' (Swipe) or 'vertical' (Pull-to-Close)
     */
    private lockDirection = signal<'horizontal' | 'vertical' | null>(null);

    // Updated transform logic for slide buffer
    getTransform(offset: number) {
        if (!isPlatformBrowser(this.platformId)) {
            return `translate3d(${offset * 100}%, 0, 0)`;
        }
        const viewportWidth = window.innerWidth;
        const spacing = 16; // Gap between images
        const baseOffset = offset * (viewportWidth + spacing);

        // Global translateX applies to the whole "track"
        const x = this.translateX() + baseOffset;

        // --- Physics State ---
        const y = this.translateY();
        const scale = this.scale();
        const rotate = this.rotate();
        const flipH = offset === 0 ? this.flipH() : false;
        const flipV = offset === 0 ? this.flipV() : false;

        let effectiveY = offset === 0 ? y : 0;
        let effectiveScale = offset === 0 ? scale : 1;
        const effectiveRotate = offset === 0 ? rotate : 0;

        // --- Premium: Interactive Shrink & Elastic Drag Feel ---
        if (offset === 0 && scale === 1 && (Math.abs(y) > 0 || this.isClosing())) {
            // 1. Liquid Shrink: more aggressive divisor of 350
            const distance = this.isClosing() ? 350 : Math.abs(y);
            const shrinkFactor = Math.max(this.isClosing() ? 0 : 0.65, 1 - distance / 350);
            effectiveScale *= shrinkFactor;

            // 2. Elastic Drag: the "hand feel" damping
            // We want the image to resist more as it's pulled further
            if (!this.isClosing()) {
                const absY = Math.abs(y);
                const sign = y > 0 ? 1 : -1;
                // High-fidelity formula for "liquid" stretch feel
                effectiveY = sign * (Math.pow(absY, 0.82) * 2.2);
            }
        }

        const scaleX = flipH ? -1 : 1;
        const scaleY = flipV ? -1 : 1;

        // FLIP override
        if (offset === 0) {
            const flip = this.flipTransform();
            if (flip) return flip;
        }

        // --- Visual Isolation: Hide neighbors during Vertical Pull OR Closing ---
        if ((this.lockDirection() === 'vertical' || this.isClosing()) && offset !== 0) {
            return `translate3d(${x}px, ${effectiveY}px, 0) scale(0)`;
        }

        return `translate3d(${x}px, ${effectiveY}px, 0) scale(${effectiveScale}) rotate(${effectiveRotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
    }

    // FLIP State
    protected flipTransform = signal('');

    // Helper to get current active image element
    private getCurrentImageElement(): HTMLImageElement | undefined {
        const buffer = this.activeBuffer();
        const index = buffer.findIndex((item) => item.offset === 0);
        if (index === -1) return undefined;
        return this.imgRefs()[index]?.nativeElement;
    }

    private runFlipAnimation(opener: DOMRect) {
        if (!isPlatformBrowser(this.platformId)) return;

        const imgEl = this.getCurrentImageElement();
        if (!imgEl) return;

        // 1. First: Final state is already rendered (centered, max fit)
        const finalRect = imgEl.getBoundingClientRect();

        // 2. Invert: Calculate scale and translate to match opener
        const scaleX = opener.width / finalRect.width;
        const scaleY = opener.height / finalRect.height;
        // Note: we use the larger scale to crop? 
        // Or fit? 
        // Usually we want to fit.
        // Let's matching fitting.

        // Actually, most simple FLIP matches dimensions exactly.
        // But aspect ratios might differ.
        // Let's just match the rect exactly.

        const deltaX = opener.left - finalRect.left + (opener.width - finalRect.width) / 2;
        const deltaY = opener.top - finalRect.top + (opener.height - finalRect.height) / 2;

        // Apply Invert Transform immediately (no transition)
        imgEl.style.transition = 'none';
        this.flipTransform.set(`translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`);

        // Force Reflow
        // Force Reflow
        void imgEl.offsetHeight;

        // 3. Play
        requestAnimationFrame(() => {
            // Enable transition: Fluid Apple-style curve
            imgEl.style.transition = 'transform 450ms cubic-bezier(0.2, 0.9, 0.42, 1)';
            // Remove override (animates to Final)
            this.flipTransform.set('');
            this.flipAnimDone = true;

            // CLEANUP: Remove transition after animation wraps up so dragging/panning is instant
            setTimeout(() => {
                imgEl.style.transition = '';
            }, 450);
        });
    }

    overlayBackground = computed(() => {
        const y = Math.abs(this.translateY());
        const scale = this.scale();
        if (scale === 1 && y > 0) {
            // More aggressive fade to match 500 divisor
            const opacity = Math.max(0, 0.95 - y / 350);
            return `rgba(0, 0, 0, ${opacity})`;
        }
        return 'var(--ng-img-background)';
    });

    @HostListener('document:keydown.escape')
    onEscape() {
        this.close();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isDragging()) return;
        event.preventDefault();

        const deltaX = event.clientX - this.startX;
        const deltaY = event.clientY - this.startY;

        // Track history for velocity
        this.touchHistory.push({
            x: event.clientX,
            y: event.clientY,
            time: Date.now(),
        });
        if (this.touchHistory.length > 20) this.touchHistory.shift();

        const scale = this.scale();
        if (scale === 1) {
            // Direction Locking for Mouse
            if (this.lockDirection() === null) {
                const diffX = Math.abs(deltaX);
                const diffY = Math.abs(deltaY);
                if (diffX > 10 || diffY > 10) {
                    this.lockDirection.set(diffY > diffX * 1.2 ? 'vertical' : 'horizontal');
                }
            }
        }

        const nextX = this.lastTranslateX + deltaX;
        const nextY = this.lastTranslateY + deltaY;

        // Apply strict clamping during move
        this.applyMoveConstraints(nextX, nextY);
    }

    private applyMoveConstraints(nextX: number, nextY: number) {
        if (!isPlatformBrowser(this.platformId)) {
            this.translateX.set(nextX);
            this.translateY.set(nextY);
            return;
        }

        const img = this.getCurrentImageElement();
        if (!img) {
            this.translateX.set(nextX);
            this.translateY.set(nextY);
            return;
        }

        const scale = this.scale();

        // If scale is 1, we allow free movement for Pull-to-Close and Swipe Nav
        if (scale === 1) {
            let finalX = nextX;
            let finalY = nextY;

            if (this.lockDirection() === 'vertical') {
                finalX = 0;
            } else if (this.lockDirection() === 'horizontal') {
                finalY = 0;
            } else {
                // If not locked yet, keep them at 0 to avoid jitter/peeping
                finalX = 0;
                finalY = 0;
            }

            this.translateX.set(finalX);
            this.translateY.set(finalY);
            return;
        }

        const rotate = Math.abs(this.rotate() % 180);
        const isRotated = rotate === 90;

        const baseWidth = img.offsetWidth;
        const baseHeight = img.offsetHeight;

        const currentWidth = (isRotated ? baseHeight : baseWidth) * scale;
        const currentHeight = (isRotated ? baseWidth : baseHeight) * scale;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxTranslateX = Math.max(0, (currentWidth - viewportWidth) / 2);
        const maxTranslateY = Math.max(0, (currentHeight - viewportHeight) / 2);

        // Clamp
        const clampedX = Math.max(-maxTranslateX, Math.min(maxTranslateX, nextX));
        const clampedY = Math.max(-maxTranslateY, Math.min(maxTranslateY, nextY));

        this.translateX.set(clampedX);
        this.translateY.set(clampedY);
    }

    onTouchMove(event: TouchEvent) {
        if (!this.isDragging() && !this.isPinching()) return;

        // Prevent default to stop page scrolling/zooming
        if (event.cancelable) {
            event.preventDefault();
        }

        const touches = event.touches;

        // One finger: Pan
        if (touches.length === 1 && this.isDragging() && !this.isPinching()) {
            const now = Date.now();

            // Add point to history
            this.touchHistory.push({
                x: touches[0].clientX,
                y: touches[0].clientY,
                time: now,
            });

            // Prune history (keep last 100ms)
            const cutoff = now - 100;
            while (this.touchHistory.length > 0 && this.touchHistory[0].time < cutoff) {
                this.touchHistory.shift();
            }

            const deltaX = touches[0].clientX - this.lastTouchX;
            const deltaY = touches[0].clientY - this.lastTouchY;

            // Note: We do NOT calculate velocity here anymore to avoid noise.
            // We verify velocity at TouchEnd using history.

            const currentX = this.translateX();
            const currentY = this.translateY();

            let nextX = currentX + deltaX;
            let nextY = currentY + deltaY;

            // Apply rubber banding if out of bounds
            // Use cached constraints to avoid reflows
            const constraints = this.cachedConstraints || this.getConstraints();

            if (this.scale() === 1) {
                // --- Direction Locking & Isolation ---
                if (this.lockDirection() === null) {
                    const startTouch = this.touchHistory[0];
                    if (startTouch) {
                        const diffX = Math.abs(touches[0].clientX - startTouch.x);
                        const diffY = Math.abs(touches[0].clientY - startTouch.y);
                        if (diffX > 10 || diffY > 10) {
                            this.lockDirection.set(diffY > diffX * 1.2 ? 'vertical' : 'horizontal');
                        }
                    }
                }

                if (this.lockDirection() === 'vertical') {
                    // Pull to Close: Lock X to 0 to prevent neighbor "peeping"
                    nextX = 0;
                } else if (this.lockDirection() === 'horizontal') {
                    // Swipe Nav: Lock Y to 0 for stable sliding
                    nextY = 0;
                }
                // If null (threshold not met), allow free movement? 
                // No, better to keep them 0 until intent is clear
                if (this.lockDirection() === null) {
                    nextX = 0;
                    nextY = 0;
                }
            } else {
                // Rubber banding for zoomed pan
                if (nextX > constraints.maxX) {
                    nextX = constraints.maxX + (nextX - constraints.maxX) * 0.5;
                } else if (nextX < -constraints.maxX) {
                    nextX = -constraints.maxX + (nextX + constraints.maxX) * 0.5;
                }

                if (nextY > constraints.maxY) {
                    nextY = constraints.maxY + (nextY - constraints.maxY) * 0.5;
                } else if (nextY < -constraints.maxY) {
                    nextY = -constraints.maxY + (nextY + constraints.maxY) * 0.5;
                }
            }

            this.translateX.set(nextX);
            this.translateY.set(nextY);

            this.lastTouchX = touches[0].clientX;
            this.lastTouchY = touches[0].clientY;
        }

        // Two fingers: Pinch Zoom
        if (touches.length === 2 && this.initialPinchDistance > 0) {
            const distance = this.getDistance(touches);
            const scaleFactor = distance / this.initialPinchDistance;

            // Calculate new scale with limits
            const rawNewScale = this.initialScale * scaleFactor;
            const newScale = Math.min(Math.max(rawNewScale, this.MIN_SCALE), this.MAX_SCALE);

            // Calculate new translation to keep focal point fixed
            const effectiveRatio = newScale / this.initialScale;
            const currentCenter = this.getCenter(touches);
            const cx = currentCenter.x - window.innerWidth / 2;
            const cy = currentCenter.y - window.innerHeight / 2;

            const sx = this.initialPinchCenter.x - window.innerWidth / 2;
            const sy = this.initialPinchCenter.y - window.innerHeight / 2;

            let newTx = cx - (sx - this.initialTranslateX) * effectiveRatio;
            let newTy = cy - (sy - this.initialTranslateY) * effectiveRatio;

            // --- Clamp Logic (Inline for atomicity) ---
            const img = this.getCurrentImageElement();
            if (img) {
                const rotate = Math.abs(this.rotate() % 180);
                const isRotated = rotate === 90;
                const baseWidth = img.offsetWidth;
                const baseHeight = img.offsetHeight;

                const currentWidth = (isRotated ? baseHeight : baseWidth) * newScale;
                const currentHeight = (isRotated ? baseWidth : baseHeight) * newScale;

                const maxTx = Math.max(0, (currentWidth - window.innerWidth) / 2);
                const maxTy = Math.max(0, (currentHeight - window.innerHeight) / 2);

                if (currentWidth <= window.innerWidth) newTx = 0;
                else if (Math.abs(newTx) > maxTx) newTx = Math.sign(newTx) * maxTx;

                if (currentHeight <= window.innerHeight) newTy = 0;
                else if (Math.abs(newTy) > maxTy) newTy = Math.sign(newTy) * maxTy;
            }

            this.scale.set(newScale);
            this.translateX.set(newTx);
            this.translateY.set(newTy);
        }
    }

    private getConstraints() {
        // If we have a valid cache during interaction, use it to avoid reflows
        // The instruction says: "So `getConstraints` stays as is (calculates fresh)."
        // So, this method should always calculate fresh.
        // The `cachedConstraints` property is used *outside* this method.

        if (!isPlatformBrowser(this.platformId)) return { maxX: 0, maxY: 0 };

        const img = this.getCurrentImageElement();
        if (!img) return { maxX: 0, maxY: 0 };

        const scale = this.scale();
        const rotate = Math.abs(this.rotate() % 180);
        const isRotated = rotate === 90;

        const baseWidth = img.offsetWidth;
        const baseHeight = img.offsetHeight;

        const currentWidth = (isRotated ? baseHeight : baseWidth) * scale;
        const currentHeight = (isRotated ? baseWidth : baseHeight) * scale;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        return {
            maxX: Math.max(0, (currentWidth - viewportWidth) / 2),
            maxY: Math.max(0, (currentHeight - viewportHeight) / 2),
        };
    }

    private clampPosition() {
        if (!isPlatformBrowser(this.platformId)) return;

        const img = this.getCurrentImageElement();
        if (!img) return;

        const scale = this.scale();
        const rotate = Math.abs(this.rotate() % 180);
        const isRotated = rotate === 90;

        const baseWidth = img.offsetWidth;
        const baseHeight = img.offsetHeight;

        // Effective dimensions after rotation
        const currentWidth = (isRotated ? baseHeight : baseWidth) * scale;
        const currentHeight = (isRotated ? baseWidth : baseHeight) * scale;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxTranslateX = Math.max(0, (currentWidth - viewportWidth) / 2);
        const maxTranslateY = Math.max(0, (currentHeight - viewportHeight) / 2);

        // Clamp logic
        const currentX = this.translateX();
        const currentY = this.translateY();

        let newX = currentX;
        let newY = currentY;

        if (Math.abs(currentX) > maxTranslateX) {
            newX = Math.sign(currentX) * maxTranslateX;
        }
        if (Math.abs(currentY) > maxTranslateY) {
            newY = Math.sign(currentY) * maxTranslateY;
        }

        // If image is smaller than viewport, force center (0)
        if (currentWidth <= viewportWidth) newX = 0;
        if (currentHeight <= viewportHeight) newY = 0;

        if (newX !== currentX) this.translateX.set(newX);
        if (newY !== currentY) this.translateY.set(newY);
    }

    private startInertia() {
        this.isInertia.set(true); // Disable CSS transition
        let lastTime = Date.now();

        const step = () => {
            if (
                !this.isDragging() &&
                (Math.abs(this.velocityX) > this.VELOCITY_THRESHOLD ||
                    Math.abs(this.velocityY) > this.VELOCITY_THRESHOLD)
            ) {
                const now = Date.now();
                const dt = Math.min(now - lastTime, 64); // Cap dt to avoid huge jumps if lag
                lastTime = now;

                if (dt === 0) {
                    this.rafId = requestAnimationFrame(step);
                    return;
                }

                // Clamp max velocity (just in case)
                this.velocityX = Math.max(-this.MAX_VELOCITY, Math.min(this.MAX_VELOCITY, this.velocityX));
                this.velocityY = Math.max(-this.MAX_VELOCITY, Math.min(this.MAX_VELOCITY, this.velocityY));

                // Time-based friction
                const frictionFactor = Math.pow(this.FRICTION, dt / 16);

                this.velocityX *= frictionFactor;
                this.velocityY *= frictionFactor;

                let nextX = this.translateX() + this.velocityX * dt;
                let nextY = this.translateY() + this.velocityY * dt;

                // Check bounds during inertia
                const constraints = this.cachedConstraints || this.getConstraints();

                if (nextX > constraints.maxX) {
                    nextX = constraints.maxX;
                    this.velocityX = 0;
                } else if (nextX < -constraints.maxX) {
                    nextX = -constraints.maxX;
                    this.velocityX = 0;
                }

                if (nextY > constraints.maxY) {
                    nextY = constraints.maxY;
                    this.velocityY = 0;
                } else if (nextY < -constraints.maxY) {
                    nextY = -constraints.maxY;
                    this.velocityY = 0;
                }

                this.translateX.set(nextX);
                this.translateY.set(nextY);

                this.rafId = requestAnimationFrame(step);
            } else {
                this.stopInertia();
            }
        };
        this.rafId = requestAnimationFrame(step);
    }

    private stopInertia() {
        this.isInertia.set(false); // Re-enable CSS transition
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    private snapBack() {
        const constraints = this.cachedConstraints || this.getConstraints();
        const currentX = this.translateX();
        const currentY = this.translateY();

        let targetX = currentX;
        let targetY = currentY;

        if (currentX > constraints.maxX) targetX = constraints.maxX;
        if (currentX < -constraints.maxX) targetX = -constraints.maxX;
        if (currentY > constraints.maxY) targetY = constraints.maxY;
        if (currentY < -constraints.maxY) targetY = -constraints.maxY;

        if (targetX !== currentX || targetY !== currentY) {
            // Animate snap back? For now, we rely on CSS transition if not dragging
            // But we turned off transition for .dragging.
            // We need to ensure .dragging is removed (it is in onTouchEnd).
            // CSS transition handles the snap if we just set the value.
            this.translateX.set(targetX);
            this.translateY.set(targetY);
        }
    }

    onToolbarKey(event: KeyboardEvent) {
        event.stopPropagation();
    }

    onOverlayKey(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            this.close();
        }

        // Trap Focus
        const trapHandler = this.overlayManager.trapFocus(this.el.nativeElement);
        trapHandler(event);
    }

    onContainerKey(event: KeyboardEvent) {
        // Prevent closing when interacting with image container via keyboard if needed
        event.stopPropagation();
    }

    onMouseUp() {
        if (!this.isDragging()) return;
        this.isDragging.set(false); // Reset first to enable CSS transitions

        // Check Pull to Close & Swipe for Mouse
        if (this.scale() === 1) {
            const x = this.translateX();
            const y = this.translateY();

            // Calculate Mouse Velocity
            let velocityX = 0;
            let velocityY = 0;
            if (this.touchHistory.length >= 2) {
                const last = this.touchHistory[this.touchHistory.length - 1];
                const first = this.touchHistory[0];
                const dt = (last.time - first.time) || 1;
                velocityX = (last.x - first.x) / dt;
                velocityY = (last.y - first.y) / dt;
            }

            // Sync global velocity for potential continuation
            this.velocityX = velocityX;
            this.velocityY = velocityY;

            // Only close if NOT locked to horizontal
            if (this.lockDirection() !== 'horizontal' && (Math.abs(y) > 100 || Math.abs(velocityY) > 0.5)) {
                this.isDragging.set(false);
                this.isClosing.set(true);

                // Flight animation
                const flyDistance = velocityY * 300 + (y > 0 ? 800 : -800);
                this.translateY.set(flyDistance);

                setTimeout(() => this.close(), 250);
                return;
            }

            // Swipe Navigation
            const threshold = window.innerWidth * 0.25;
            const images = this.images();
            const total = images ? images.length : 0;
            const index = this.currentIndex();

            if (x < -threshold) {
                // NEXT
                if (index < total - 1) {
                    this.animateSlide(-1);
                } else {
                    this.translateX.set(0);
                    this.translateY.set(0);
                }
                return;
            } else if (x > threshold) {
                // PREV
                if (index > 0) {
                    this.animateSlide(1);
                } else {
                    this.translateX.set(0);
                    this.translateY.set(0);
                }
                return;
            }

            // Snap back if not closed/swiped
            this.translateX.set(0);
            this.translateY.set(0);
        } else {
            // Inertia for zoomed mouse drag
            if (this.touchHistory.length >= 2) {
                const last = this.touchHistory[this.touchHistory.length - 1];
                const first = this.touchHistory[0];
                const dt = (last.time - first.time) || 1;
                this.velocityX = (last.x - first.x) / dt;
                this.velocityY = (last.y - first.y) / dt;
            } else {
                this.velocityX = 0;
                this.velocityY = 0;
            }
            this.startInertia();
        }
        this.lockDirection.set(null);
    }

    onTouchEnd(event: TouchEvent) {
        const touches = event.touches;
        if (touches.length === 0) {
            this.isDragging.set(false);

            // Calculate Release Velocity from History
            const now = Date.now();

            // Double Tap Detection
            if (this.touchHistory.length < 5 && (now - this.lastTapTime) < 300) {
                // Ensure last tap was close in position (within 30px)
                // We don't have last tap pos stored easily, but usually fast taps are consistent.
                // Let's assume valid double tap.
                const lastTouch = touches.length > 0 ? touches[0] : (event.changedTouches[0]);
                if (lastTouch) {
                    this.handleDoubleTap(lastTouch.clientX, lastTouch.clientY);
                    this.lastTapTime = 0; // Reset
                    return;
                }
            }
            this.lastTapTime = now;

            const lastPoint = this.touchHistory[this.touchHistory.length - 1];
            // We want a point from roughly 30-50ms ago to get "launch" direction,
            // but tracking last 100ms.
            // A simple approach: compare last point with oldest point in our (pruned) buffer.
            const oldestPoint = this.touchHistory[0];

            if (lastPoint && oldestPoint && lastPoint !== oldestPoint) {
                const dt = lastPoint.time - oldestPoint.time;
                if (dt > 0) {
                    this.velocityX = (lastPoint.x - oldestPoint.x) / dt;
                    this.velocityY = (lastPoint.y - oldestPoint.y) / dt;
                }
            } else {
                this.velocityX = 0;
                this.velocityY = 0;
            }

            this.isDragging.set(false);
            this.isPinching.set(false);
            this.initialPinchDistance = 0;

            // Swipe Navigation (at 1x scale)
            if (this.scale() === 1) {
                const x = this.translateX();
                const y = this.translateY();

                // Pull to Close (Distance > 100px OR Vertical Flick Velocity > 0.5 px/ms)
                // Skip if we are explicitly in horizontal swipe mode
                if (this.lockDirection() !== 'horizontal' && (Math.abs(y) > 100 || Math.abs(this.velocityY) > 0.5)) {
                    this.isDragging.set(false);
                    this.isClosing.set(true);

                    // Continue the "Flight" and shrink further
                    const flyDistance = this.velocityY * 300 + (y > 0 ? 500 : -500);
                    this.translateY.set(flyDistance);

                    setTimeout(() => this.close(), 250);
                    return;
                }

                const threshold = window.innerWidth * 0.25;
                const images = this.images();
                const total = images ? images.length : 0;
                const index = this.currentIndex();

                if (x < -threshold) {
                    // NEXT (Slide Left)
                    if (index < total - 1) {
                        this.animateSlide(-1);
                    } else {
                        this.translateX.set(0);
                        this.translateY.set(0);
                    }
                    return;
                } else if (x > threshold) {
                    // PREV (Slide Right)
                    if (index > 0) {
                        this.animateSlide(1);
                    } else {
                        this.translateX.set(0);
                        this.translateY.set(0);
                    }
                    return;
                }

                // Snap back
                this.translateX.set(0);
                this.translateY.set(0);
            } else {
                this.startInertia();
            }
            return;
        }

        else if (touches.length === 1 && this.isPinching()) {
            // Transition from pinch to pan
            this.isPinching.set(false);
            this.isDragging.set(true);
            this.lastTouchX = touches[0].clientX;
            this.lastTouchY = touches[0].clientY;
            // Reset velocity on transition
            this.velocityX = 0;
            this.velocityY = 0;
            this.lastTimestamp = Date.now();
            // Re-cache constraints for new pan interaction
            this.cachedConstraints = this.getConstraints();
        }
    }

    private lastTouchX = 0;
    private lastTouchY = 0;
    private lastTapTime = 0; // For double tap detection
    private initialPinchCenter = { x: 0, y: 0 };
    private initialTranslateX = 0;
    private initialTranslateY = 0;

    private handleDoubleTap(clientX: number, clientY: number) {
        if (this.scale() > 1) {
            // If already zoomed, zoom out to 1
            this.reset();
        } else {
            // Smart Zoom to 2.5x (or max)
            const targetScale = 2; // Nice comfortable zoom

            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            // Calculate shift needed to center the tapped point
            // Formula: - (tap - center) * (target / current - 1)
            // But since current is 1 and trans is 0, it simplifies.
            const centerX = viewportW / 2;
            const centerY = viewportH / 2;

            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;

            const newTransX = -deltaX * (targetScale - 1);
            const newTransY = -deltaY * (targetScale - 1);

            this.scale.set(targetScale);
            this.translateX.set(newTransX);
            this.translateY.set(newTransY);
        }
    }

    private getDistance(touches: TouchList): number {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY,
        );
    }

    private getCenter(touches: TouchList) {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2,
        };
    }

    close() {
        if (this.isClosing()) {
            this.closeCallback();
            return;
        }

        // If called via button/ESC, triggger short animation first
        this.isClosing.set(true);
        setTimeout(() => this.closeCallback(), 150);
    }

    onImageLoad(src: string) {
        this.loadedImages.update(set => {
            const newSet = new Set(set);
            newSet.add(src);
            return newSet;
        });
        this.hasError.set(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onImageError(_src: string) {
        // this.loadedImages.update... (maybe not mark as loaded? or separate error tracking)
        // For now, keep error simple
        this.hasError.set(true);
    }

    // Zoom
    zoomIn() {
        this.scale.update((s) => Math.min(s + this.ZOOM_STEP, this.MAX_SCALE));
        setTimeout(() => this.clampPosition());
        this.cachedConstraints = null; // Invalidate cache on zoom
    }

    zoomOut() {
        this.scale.update((s) => Math.max(s - this.ZOOM_STEP, this.MIN_SCALE));
        setTimeout(() => this.clampPosition());
        this.cachedConstraints = null; // Invalidate cache on zoom
    }

    // Rotate
    rotateLeft() {
        this.rotate.update((r) => r - 90);
        setTimeout(() => this.clampPosition());
        this.cachedConstraints = null; // Invalidate cache on rotate
    }

    rotateRight() {
        this.rotate.update((r) => r + 90);
        setTimeout(() => this.clampPosition());
        this.cachedConstraints = null; // Invalidate cache on rotate
    }

    // Flip
    flipHorizontal() {
        this.flipH.update((f) => !f);
        this.cachedConstraints = null; // Invalidate cache on flip
    }

    flipVertical() {
        this.flipV.update((f) => !f);
        this.cachedConstraints = null; // Invalidate cache on flip
    }

    // Helper for template type guard
    isTemplate(val: string | TemplateRef<unknown>): val is TemplateRef<unknown> {
        return val instanceof TemplateRef;
    }

    asString(val: string | TemplateRef<unknown>): string {
        return typeof val === 'string' ? val : '';
    }


    isLoaded(index: number): boolean {
        // For templates, we consider them loaded immediately (or manage their own loading)
        // For strings, we check loadedImages set
        const item = this.images()?.[index];
        if (!item) return false;
        if (this.isTemplate(item)) return true;
        return this.loadedImages().has(item as string);
    }

    reset() {
        this.scale.set(1);
        this.translateX.set(0);
        this.translateY.set(0);
        this.rotate.set(0);
        this.flipH.set(false);
        this.flipV.set(false);
        this.cachedConstraints = null; // Invalidate cache on reset
    }

    next() {
        const imgs = this.images();
        if (!imgs) return;
        if (this.currentIndex() < imgs.length - 1) {
            this.currentIndex.update((i) => i + 1);
        }
    }

    prev() {
        if (this.currentIndex() > 0) {
            this.currentIndex.update((i) => i - 1);
        }
    }

    jumpTo(index: number) {
        this.currentIndex.set(index);
        this.reset();
    }

    // Slide Animation
    private animateSlide(direction: -1 | 1) {
        const spacing = 16;
        const width = window.innerWidth + spacing;
        // direction -1 (Next) -> move to -width
        // direction 1 (Prev) -> move to width
        // Wait. If I swipe Left (Next), x is negative. Target should be -width.
        // If I swipe Right (Prev), x is positive. Target should be width.
        // So target = direction * width? No.
        // If direction is "Next" (index + 1), I want to slide to the Left (-X).
        // Let's pass the sign of movement explicitly.

        const target = direction === -1 ? -width : width;

        this.translateX.set(target);

        // Wait for CSS transition (0.4s)
        setTimeout(() => {
            // Update Index (silent swap)
            this.isInertia.set(true); // Disable transition

            if (direction === -1) this.next();
            else this.prev();

            this.translateX.set(0);

            // Re-enable transition
            setTimeout(() => {
                this.isInertia.set(false);
            }, 50);
        }, 400);
    }

    // Mouse Interaction
    onMouseDown(event: MouseEvent) {
        // Allow dragging even at scale 1 for Pull-to-Close and Swipe-like nav (if intended)
        if (this.isDragging()) return;

        // Only trigger on Left Click
        if (event.button !== 0) return;

        this.isDragging.set(true);
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.lastTranslateX = this.translateX();
        this.lastTranslateY = this.translateY();
        this.lockDirection.set(null);
        this.touchHistory = [{ x: event.clientX, y: event.clientY, time: Date.now() }];
        event.preventDefault();
    }

    // Touch Interaction (bound in template)
    onTouchStart(event: TouchEvent) {
        this.stopInertia(); // Cancel any ongoing movement

        // if (event.cancelable) event.preventDefault(); // Removed to restore Tap-to-Close (click events)
        // touch-action: none in CSS handles scroll prevention.

        const touches = event.touches;

        if (touches.length === 1) {
            // Single touch: Pan.
            // Allow dragging from anywhere in the container (better UX for Pull-to-Close)
            this.isDragging.set(true);
            this.lastTouchX = touches[0].clientX;
            this.lastTouchY = touches[0].clientY;
            this.lastTimestamp = Date.now();

            // Initialize physics state
            this.velocityX = 0;
            this.velocityY = 0;
            this.touchHistory = [
                {
                    x: touches[0].clientX,
                    y: touches[0].clientY,
                    time: Date.now(),
                },
            ];
            // Cache layout to prevent thrashing
            this.cachedConstraints = this.getConstraints();
            this.lockDirection.set(null);
        } else if (touches.length === 2) {
            // Two fingers: Pinch
            this.isPinching.set(true);
            this.isDragging.set(false); // Stop panning
            this.initialPinchDistance = this.getDistance(touches);
            this.initialScale = this.scale();
            this.initialPinchCenter = this.getCenter(touches);
            this.initialTranslateX = this.translateX();
            this.initialTranslateY = this.translateY();

            // Clear caching on pinch (scale changes will invalidate limits)
            this.cachedConstraints = null;

            // Prevent default to avoid browser zoom
            if (event.cancelable) event.preventDefault();
        }
    }
}
