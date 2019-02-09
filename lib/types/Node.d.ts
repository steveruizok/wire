import * as EventEmitter from 'eventemitter3';
import Pin from './Pin';
import { Wire } from './misc/types';
export default class Node extends EventEmitter {
    id: string;
    name: string;
    category: string;
    inputPins: Pin[];
    outputPins: Pin[];
    position: {
        x: number;
        y: number;
    };
    initialized: boolean;
    repeatableInputPin?: Wire.Node.PinProps;
    props: Wire.Node.NodeProps;
    extra?: {};
    compute?(inputPins: Pin[], outputPins: Pin[]): void;
    constructor(props: Wire.Node.NodeProps);
    toJSON(): string;
    _initializePins(inputPins: Wire.Node.PinProps[], outputPins: Wire.Node.PinProps[]): void;
    addRepeatableInputPin(): void;
    onConnectionAdded(): void;
    onConnectionRemoved(): void;
}
