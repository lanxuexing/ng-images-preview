import { NgModule } from '@angular/core';
import { ImagesPreviewComponent } from './images-preview.component';
import { ImagesPreviewDirective } from './images-preview.directive';
import { ImagesGalleryComponent } from './images-gallery.component';

@NgModule({
    imports: [ImagesPreviewComponent, ImagesPreviewDirective, ImagesGalleryComponent],
    exports: [ImagesPreviewComponent, ImagesPreviewDirective, ImagesGalleryComponent]
})
export class NgImagesPreviewModule { }
