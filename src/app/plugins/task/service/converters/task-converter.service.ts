import { Injectable } from '@angular/core'
import { Task } from '../../data/task';
import { findTaskStatusCodeDictionary, findTypeCodeDictionary } from '../../data/metadata';

@Injectable()
export class TaskConverter {

    toTask(serverData: any) {
        let task = new Task();
        task.CurrentStatus = findTaskStatusCodeDictionary(serverData.CurrentStatus);
        task.Date = new Date(serverData.Date);
        task.Director = serverData.Director;
        task.Equipments = serverData.Equipments;
        task.Id = serverData.Id;
        task.Level = serverData.Level;
        task.Locale = serverData.Locale;
        task.Members = serverData.Members;
        task.Name = serverData.Name;
        task.NoteList = serverData.NoteList;
        task.RequiredCompletionDate = serverData.RequiredCompletionDate && new Date(serverData.RequiredCompletionDate);
        task.Summary = serverData.Summary;
        task.Type = findTypeCodeDictionary(serverData.Type);
        task.Vehicles = serverData.Vehicles;
        return task;
    }
}