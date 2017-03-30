import { Component, ViewChild, OnInit, ElementRef, AfterViewInit, Renderer } from '@angular/core';

import { Slides, Content, App } from 'ionic-angular';

import { Transition } from '../../app/base';

import { ArticleHomePage, ARTICLE_TYPES } from '../../app/plugins/article';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit, AfterViewInit {

  @ViewChild(Content)
  private _content: Content;
  @ViewChild("mainContent")
  private _mainContentElementRef: ElementRef;
  private _mainContentElement: HTMLElement;

  @ViewChild("dynamic")
  private _dynamicContentRef: ElementRef;
  private _dynamicContentElement: HTMLElement;

  @ViewChild("navButtons")
  private _navButtonsRef: ElementRef;
  private _navButtonsElement: HTMLElement;

  @ViewChild("dynamicTitle")
  private _dynamicTitleRef: ElementRef;
  private _dynamicTitleElement: HTMLElement;

  @ViewChild("homeTitle")
  private _homeTitleRef: ElementRef;
  private _homeTitleElement; HTMLElement;
  @ViewChild("myDynamic")
  private _myDynamicRef: ElementRef;
  private _myDynamicElement: HTMLElement;

  articleTypes = ARTICLE_TYPES;
  constructor(
    private _renderer: Renderer,
    private _app: App) {

  }

  showArticle(event, category) {
    this._app.getRootNav().push(ArticleHomePage, category);
  }

  /**
   * OnInit
  */
  ngOnInit() {
    this._mainContentElement = this._mainContentElementRef.nativeElement;
    this._dynamicContentElement = this._dynamicContentRef.nativeElement;
    this._navButtonsElement = this._navButtonsRef.nativeElement;
    this._dynamicTitleElement = this._dynamicTitleRef.nativeElement;
    this._homeTitleElement = this._homeTitleRef.nativeElement;
    this._myDynamicElement = this._myDynamicRef.nativeElement;
  }

  ngAfterViewInit() {
    this._content.setScrollElementStyle("overflow-y", "hidden");
  }




  /** 
   * Gestures Event Handler
  */
  panEvent(event) {
    if (event.isFinal) {
      this.hideHomePageTitle();
      this.hideHomeContent();
      this.hideDynamicContentTitle();

      this.showDynamicContent();
      this.showNavButton();
      this.showDynamicPageTitle();
    }
    else {
      this.moveTo(this._mainContentElement, "top", event.deltaY);
      this.moveTo(this._dynamicContentElement, "top", event.deltaY);
    }
  }

  backToMainContent() {
    this.showHomePageTitle();
    this.showDynamicContentTitle();
    this.showHomeContent();

    this.hideNavButton();
    this.hideDynamicPageTitle();
    this.hideDynamicContent();
  }

  private hideHomeContent() {
    this.transition(this._mainContentElement, 1, "top");
    this.moveTo(this._mainContentElement, "top", -this._mainContentElement.offsetHeight);
  }
  private showHomeContent() {
    this.transition(this._mainContentElement, 0, "top");
    this.moveTo(this._mainContentElement, "top", 0);
  }

  private hideDynamicContent() {
    this.transition(this._dynamicContentElement, 0, "top");
    this.moveTo(this._dynamicContentElement, "top", 0);
  }
  private showDynamicContent() {
    this.transition(this._dynamicContentElement, 1, "top");
    this.moveTo(this._dynamicContentElement, "top", -this._mainContentElement.offsetHeight);
  }

  private hideNavButton() {
    this.transition(this._navButtonsElement, 0, "opacity");
    this._renderer.setElementStyle(this._navButtonsElement, "opacity", "0");
  }
  private showNavButton() {
    this.transition(this._navButtonsElement, 1, "opacity");
    this._renderer.setElementStyle(this._navButtonsElement, "opacity", "1");
  }

  private hideDynamicContentTitle() {
    this._renderer.setElementStyle(this._dynamicTitleElement, "height", "0px");
    this.transition(this._dynamicTitleElement, 1, "padding");
    this._renderer.setElementStyle(this._dynamicTitleElement, "padding-bottom", "0px");
    this._renderer.setElementStyle(this._dynamicTitleElement, "padding-top", "0px");
  }
  private showDynamicContentTitle() {
    this.transition(this._dynamicTitleElement, 0, "padding");
    this.transition(this._dynamicTitleElement, 0, "height");
    this._renderer.setElementStyle(this._dynamicTitleElement, "padding", "16px");
    this._renderer.setElementStyle(this._dynamicTitleElement, "height", "53px");
  }

  private hideHomePageTitle() {
    this.transition(this._homeTitleElement, .5, "height");
    this.transition(this._homeTitleElement, 0, "opacity", .5);
    this._renderer.setElementStyle(this._homeTitleElement, "height", "0px");
    this._renderer.setElementStyle(this._homeTitleElement, "opacity", "0");
  }
  private showHomePageTitle() {
    this.transition(this._homeTitleElement, 0, "height");
    this.transition(this._homeTitleElement, 0, "opacity");
    this._renderer.setElementStyle(this._homeTitleElement, "height", "27px");
    this._renderer.setElementStyle(this._homeTitleElement, "opacity", "1");
  }

  private hideDynamicPageTitle() {
    this.transition(this._myDynamicElement, 0, "height");
    this._renderer.setElementStyle(this._myDynamicElement, "height", "0px");
  }
  private showDynamicPageTitle() {
    this.transition(this._myDynamicElement, .5, "height", .5);
    this._renderer.setElementStyle(this._myDynamicElement, "height", "27px");
  }



  /**
   * Move Element
   * @param {HTMLElement} element the element will be moved
   * @param {String} direction  is 'top' or 'left'
   * @param {Number} distance  the px value
  */
  private moveTo(element: HTMLElement, direction: string, distance: number) {
    this._renderer.setElementStyle(element, direction, `${distance}px`)
  }

  /** 
   * set simple css transition value to HTMLElement
   * @param {HTMLElement} element
   * @param {Number} duration transition-duration
   * @param {String} property transition-property
   * @param {number} property transition-delay
   * @param {number} timingFunction transition-timing-function, if value is cubic-bezier function you should pass 'cubic-bezier(.83,.97,.05,1.44)'
  */
  private transition(element: HTMLElement, duration: number, property: string, delay: number = 0, timingFunction: string = "") {
    let transitionStr = Transition.MergeTransition(element.style.transition, duration, property, delay, timingFunction);
    this._renderer.setElementStyle(element, "transition", transitionStr);
  }
}


