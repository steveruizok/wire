import * as EventEmitter from 'eventemitter3';
import Node from './Node';
import Connection from './Connection';
import { Wire } from './misc/types';
export default class Pin extends EventEmitter {
    id: string;
    label: string;
    isInputPin: boolean;
    _value: any;
    defaultValue: any;
    node: Node;
    index: number;
    valueType?: string;
    enumerableValue?: boolean;
    connections: Connection[];
    props: Wire.Node.PinProps;
    constructor(props: Wire.Node.PinProps, node: Node, isInputPin: boolean, index: number);
    validateValue(value: any): boolean;
    toJSON(): string;
    value: any;
    readonly connected: boolean;
}
