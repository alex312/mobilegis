import { Injectable, Inject } from '@angular/core'

import { Attachment } from '../data/attachment';

import { ApiClientService } from '../../../base';

import { TaskConfig, TASK_CONFIG } from '../../task/config';


export class FileMetadata {
    Id: number;
    GroupKey: string;
    FileKey: string;
    DateTime: Date;
    FilePath: string;
    FileType: string;
    FileName: string;
    FileSize: number;
    Uploaded: boolean = false;
}

class FileBlock {
    FileKey: string;
    FileType: string;
    FileName: string;
    FileSize: number;
    GroupKey: string;
    BlockSize: number;
    BlockCount: number;
    BlockNo: number;
    BlockContent: number[];
}

@Injectable()
export class AttachmentService {

    constructor(private apiClient: ApiClientService, @Inject(TASK_CONFIG) private config: TaskConfig) {

    }

    private _metadataUrl = "api/metadata";
    getAttachmentMetaDatas(groupKey: string) {
        let promise = this.apiClient.get(`${this._metadataUrl}?groupKey=${groupKey}`);
        return promise;
    }

    removeAttachment(attachments: Attachment[]) {
        let removedPromises = attachments.map(attachment => {
            let promise = this.apiClient.delete(`${this._metadataUrl}/${attachment.Id}`);
            return promise;
        })

        return Promise.all(removedPromises);
    }

    fillFileBlockList(attachment: Attachment) {

        let promise = new Promise<FileBlock[]>((resolve, reject) => {

            let result = [];

            let perblockSize = this.config.perBlockSize;

            let fileBlock: FileBlock = null;

            // let fileReader = new FileReader();
            // fileReader.onload = function (file) {
            try {


                let blockCount = attachment.FileSize / perblockSize;
                for (let i = 0; i < blockCount; i++) {
                    fileBlock = new FileBlock()
                    fileBlock.FileKey = attachment.FileKey;
                    fileBlock.FileName = attachment.FileName;
                    fileBlock.FileType = attachment.FileType;
                    fileBlock.FileSize = attachment.FileSize;
                    fileBlock.GroupKey = attachment.GroupKey;
                    fileBlock.BlockCount = Math.ceil(blockCount);
                    fileBlock.BlockNo = i;
                    let startIndex = i * perblockSize;
                    let endIndex = (i + 1) * perblockSize;
                    endIndex = endIndex <= attachment.FileData.byteLength ? endIndex : attachment.FileData.byteLength;
                    fileBlock.BlockSize = endIndex - startIndex;
                    fileBlock.BlockContent = this.getBlockCount(attachment.FileData.slice(startIndex, endIndex));
                    result.push(fileBlock);
                }

                resolve(result);
            }
            catch (e) {
                reject(e)
            }

            // }.bind(this);
            // fileReader.readAsArrayBuffer(attachment.FileData);
        });

        return promise;
    }

    getBlockCount(buffer) {
        let array = new Uint8Array(buffer);
        let result = [];
        for (let i = 0; i < array.length; i++) {
            result.push(array[i]);
        }
        return result;
    }


    private _registUrl: string = "api/metadata/enrollment";
    regist(attachment: Attachment) {
        if (attachment) {
            let metadata =
                {
                    Id: attachment.Id,
                    GroupKey: attachment.GroupKey,
                    FileKey: attachment.FileKey,
                    DateTime: attachment.DateTime,
                    FilePath: attachment.FilePath,
                    FileType: attachment.FileType,
                    FileName: attachment.FileName,
                    FileSize: attachment.FileSize,
                };
            return this.apiClient.post(this._registUrl, metadata).catch(error => {
                this.reject("注册文件信息时出错", error);
            });
        }
        else
            return this.reject("没有合适的文件信息");
    }

    private _uploadFileUrl: string = "api/attachment";
    upload(attachment: Attachment) {
        let promise = new Promise((resolve, reject) => {
            if (attachment) {
                return this.fillFileBlockList(attachment).then((blocks) => {
                    return this._uploadBlock(blocks, 0, attachment).then(metaData => {
                        resolve(metaData);
                    });
                });
            }
            else
                this.reject("没有合适的文件信息");
        })
        return promise.then((metadata) => {
            return attachment;
        });
    }

    private _uploadBlock(blocks: FileBlock[], blockIndex: number, attachment: Attachment) {
        if (!blocks || !blocks.length || blocks.length - 1 < blockIndex || !blocks[blockIndex])
            return this.reject("错误的文件分块");
        return this.apiClient.post(this._uploadFileUrl, blocks[blockIndex])
            .then((block) => {
                attachment.UploadedPresent = Math.floor((blockIndex / blocks.length) * 100);
                if (block.BlockNo < blocks.length - 1)
                    return this._uploadBlock(blocks, blockIndex + 1, attachment);
                else
                    return block.metaData;
            })
            .catch(error => {
                return this.reject("上传文件时出现错误");
            })
    }

    private _completeUrl = "api/metadata/complete"
    complete(attachment: Attachment) {
        return this.apiClient.put(this._completeUrl, attachment).then(data => {
            return data;
        })
    }

    private _reject = Promise.reject;
    private reject(msg: string, err: Error = null, reject = this._reject) {
        return reject({ message: msg, sender: "attachment-service", error: err });
    }

    delete(attachment: Attachment) {
        return this.apiClient.delete(`${this._metadataUrl}/${attachment.Id}`);
    }
} 