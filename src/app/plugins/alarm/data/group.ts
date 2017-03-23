import {Alarm} from './alarm';

export class Group {
    Type: number;
    Name: string;
    Alarms: Alarm[] = [];
    Hidden: boolean = false;
}