import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Camera, File, FileEntry } from 'ionic-native';

import { ExecutionRecord } from '../data/execution-record';
import { Attachment } from '../data/attachment';
import { ExecuteRecordService } from '../service/execute-record.service';
import { MemberConverter } from '../service/converters/member-converter.service';
import { AttachmentService } from '../service/attachment.service';
import { AttachmentEditService } from '../service/attachment-edit.service';
import { UserService } from '../../user/service/user.service'
import { RestoreWrapper } from '../../../base';

import { Config } from '../../../config';


declare var cordova: any
declare var window: any

@Component({
    selector: "execution-record-modal-page",
    templateUrl: './execution-record-modal.page.html',
})
export class ExecutionRecordModelContentPage {

    record: ExecutionRecord;

    description;
    private restoreWapper: RestoreWrapper<ExecutionRecord> = new RestoreWrapper<ExecutionRecord>();

    constructor(private nav: NavController,
        private alertCtrl: AlertController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private executionRecordService: ExecuteRecordService,
        private attachmentService: AttachmentService,
        private attachmentEditService: AttachmentEditService,
        private memberConverter: MemberConverter,
        private userService: UserService,
        private zone: NgZone) {

        let oldRecord = navParams.data.record || (() => {
            let temp = new ExecutionRecord();
            temp.TaskId = navParams.data.taskId
            return temp;
        })();

        this.restoreWapper.setItem(oldRecord);
        this.record = this.restoreWapper.getItem();
        if (this.record.GroupKey && this.record.GroupKey.length > 0) {
            this.attachmentService.getAttachmentMetaDatas(this.record.GroupKey)
                .then(attachments => this.attachmentEditService.reset(attachments));
        }
        else
            this.attachmentEditService.reset([]);
    }

    goBack() {
        this.nav.pop();
    }

    getAttachmentPath(path) {
        if (Config.CORDOVA_READY)
            return Config.proxy + "/" + path;
        return path;
    }

    ok() {
        if (this.record && this.record.Description) {

            // TODO: 设置填写人，增加权限管理后
            this.record.Person = this.userService.Current.UserId;
            let promise = null;
            if (this.record.Id)
                promise = this.executionRecordService.update(this.record);
            else
                promise = this.executionRecordService.create(this.record);
            promise.then(data => {
                this.nav.pop();
            });
        }
        else
            this.doAlert("请填写执法情况。");
    }

    // 上传附件
    addAttachment() {
        let newAttachment: Attachment;
        this.createAttachment()
            .then(attachment => {
                newAttachment = attachment;
                newAttachment.IsUploading = true;
                this.attachmentEditService.add(newAttachment);
                console.log("Image", "regist");
                return this.attachmentService.regist(newAttachment)
            }).then(attachment => {
                if (!this.record.GroupKey || this.record.GroupKey === "") {
                    newAttachment.GroupKey = attachment.GroupKey;
                    this.record.GroupKey = attachment.GroupKey;
                }
                newAttachment.Id = attachment.Id;
                newAttachment.FileKey = attachment.FileKey;
                newAttachment.FilePath = attachment.FilePath;
                console.log("Image", "upload");
                return this.attachmentService.upload(newAttachment);
            }).then((attachment) => {
                if (newAttachment)
                    newAttachment.IsUploading = false;
                return this.attachmentService.complete(newAttachment);
            }).catch(error => {
                if (newAttachment)
                    newAttachment.IsUploading = false;
                console.log("upload attachment:", error);
            })
    }

    attachmentSrc(attachment: Attachment) {
        if (attachment && attachment.IsUploading)
            return "build/imgs/uploading.png"
    }

    private _systemDir = "file:///"
    createAttachment() {
        if (Config.CORDOVA_READY)
            return Camera.getPicture({
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.ALLMEDIA
            }).then((imageUrl) => {
                console.log("Image", imageUrl);
                let fileUrl = imageUrl.replace(/^\//, "").replace(/^file:\/\/\//, "");
                return File.checkFile(this._systemDir, fileUrl).then((result) => {
                    return fileUrl;
                })
            }).then(fileUrl => {
                console.log("Image", fileUrl);
                let promise = new Promise((resolve, reject) => {
                    window.resolveLocalFileSystemURL("file:///" + fileUrl, (fileEntry: FileEntry) => {
                        fileEntry.file((file) => { resolve(file); }, (error) => { reject(error) });
                    }, (err) => {
                        reject(err);
                    });
                });

                return promise;

            })
                .then((file: any) => {
                    let promise = new Promise<Attachment>((resolve, reject) => {
                        let reader = new FileReader();
                        (reader["__zone_symbol__originalInstance"] || reader).onloadend = (theFile: any) => {
                            if (theFile.total != theFile.loaded) {
                                reject("文件读取不完整");
                            }

                            let attachment = new Attachment();
                            attachment.IsUploading = true;
                            attachment.FileName = "执法图片";
                            attachment.FileType = "图片";
                            attachment.GroupKey = this.record.GroupKey;
                            attachment.DateTime = new Date();
                            attachment.FileData = theFile.target.result;
                            attachment.FileSize = theFile.target.result.byteLength;
                            resolve(attachment);
                        };
                        (reader["__zone_symbol__originalInstance"] || reader).onerror = (error) => {
                            console.log("readfile with coadova:", error);
                            reject(error);
                        }
                        reader.readAsArrayBuffer(file);

                    });

                    return promise.then(attachment => {
                        return attachment;
                    })

                })
        else {
            let promise = new Promise<Attachment>((resolve, reject) => {
                let input = <HTMLInputElement>document.createElement("input");
                input.type = "file";
                input.onchange = (event: any) => {

                    let reader = new FileReader();
                    let file = event.target.files[0];
                    reader.onload = (theFile: any) => {
                        if (theFile.total != theFile.loaded) {
                            reject("文件读取不完整");
                        }
                        let attachment = new Attachment();
                        attachment.IsUploading = true;
                        attachment.FileName = "执法图片";
                        attachment.FileType = "图片";
                        attachment.GroupKey = this.record.GroupKey;
                        attachment.DateTime = new Date();
                        attachment.FileData = theFile.target.result;
                        attachment.FileSize = theFile.total;
                        resolve(attachment);
                    }

                    reader.onerror = (error) => {
                        console.log("readfile in browser:", error);
                        reject(error);
                    }

                    reader.readAsArrayBuffer(file);
                }
                input.click();
            });
            return promise;
        }
    }

    tmpAttachment: Attachment;
    changeListner(event) {

        let file = event.target.files[0];

        this.tmpAttachment.FileName = file.name;
        this.tmpAttachment.FileType = file.type.split('/')[0];
        this.tmpAttachment.FileData = file;
        let reader = new FileReader();

        reader.onload = function (theFile) {
            this.tmpAttachment.FilePath = theFile.target.result;
            this.attachmentEditService.add(this.tmpAttachment);
        }.bind(this);

        reader.readAsDataURL(file);
    }

    removeAttachment(attachment: Attachment) {
        this.attachmentService.delete(attachment).then(() => {
            this.attachmentEditService.remove(attachment);
        })
    }

    doAlert(msg: string) {
        let alert = this.alertCtrl.create({
            title: '提示',
            message: msg,
            buttons: ['确认']
        });
        alert.present(alert);
    }
}