import { CodeDictionary } from './code-dictionary';
import { Member } from './member';
import { Vehicle } from './vehicle';
import { Equipment } from './equipment';
import { Note } from './note';

export class Task {
    Id: number; // ID
    Date: Date; // 创建时使用当前时间
    Name: string; //手动录入
    Summary: string; // 摘要，下拉或手动输入
    RequiredCompletionDate: Date; // 要求完成时间
    CurrentStatus: CodeDictionary; // 当前状态，下拉选择
    Locale: string; // 任务地点，下拉或手动输入
    Type: CodeDictionary; // 任务类别 下拉或手动输入
    Level: number; // 任务级别 下拉选择
    Director: Member; // 负责人
    Members: Member[]; // 参与人
    Vehicles: Vehicle[]; // 执行任务使用的交通工具 手动选择
    Equipments: Equipment[]; // 装备，下拉或手动输入
    NoteList: Note[] = []; // 备注列表
    Target: string
}

export class NoteInfo {

}