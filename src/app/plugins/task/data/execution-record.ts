import { Note } from './note';

export class ExecutionRecord {
    Id: number; // ID
    TaskId: number; // 任务ID
    Date: Date; // 时间
    Person: number; // 执行人
    GroupKey: string; // 附件存储区域区分
    Description: string; // 执行情况
    // Attachments: Attachment[] = []; // 附件
    NoteList: Note[] = [];
}