
export interface RelayState {
    timestamp: string;
    value: boolean;
    lastValue: boolean;
}

export interface PowerMeasurement {
    timestamp: string;
    value: number;
}

export interface PowerMeterState {
    timestamp: string;
    value: number;
    history: PowerMeasurement[];
    lastValue: number;
}

export interface ActivityMeterState {
    timestamp: string;
    value: number;
    history: PowerMeasurement[];
    lastValue: number;
}

export class DeviceTwin {
    deviceId: string;
    type: 'relay' | 'power-meter' | 'activity-meter' | 'unknown';
    name?: string;

    value?: number;
    online: boolean;
    

    lastUpdated: Date;
    

    constructor(deviceId: string, type: 'relay' | 'power-meter' | 'activity-meter' | 'unknown', name?: string, online?: boolean, lastValue?: number) {
        this.deviceId = deviceId;
        this.type = type;
        this.lastUpdated = new Date();
        this.name = name;
        this.online = online ?? false;
        this.value = lastValue ?? 0;
        // if (type === 'relay') {
        //     this.state = {
        //         timestamp: new Date().toISOString(),
        //         value: false,
        //         lastValue: (!!lastValue) ?? false,
        //     }
        // }
        // if (type === 'power-meter') {
        //     this.state = {
        //         timestamp: new Date().toISOString(),
        //         value: lastValue ?? 0,
        //         history: [],
        //         lastValue: lastValue ?? 0,
        //     }
        // }
        // if (type === 'activity-meter') {
        //     this.state = {
        //         timestamp: new Date().toISOString(),
        //         value: lastValue ?? 0,
        //         history: [],
        //         lastValue: lastValue ?? 0,
        //     }
        // }
    }

    getDeviceData() {
        return {
            deviceId: this.deviceId,
            type: this.type,
        }
    }

}