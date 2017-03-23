import * as moment from 'moment';
import {Format} from '../../../base';

export class ShipSummary {
    constructor(featureData: any) {
        this.featureData = featureData;
        this.callsign = featureData.callsign ? featureData.callsign : '未知';
        this.cog = featureData.cog === 511 ? '未知' : Format.FormatNumber(featureData.cog) + '°';
        this.destination = featureData.destination;
        this.dynamicTime = moment(featureData.dynamicTime.getTime()).format('YYYY-MM-DD HH:mm:ss');
        this.heading = featureData.heading === 511 || !featureData.heading ? '未知' : Format.FormatNumber(featureData.heading) + '°';
        this.imo = featureData.imo ? featureData.imo.toString() : '未知';
        this.length = featureData.length ? featureData.length + '米' : '未知';
        this.width = featureData.width ? featureData.width + '米' : '未知';
        this.lon = Format.FormatDegree(featureData.lon, 'ddd-cc-mm.mmL');
        this.lat = Format.FormatDegree(featureData.lat, 'ddd-cc-mm.mmB');
        this.mmsi = featureData.mmsi ? featureData.mmsi : '未知';

        this.name = featureData.v_name ? featureData.v_name : featureData.name;

        this.sog = featureData.sog ? Format.FormatNumber(featureData.sog) + '节' : '未知';
        this.timeout = featureData.timeout;
        this.v_length = featureData.v_length;
        this.v_type = featureData.v_type;
        this.v_width = featureData.v_width;
        this.type = featureData.v_type;
    }

    featureData: any;
    callsign: string;
    cog: string;
    destination: string;
    dynamicTime: string;
    heading: string;
    imo: string;
    length: string;
    width: string;
    lon: string;
    lat: string;
    mmsi: string;
    name: string;
    sog: string;
    timeout: number;
    v_length: number;
    v_type: string;
    v_width: number;
    type: number;
}