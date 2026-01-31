import { Component, inject, Renderer2, signal, OnInit, computed, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

export type ThemeMode = 'light' | 'dark' | 'system';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './app.html'
})
export class AppComponent implements OnInit {
    private renderer = inject(Renderer2);

    // Theme State
    mode = signal<ThemeMode>('system');

    // Effective darkness based on mode and system preference
    isDark = signal(false);

    constructor() {
        // Sync DOM whenever isDark changes
        effect(() => {
            const dark = this.isDark();
            if (dark) {
                this.renderer.addClass(document.documentElement, 'dark');
            } else {
                this.renderer.removeClass(document.documentElement, 'dark');
            }
        });
    }

    ngOnInit() {
        const saved = localStorage.getItem('theme') as ThemeMode | null;
        if (saved) {
            this.mode.set(saved);
        }

        this.updateEffectiveTheme();

        // Listen for system changes
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        media.addEventListener('change', () => {
            if (this.mode() === 'system') {
                this.updateEffectiveTheme();
            }
        });
    }

    toggleTheme() {
        const current = this.mode();
        let next: ThemeMode;

        if (current === 'system') next = 'light';
        else if (current === 'light') next = 'dark';
        else next = 'system';

        this.mode.set(next);
        if (next === 'system') {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', next);
        }

        this.updateEffectiveTheme();
    }

    private updateEffectiveTheme() {
        const current = this.mode();
        if (current === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDark.set(prefersDark);
        } else {
            this.isDark.set(current === 'dark');
        }
    }
}
