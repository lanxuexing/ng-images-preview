
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagesPreviewComponent } from './images-preview.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';

console.log('Spec file evaluated');

describe('ImagesPreviewComponent', () => {
    let component: ImagesPreviewComponent;
    let fixture: ComponentFixture<ImagesPreviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImagesPreviewComponent],
            providers: [provideNoopAnimations()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ImagesPreviewComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('src', 'test.jpg');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display loading initially', () => {
        expect(component.state().isLoading).toBe(true);
        const loader = fixture.nativeElement.querySelector('.loader');
        expect(loader).toBeTruthy();
    });

    it('should update state on load', () => {
        const testSrc = 'test.jpg';
        component.onImageLoad(testSrc);
        fixture.detectChanges();
        expect(component.state().isLoading).toBe(false);
        expect(component.hasError()).toBe(false);
    });

    it('should update state on error', () => {
        const testSrc = 'test.jpg';
        component.onImageError(testSrc);
        fixture.detectChanges();
        expect(component.state().isLoading).toBe(false);
        expect(component.hasError()).toBe(true);
    });

    it('should zoom in', () => {
        const initialScale = component.scale();
        component.zoomIn();
        fixture.detectChanges();
        expect(component.scale()).toBeGreaterThan(initialScale);
    });
});
