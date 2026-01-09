
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
    OnDestroy
} from '@angular/core';
import { ImagesPreviewComponent } from './images-preview.component';

@Directive({
    selector: '[ngImagesPreview]',
    standalone: true
})
export class ImagesPreviewDirective implements OnDestroy {
    @Input('ngImagesPreview') highResSrc = '';
    @Input() previewImages: string[] = [];
    @Input() previewTemplate?: TemplateRef<unknown>;

    private componentRef: ComponentRef<ImagesPreviewComponent> | null = null;

    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);
    private el = inject(ElementRef<HTMLElement>);

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
            this.openPreview(src);
        }
    }

    @HostListener('style.cursor')
    readonly cursor = 'pointer';

    private openPreview(src: string): void {
        // Create Component
        this.componentRef = createComponent(ImagesPreviewComponent, {
            environmentInjector: this.injector
        });

        // Set Inputs
        this.componentRef.setInput('src', src);

        if (this.previewImages.length > 0) {
            this.componentRef.setInput('images', this.previewImages);
            const index = this.previewImages.indexOf(src);
            this.componentRef.setInput('initialIndex', index >= 0 ? index : 0);
        }

        if (this.previewTemplate) {
            this.componentRef.setInput('customTemplate', this.previewTemplate);
        }

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
