import * as EventEmitter from 'eventemitter3';
import { Wire } from './misc/types';
import Pin from './Pin';
export default class Connection extends EventEmitter {
    id: string;
    fromPin: Pin;
    toPin: Pin;
    constructor(props: Wire.Connection.ConnectionProps);
    _updateToPinValue(value: any): void;
    _setupEventListener(): void;
    removeEventListener(): void;
}
