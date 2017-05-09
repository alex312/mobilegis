export class Attachment {
    Id: number;
    GroupKey: string;
    FileKey: string;
    DateTime: Date;
    FilePath: string;
    FileType: string;
    FileName: string;
    FileSize: number;
    FileData: ArrayBuffer;
    IsUploading: boolean = true;
    Uploaded: boolean = false;
    UploadedPresent: number = 0;
}