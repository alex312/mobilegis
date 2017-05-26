import { isBlank, isString } from './util';
import * as moment from 'moment';

export class DateUtil {
    static isAfter(date1: Date | string, date2: Date | string) {
        return moment(date1).isAfter(moment(date2));
    }

    static complare(date1: Date, date2: Date) {
        return date1.getTime() - date2.getTime();
    }

    static createDate(date: any) {

        let result: Date = null;

        if (isBlank(date))
            return result;

        if (isString(date) && date !== "")
            result = new Date(date);
        if (date instanceof Date)
            result = date;

        return result;
    }
}