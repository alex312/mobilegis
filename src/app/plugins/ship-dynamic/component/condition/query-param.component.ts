import { Component, ViewChildren, Renderer, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

import { Transition } from '../../../../base';

import { DynamicDataService } from '../../service/dynamic-data.service';
import { IQueryParam } from '../../service/url-factory';

@Component({
    selector: "query-param",
    templateUrl: "./query-param.component.html"
})
export class QueryParamComponent implements OnInit {

    private _paramSource: IQueryParam;
    @Input()
    set paramSource(value) {
        this._paramSource = value;
        this._shipTypeSelection.setSelectedOption(this.paramSource.shipTypeCode);
        this._sourceSelection.setSelectedOption(this.paramSource.source);
        this._companySelection.setSelectedOption(this.paramSource.companyId);
    }
    get paramSource() {
        return this._paramSource;
    }

    constructor(private _renderer: Renderer, private _elementRef: ElementRef, private _dataServer: DynamicDataService) {
        this._renderer.setElementStyle(this._elementRef.nativeElement, "position", "absolute");
        this._renderer.setElementStyle(this._elementRef.nativeElement, "width", "100%");
        this._renderer.setElementStyle(this._elementRef.nativeElement, "height", "100%");
        this._renderer.setElementStyle(this._elementRef.nativeElement, "z-index", "100");
        this._renderer.setElementStyle(this._elementRef.nativeElement, "background", "rgba(6, 6, 6, 0.25)");

        this.initShipTypeSelection();
        this.initSourceSelection();
        this.initCompanySelection();

    }

    ngOnInit() {
        this.moveOut();
    }


    //// ShipTypes
    _shipTypeSelection: SelectionModel;
    private initShipTypeSelection() {
        let loaderPrmise = (() => {
            return this._dataServer.getShipType().then(result => {
                let types = <any[]>result.filter(type => {
                    return type.Code.indexOf("00") > 0
                });
                let shipOptions = types.map(type => {
                    return <OptionModel>{
                        Name: type.ChineseName,
                        Code: type.Code,
                        Selected: false
                    }
                });
                shipOptions.splice(0, 0, { Name: "全部船舶类型", Code: "", Selected: true });
                return shipOptions;
            });
        })();
        this._shipTypeSelection = new SelectionModel(loaderPrmise);
    }

    shipTypeSelected(event) {
        this.paramSource.shipTypeCode = this._shipTypeSelection.selectedOption.Code;
    }

    //// SourceTypes
    _sourceSelection: SelectionModel;
    private initSourceSelection() {
        let loaderPromise = (() => {
            return Promise.resolve([
                <OptionModel>{ Name: "全部计划来源", Code: "", Selected: true },
                <OptionModel>{ Name: "新港计划", Code: "XG", Selected: false },
                <OptionModel>{ Name: "临港计划", Code: "LG", Selected: false }
            ]);
        })();
        this._sourceSelection = new SelectionModel(loaderPromise);
    }
    _selectedSource;
    sourceSelected(event) {
        this.paramSource.source = this._sourceSelection.selectedOption.Code;
    }

    //// Companys
    _companySelection: SelectionModel;
    private initCompanySelection() {
        let loaderPromise = (() => {
            return this._dataServer.getSource().then(result => {
                let comps = result.map(company => {
                    return <OptionModel>{
                        Name: company.Name,
                        Code: company.Key,
                        Selected: false
                    }
                });
                comps.splice(0, 0, { Name: "全部小船公司", Code: "", Selected: true });
                return comps;
            });
        })()
        this._companySelection = new SelectionModel(loaderPromise);
    }
    companySelected(event) {
        this.paramSource.companyId = this._companySelection.selectedOption.Code;
    }



    moveOut() {
        this.transition(this._elementRef.nativeElement, 0, "display", 1);
        this._renderer.setElementStyle(this._elementRef.nativeElement, "display", "none");
    }
    moveIn() {
        this.transition(this._elementRef.nativeElement, 0, "display");
        this._renderer.setElementStyle(this._elementRef.nativeElement, "display", "block");
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



    @ViewChildren("timeButton")
    private _timeButtons;
    setTime(event, unitOfTime, amount) {
        let now = moment(new Date());
        this.paramSource.start = now.format("YYYY-MM-DD");
        this.paramSource.end = now.add(amount, unitOfTime).format("YYYY-MM-DD");
        this.setTimeButtonColor(event);
    }

    private setTimeButtonColor(event: MouseEvent) {
        this._timeButtons.forEach(button => {
            let element = button._elementRef.nativeElement;
            this._renderer.setElementStyle(element, "background-color", "#ffffff");
            this._renderer.setElementStyle(element, "color", "#50b5eb");
        })
        this._renderer.setElementStyle(event.srcElement.parentElement, "background-color", "#50b5eb")
        this._renderer.setElementStyle(event.srcElement.parentElement, "color", "#ffffff");
    }
    @Output()
    set = new EventEmitter();
    setClick() {
        this.set.emit(this.paramSource);
    }
    @Output()
    reset = new EventEmitter();
    resetClick(event) {
        this.reset.emit();
    }

}

class SelectionModel {

    options: OptionModel[] = [];

    constructor(optionLoader: Promise<OptionModel[]>) {
        optionLoader.then(result => {
            this.options.splice(0, this.options.length, ...result);
        });
    }

    selectedOption: OptionModel;
    setSelectedOption(value: string) {
        this.options.forEach(option => {
            option.Selected = option.Code == value
            if (option.Selected) {
                this.selectedOption = option;
            }
        });
    }
}

class OptionModel {
    Name: string;
    Code: string;
    Selected: boolean = false;
}