import { Device } from 'ionic-native';

export class DeviceInfo {
    static UUID() {
        return Device.uuid;
    }
}