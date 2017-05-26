import { Component, Input, ViewContainerRef, ComponentFactoryResolver, Type, OnInit } from '@angular/core';

import { ComponentSelectorService } from '../service/component-selector.service';

import { ISelectableComponent } from './selectable.component';

@Component({
    selector: 'component-selector',
    templateUrl: './component-selector.component.html'
})
export class ComponentSelectorComponent implements OnInit {
    constructor(
        private _hostContainer: ViewContainerRef,
        private _cmpSelectorSrv: ComponentSelectorService,
        private _componentFactoryResolver: ComponentFactoryResolver
    ) {

    }

    private _componentRef: ISelectableComponent;

    private _component: Type<any>;
    @Input()
    get component() {
        return this._component;
    }
    set component(value: Type<any>) {
        if (this._component === value)
            return;
        this._component = value;
    }

    private _data: any;
    @Input()
    get data() {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
        // if (isPresent(this._componentRef))
        //     this._componentRef.viewModule = this.data;
    }

    ngOnInit() {
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(this._component);
        this._hostContainer.clear();
        this._componentRef = <ISelectableComponent>this._hostContainer.createComponent(componentFactory).instance;
        this._componentRef.viewModule = this.data;
    }
}