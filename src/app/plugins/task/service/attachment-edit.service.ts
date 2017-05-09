import { Injectable } from '@angular/core';

import { Attachment } from '../data/attachment';
import { DataManager } from '../../../base';

@Injectable()
export class AttachmentEditService {
    private _attachmentData: DataManager<Attachment>

    private _newAttachments: DataManager<Attachment>;
    private _removedAttachments: DataManager<Attachment>;

    private _editable: boolean;

    constructor() {
        this._attachmentData = new DataManager<Attachment>();
        this._attachmentData.added.subscribe(this.onAddAttachment.bind(this));
        this._attachmentData.removed.subscribe(this.onRemovedAttachment.bind(this));


        this._newAttachments = new DataManager<Attachment>();
        this._removedAttachments = new DataManager<Attachment>();

        this._editable = true;
    }

    reset(attachments: Attachment[]) {
        this._attachmentData.reset(attachments);
        this._newAttachments.reset([]);
        this._removedAttachments.reset([]);
    }

    restore() {
        this._editable = false;
        this._newAttachments.Items.map(attachment => {
            this._attachmentData.remove(attachment, this.equalsPredicate);
        })
        this._newAttachments.reset([]);

        this._removedAttachments.Items.map(attachment => {
            this._attachmentData.addOrUpdate(attachment, this.equalsPredicate);
        })
        this._removedAttachments.reset([]);
        this._editable = true;
    }

    add(attachment: Attachment) {
        let addAction = (attachment) => {
            this._attachmentData.addOrUpdate(attachment, this.equalsPredicate)
        };

        this.edit(attachment, addAction);
    }

    remove(attachment: Attachment) {
        let removeAction = (attachment) => {
            this._attachmentData.remove(attachment, this.equalsPredicate);
        }

        this.edit(attachment, removeAction);
    }

    get currentAttachments() {
        return this._attachmentData.Items;
    }

    get newAttachments() {
        return this._newAttachments.Items;
    }

    get removedAttachments() {
        return this._removedAttachments.Items;
    }

    private edit(attachment: Attachment, editAction: (attachment: Attachment) => any) {
        if (this._editable) {
            editAction(attachment);
        }
        else {
            throw new Error("当前不能编辑附件");
        }
    }

    private equalsPredicate(left: Attachment, right: Attachment) {
        return left.FileKey === right.FileKey;
    }

    private onAddAttachment(attachment: Attachment) {
        if (this._editable)
            this._newAttachments.addOrUpdate(attachment, this.equalsPredicate);
    }

    private onRemovedAttachment(attachment: Attachment) {
        if (this._editable) {
            if (this._newAttachments.find(attachment, this.equalsPredicate))
                this._newAttachments.remove(attachment, this.equalsPredicate);
            else
                this._removedAttachments.addOrUpdate(attachment, this.equalsPredicate);
        }
    }
}