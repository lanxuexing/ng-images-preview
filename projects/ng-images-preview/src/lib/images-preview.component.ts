import {
    Component,
    ElementRef,
    HostListener,
    computed,
    input,
    signal,
    viewChild,
    ChangeDetectionStrategy,
    TemplateRef,
    inject,
    effect,
    PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';

export interface ImagesPreviewState {
    src: string;
    scale: number;
    rotate: number;
    flipH: boolean;
    flipV: boolean;
    isLoading: boolean;
    hasError: boolean;
}

export interface ImagesPreviewActions {
    zoomIn: () => void;
    zoomOut: () => void;
    rotateLeft: () => void;
    rotateRight: () => void;
    flipHorizontal: () => void;
    flipVertical: () => void;
    reset: () => void;
    close: () => void;
}

interface TrackingPoint {
    x: number;
    y: number;
    time: number;
}

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
    >
      <!-- Custom Template Support -->
      @if (customTemplate(); as template) {
        <ng-container
          *ngTemplateOutlet="template; context: { $implicit: state(), actions: actions }"
        ></ng-container>
      } @else {
        <!-- Loading -->
        @if (isLoading()) {
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
          <img
            #imgRef
            [src]="activeSrc()"
            [class.opacity-0]="isLoading() || hasError()"
            class="preview-image"
            [class.dragging]="isDragging()"
            [class.zoom-in]="scale() === 1"
            [class.zoom-out]="scale() > 1"
            [style.transform]="transformStyle()"
            (load)="onImageLoad()"
            (error)="onImageError()"
            (mousedown)="onMouseDown($event)"
            (click)="$event.stopPropagation()"
            draggable="false"
            alt="Preview"
          />
        </div>

        <!-- Close Button -->
        <button class="close-btn" (click)="close()" aria-label="Close preview">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>

        <!-- Navigation -->
        @if (images() && images()!.length > 1) {
          <!-- Check if not first -->
          @if (currentIndex() > 0) {
            <button
              class="nav-btn prev"
              (click)="prev(); $event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
          }
          <!-- Check if not last -->
          @if (currentIndex() < images()!.length - 1) {
            <button
              class="nav-btn next"
              (click)="next(); $event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          }

          <!-- Counter -->
          <div class="counter">{{ currentIndex() + 1 }} / {{ images()!.length }}</div>
        }

        <!-- Toolbar -->
        <div
          class="toolbar"
          (click)="$event.stopPropagation()"
          (keydown)="onToolbarKey($event)"
          tabindex="0"
        >
          <!-- Flip H -->
          <button class="toolbar-btn" (click)="flipHorizontal()" aria-label="Flip Horizontal">
            <svg viewBox="0 0 24 24"><path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"/></svg>
          </button>
          <!-- Flip V -->
          <button class="toolbar-btn" (click)="flipVertical()" aria-label="Flip Vertical">
            <svg viewBox="0 0 24 24"><path d="M7 21h2v-2H7v2zM3 9h2V7H3v2zm12 12h2v-2h-2v2zm4-12h2V7h-2v2zm-4 4h2v-4h-2v4zm-8-8h2V3H7v2zm8 0h2V3h-2v2zm-4 8h4v-4h-4v4zM3 15h2v-2H3v2zm12-4h2v-4H3v4h2v-2h10v2zM7 3v2h2V3H7zm8 20h2v-2h-2v2zm-4 0h2v-2h-2v2zm4-12h2v-2h-2v2zM3 19c0 1.1.9 2 2 2h2v-2H5v-2H3v2zm16-6h2v-2h-2v2zm0 4v2c0 1.1-.9 2-2 2h-2v-2h2v-2h2zM5 3c-1.1 0-2 .9-2 2h2V3z"/></svg>
          </button>
          <!-- Rotate Left -->
          <button class="toolbar-btn" (click)="rotateLeft()" aria-label="Rotate Left">
            <svg viewBox="0 0 24 24"><path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/></svg>
          </button>
          <!-- Rotate Right -->
          <button class="toolbar-btn" (click)="rotateRight()" aria-label="Rotate Right">
            <svg viewBox="0 0 24 24"><path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/></svg>
          </button>
          <!-- Zoom Out -->
          <button class="toolbar-btn" (click)="zoomOut()" aria-label="Zoom Out">
             <svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
          </button>
          <!-- Zoom In -->
          <button class="toolbar-btn" (click)="zoomIn()" aria-label="Zoom In">
             <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
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
            transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
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
    src = input.required<string>();
    images = input<string[]>();
    initialIndex = input(0);
    customTemplate = input<TemplateRef<unknown>>();
    closeCallback: () => void = () => {
        /* noop */
    };

    imgRef = viewChild<ElementRef<HTMLImageElement>>('imgRef');

    // State signals
    currentIndex = signal(0);
    isLoading = signal(true);
    hasError = signal(false);

    activeSrc = computed(() => {
        const imgs = this.images();
        if (imgs && imgs.length > 0) {
            return imgs[this.currentIndex()];
        }
        return this.src();
    });

    private platformId = inject(PLATFORM_ID);

    constructor() {
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
                this.isLoading.set(true);
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
                // Next
                if (index < images.length - 1) {
                    const img = new Image();
                    img.src = images[index + 1];
                }
                // Prev
                if (index > 0) {
                    const img = new Image();
                    img.src = images[index - 1];
                }
            }
        });
    }

    scale = signal(1);
    translateX = signal(0);
    translateY = signal(0);
    rotate = signal(0);
    flipH = signal(false);
    flipV = signal(false);

    isDragging = signal(false);

    // Touch state
    private initialPinchDistance = 0;
    private initialScale = 1;
    private isPinching = false;

    // Computed state object for template
    state = computed<ImagesPreviewState>(() => ({
        src: this.src(),
        scale: this.scale(),
        rotate: this.rotate(),
        flipH: this.flipH(),
        flipV: this.flipV(),
        isLoading: this.isLoading(),
        hasError: this.hasError(),
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
    private readonly FRICTION = 0.92; // Heavier feel
    private readonly VELOCITY_THRESHOLD = 0.01;
    private readonly MAX_VELOCITY = 3; // Cap speed to prevent teleporting

    transformStyle = computed(() => {
        const scale = this.scale();
        const x = this.translateX();
        const y = this.translateY();
        const rotate = this.rotate();
        const scaleX = this.flipH() ? -1 : 1;
        const scaleY = this.flipV() ? -1 : 1;

        return `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
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

        let nextX = this.lastTranslateX + deltaX;
        let nextY = this.lastTranslateY + deltaY;

        // Apply strict clamping during move
        this.applyMoveConstraints(nextX, nextY);
    }

    private applyMoveConstraints(nextX: number, nextY: number) {
        if (!isPlatformBrowser(this.platformId)) {
            this.translateX.set(nextX);
            this.translateY.set(nextY);
            return;
        }

        const img = this.imgRef()?.nativeElement;
        if (!img) {
            this.translateX.set(nextX);
            this.translateY.set(nextY);
            return;
        }

        const scale = this.scale();
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
        if (!this.isDragging() && !this.isPinching) return;

        // Prevent default to stop page scrolling/zooming
        if (event.cancelable) {
            event.preventDefault();
        }

        const touches = event.touches;

        // One finger: Pan
        if (touches.length === 1 && this.isDragging() && !this.isPinching) {
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

            this.translateX.set(nextX);
            this.translateY.set(nextY);

            this.lastTouchX = touches[0].clientX;
            this.lastTouchY = touches[0].clientY;
        }

        // Two fingers: Pinch Zoom
        if (touches.length === 2) {
            const distance = this.getDistance(touches);
            if (this.initialPinchDistance > 0) {
                const scaleFactor = distance / this.initialPinchDistance;
                const newScale = Math.min(
                    Math.max(this.initialScale * scaleFactor, this.MIN_SCALE),
                    this.MAX_SCALE,
                );
                this.scale.set(newScale);

                // Re-clamp position after zoom
                this.clampPosition();
            }
        }
    }

    private getConstraints() {
        // If we have a valid cache during interaction, use it to avoid reflows
        // The instruction says: "So `getConstraints` stays as is (calculates fresh)."
        // So, this method should always calculate fresh.
        // The `cachedConstraints` property is used *outside* this method.

        if (!isPlatformBrowser(this.platformId)) return { maxX: 0, maxY: 0 };

        const img = this.imgRef()?.nativeElement;
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

        const img = this.imgRef()?.nativeElement;
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
                    // Skip if 0ms passed (can happen on fast screens)
                    this.rafId = requestAnimationFrame(step);
                    return;
                }

                // Clamp max velocity (just in case)
                this.velocityX = Math.max(-this.MAX_VELOCITY, Math.min(this.MAX_VELOCITY, this.velocityX));
                this.velocityY = Math.max(-this.MAX_VELOCITY, Math.min(this.MAX_VELOCITY, this.velocityY));

                // Time-based friction
                // Standard friction is 0.95 per 16ms frame
                const frictionFactor = Math.pow(this.FRICTION, dt / 16);

                this.velocityX *= frictionFactor;
                this.velocityY *= frictionFactor;

                let nextX = this.translateX() + this.velocityX * dt;
                let nextY = this.translateY() + this.velocityY * dt;

                // Check bounds during inertia
                // Hard stop/bounce logic can be improved here if needed
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
                // Clear cache when movement stops
                // The instruction says to clear it in onTouchEnd or reset/scale changes.
                // So, no need to clear it here.
            }
        };
        this.rafId = requestAnimationFrame(step);
    }

    private stopInertia() {
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
    }

    onContainerKey(event: KeyboardEvent) {
        // Prevent closing when interacting with image container via keyboard if needed
        event.stopPropagation();
    }

    onMouseUp() {
        this.isDragging.set(false);
    }

    onTouchEnd(event: TouchEvent) {
        const touches = event.touches;
        if (touches.length === 0) {
            this.isDragging.set(false);

            // Calculate Release Velocity from History
            const now = Date.now();
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
            this.isPinching = false;
            this.initialPinchDistance = 0;

            // Swipe Navigation (at 1x scale)
            if (this.scale() === 1) {
                const x = this.translateX();
                const threshold = 50; // px
                if (x < -threshold) {
                    this.next();
                    return;
                } else if (x > threshold) {
                    this.prev();
                    return;
                }
            }

            // Check bounds
            const constraints = this.cachedConstraints || this.getConstraints();
            const x = this.translateX();
            const y = this.translateY();
            const outOfBounds =
                x > constraints.maxX ||
                x < -constraints.maxX ||
                y > constraints.maxY ||
                y < -constraints.maxY;

            if (outOfBounds) {
                this.snapBack();
                this.velocityX = 0;
                this.velocityY = 0;
                this.cachedConstraints = null;
            } else {
                this.startInertia();
            }
        } else if (touches.length === 1 && this.isPinching) {
            // Transition from pinch to pan
            this.isPinching = false;
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

    private getDistance(touches: TouchList): number {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY,
        );
    }

    close() {
        this.closeCallback();
    }

    onImageLoad() {
        this.isLoading.set(false);
        this.hasError.set(false);
    }

    onImageError() {
        this.isLoading.set(false);
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

    // Mouse Interaction
    onMouseDown(event: MouseEvent) {
        if (this.scale() <= 1 && !this.isDragging()) return; // Can drag only if zoomed? Or always? Default: only zoomed?
        // User expectation for preview: maybe panning always allowed? or only when zoomed?
        // Best practice: if image fits, no pan. If zoomed, pan.
        // I'll allow pan if scale > 1
        if (this.scale() <= 1) return;

        this.isDragging.set(true);
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.lastTranslateX = this.translateX();
        this.lastTranslateY = this.translateY();
        event.preventDefault();
    }

    // Touch Interaction (bound in template)
    onTouchStart(event: TouchEvent) {
        this.stopInertia(); // Cancel any ongoing movement

        const touches = event.touches;

        if (touches.length === 1) {
            // Single touch: Pan. Only if touching the image directly.
            // We need to check if the target is the image element.
            const imgElement = this.imgRef()?.nativeElement;
            if (imgElement && event.target === imgElement) {
                this.isDragging.set(true);
                this.lastTouchX = touches[0].clientX;
                this.lastTouchY = touches[0].clientY;
                this.lastTimestamp = Date.now(); // Keep for scroll decay reference if needed

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
            }
        } else if (touches.length === 2) {
            // Two fingers: Pinch
            this.isPinching = true;
            this.isDragging.set(false); // Stop panning
            this.initialPinchDistance = this.getDistance(touches);
            this.initialScale = this.scale();

            // Clear caching on pinch (scale changes will invalidate limits)
            this.cachedConstraints = null;

            // Prevent default to avoid browser zoom
            if (event.cancelable) event.preventDefault();
        }
    }
}
