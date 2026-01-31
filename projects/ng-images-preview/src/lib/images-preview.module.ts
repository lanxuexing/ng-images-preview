import { NgModule } from '@angular/core';
import { ImagesPreviewComponent } from './images-preview.component';
import { ImagesPreviewDirective } from './images-preview.directive';

@NgModule({
    imports: [ImagesPreviewComponent, ImagesPreviewDirective],
    exports: [ImagesPreviewComponent, ImagesPreviewDirective]
})
export class NgImagesPreviewModule { }
