import * as EventEmitter from 'eventemitter3';
import * as _ from 'lodash';
import {v4 as uuid} from 'uuid';

import {Wire} from './misc/types';
import Pin from './Pin';
import Store from './Store';

export default class Connection extends EventEmitter {

    id: string;
    fromPin: Pin;
    toPin: Pin;
    props: Wire.Connection.ConnectionProps;

    constructor(props: Wire.Connection.ConnectionProps) {
        super();

        this._updateToPinValue = this._updateToPinValue.bind(this);

        props = _.defaults(props, {
			id: uuid()
		});

        this.id = props.id;
        this.fromPin = props.fromPin;
        this.toPin = props.toPin;
        this.props = props;

        if (!this.toPin.connected) {
            if (this.toPin.validateValue(this.fromPin.value)) {
                this.toPin.value = this.fromPin.value;
    
                this._setupEventListener();
    
                this.fromPin.connections.push(this);
                this.toPin.connections.push(this);
        
                Store.addConnection(this);
            } else {
                console.warn(`[ILLEGAL CONNECTION]: Target Pin expects type: ${this.toPin.valueType}`);
            }
            
        } else {
            console.warn(`[ILLEGAL CONNECTION]: Target Pin already has a connection`);
        }
    }

    _updateToPinValue(value: any) {
        this.toPin.value = value;
    }
    
    _setupEventListener() {
        this.fromPin.on('update', this._updateToPinValue);
    }

    removeEventListener() {
        this.fromPin.removeListener('update', this._updateToPinValue);
    }

    toJSON() {
        return JSON.stringify({
            constructor: this.constructor.name,
            id: this.id,
            fromNodeId: this.fromPin.node.id,
            fromPinId: this.fromPin.id,
            toNodeId: this.toPin.node.id,
            toPinId: this.toPin.id
        });
    }
}