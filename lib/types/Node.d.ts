import * as EventEmitter from 'eventemitter3';
import Pin from './Pin';
import { Wire } from './misc/types';
export default class Node extends EventEmitter {
    id: string;
    label: string;
    inputPins: Pin[];
    outputPins: Pin[];
    position: {
        x: number;
        y: number;
    };
    compute?(inputPins: Pin[], outputPins: Pin[]): void;
    constructor(props: Wire.Node.NodeProps);
    _initializePins(inputPins: Wire.Node.PinProps[], outputPins: Wire.Node.PinProps[]): void;
    onConnectionAdded(): void;
    onConnectionRemoved(): void;
}
