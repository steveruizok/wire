import * as EventEmitter from 'eventemitter3';
import Pin from './Pin';
import { Wire } from './misc/types';
export default class Node extends EventEmitter {
    id: string;
    label: string;
    category: string;
    inputPins: Pin[];
    outputPins: Pin[];
    initialized: boolean;
    repeatableInputPin?: Wire.Node.PinProps;
    data: any;
    compute?(): void;
    constructor(props: Wire.Node.NodeProps);
    _initializePins(inputPins: Wire.Node.PinProps[], outputPins: Wire.Node.PinProps[]): void;
    addRepeatableInputPin(): void;
    onConnectionAdded(): void;
    onConnectionRemoved(): void;
    toJSON(): string;
}
