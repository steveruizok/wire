import * as EventEmitter from 'eventemitter3';
import {v4 as uuid} from 'uuid';

import {Wire} from './misc/types';
import Node from './Node';
import Pin from './Pin';

export class Connection extends EventEmitter {

    id: string;
    fromNode: Node;
    fromPin: Pin;
    toNode: Node;
    toPin: Pin;

    constructor(props: Wire.Connection.ConnectionProps) {
        super();

        this.id = props.id || uuid();
        this.fromNode = props.fromNode;
        this.fromPin = props.fromPin;
        this.toNode = props.toNode;
        this.toPin = props.toPin;

        this._setupEventListeners();
    }

    _updateToPinValue(value: any) {
        this.toPin.value = value;
    }
    
    _setupEventListeners() {
        this.fromPin.on('pinValueUpdate', this._updateToPinValue);
    }

    removeEventListeners() {
        this.fromPin.removeListener('pinValueUpdate', this._updateToPinValue);
    }
}