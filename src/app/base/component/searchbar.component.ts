import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'searchbar',
    templateUrl: './searchbar.component.html',
})
export class SearchbarComponent {
    @Input()
    placeholder: string = "搜索";

    private _showSearchButton: boolean = true;
    @Input()
    get showSearchButton() {
        return this._showSearchButton;
    }
    set showSearchButton(value: boolean) {
        this._showSearchButton = value;
    }

    private _searchKey: string = "";
    @Output()
    searchKeyChange = new EventEmitter();
    @Input()
    get searchKey() {
        return this._searchKey;
    }
    set searchKey(value) {
        this._searchKey = value;
        this.searchKeyChange.emit(this._searchKey);
    }

    @Output()
    search = new EventEmitter();

    onSearch(event) {
        this.search.emit(event);
    }


}