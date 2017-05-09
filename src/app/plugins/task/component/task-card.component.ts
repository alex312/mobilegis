import { Component, Input, Output, EventEmitter, Renderer, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Task } from '../data/task';

import { Format, DateUtil } from '../../../base';

@Component({
    selector: "task-card",
    templateUrl: "./task-card.component.html"
})
export class TaskCardComponent implements AfterViewInit {
    Format = Format;

    private _task: Task;
    get task() {
        return this._task;
    }
    @Input()
    set task(value: Task) {
        this._task = value;

    }
    @Input()
    canViewDetail: boolean = true;
    @Input()
    canRecord: boolean = false;
    @Input()
    canDeal: boolean = true;
    @Input()
    dealButtonText: string;

    @Output()
    taskDetail = new EventEmitter();
    @Output()
    taskDeal = new EventEmitter();
    @Output()
    showTaskRecord = new EventEmitter();

    @ViewChild("requireTimeAlarm")
    _requireTimeAlarm: ElementRef;

    constructor(private _renderer: Renderer) {

    }

    ngAfterViewInit() {
        if (!this._requireTimeAlarm)
            return;
        this._renderer.setElementClass(this._requireTimeAlarm.nativeElement, "late", false);
        if (this._task.RequiredCompletionDate && DateUtil.LateThen(new Date(), this._task.RequiredCompletionDate)) {
            this._renderer.setElementClass(this._requireTimeAlarm.nativeElement, "late", true);
        }
    }
}