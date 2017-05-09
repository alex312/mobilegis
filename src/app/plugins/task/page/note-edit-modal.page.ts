import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

@Component({
    selector: "node-edit-module-page",
    templateUrl: "./note-edit-modal.page.html"
})
export class NoteEditModel {


    private _viewCtrl: ViewController;

    note: string;
    constructor(navParams: NavParams
        , viewCtrl: ViewController) {
        this.note = navParams.data.note;
        this._viewCtrl = viewCtrl;
    }

    ok() {
        this._viewCtrl.dismiss(this.note);
    }

    cancel() {
        this._viewCtrl.dismiss();
    }
}