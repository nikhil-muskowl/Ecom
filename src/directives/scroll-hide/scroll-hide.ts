import { Content } from 'ionic-angular';
import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';

/**
 * Generated class for the ScrollHideDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[scroll-hide]' // Attribute selector
})
export class ScrollHideDirective {
  @Input('scrollHide') config: ScrollHideConfig;
  @Input('scrollContent') scrollContent: Content;

  contentHeight: number;
  scrollHeight: number;
  lastScrollPosition: number;
  lastValue: number = 0;

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.scrollContent);
    if (this.scrollContent && this.config) {
      this.scrollContent.ionScrollStart.subscribe((ev) => {
        this.contentHeight = this.scrollContent.getScrollElement().offsetHeight;
        this.scrollHeight = this.scrollContent.getScrollElement().scrollHeight;
        if (this.config.maxValue === undefined) {
          this.config.maxValue = this.element.nativeElement.offsetHeight;
        }
        this.lastScrollPosition = ev.scrollTop;
      });
      this.scrollContent.ionScroll.subscribe((ev) => this.adjustElementOnScroll(ev));
      this.scrollContent.ionScrollEnd.subscribe((ev) => this.adjustElementOnScroll(ev));
    }
  }

  private adjustElementOnScroll(ev) {
    // console.log(ev);
    if (ev) {
      ev.domWrite(() => {
        let scrollTop: number = ev.scrollTop > 0 ? ev.scrollTop : 0;
        let scrolldiff: number = scrollTop - this.lastScrollPosition;
        this.lastScrollPosition = scrollTop;
        let newValue = this.lastValue + scrolldiff;
        newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
        this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);

        if (newValue > 50) {
          document.querySelector(".tabbar")['style'].display = 'none';
        } else {
          document.querySelector(".tabbar")['style'].display = 'flex';
        }

        this.lastValue = newValue;
      });
    }
  }

}

export interface ScrollHideConfig {
  cssProperty: string;
  maxValue: number;
}