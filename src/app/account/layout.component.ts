import { Component, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: 'layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  pageTitle: string = "Let's get started";
  imgs = new Array();

  constructor(
    protected _iconRegistry: MatIconRegistry,
    protected sanitizer: DomSanitizer,
    protected _renderer: Renderer2
  ) {
    this._iconRegistry
      .addSvgIcon(
        'google',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/google.svg')
      )
      .addSvgIcon(
        'facebook',
        this.sanitizer.bypassSecurityTrustResourceUrl(
          '/assets/mdi/facebook.svg'
        )
      )
      .addSvgIcon(
        'microsoft',
        this.sanitizer.bypassSecurityTrustResourceUrl(
          '/assets/mdi/microsoft.svg'
        )
      )
      .addSvgIcon(
        'apple',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/apple.svg')
      );
  }

  pload(...args: any[]): void {
    for (var i = 0; i < args.length; i++) {
      this.imgs[i] = new Image();
      this.imgs[i].src = args[i];
      console.log('loaded: ' + args[i]);
    }
  }

  ngOnInit(): void {
    this.pload(
      '/assets/images/signin-splash.jpg',
      '/assets/images/spinner.gif'
    );

    this._renderer.addClass(document.body, 'login-splash');
  }

  ngOnDestroy(): void {
    this._renderer.removeClass(document.body, 'login-splash');
  }

  renderer(): Renderer2 {
    return this._renderer;
  }

  iconRegistry(): MatIconRegistry {
    return this._iconRegistry;
  }
}
