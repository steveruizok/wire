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

    constructor(props: Wire.Connection.ConnectionProps) {
        super();

        this._updateToPinValue = this._updateToPinValue.bind(this);

        props = _.defaults(props, {
			id: uuid()
		});

        this.id = props.id;
        this.fromPin = props.fromPin;
        this.toPin = props.toPin;

        if (this.toPin.validateValue(this.fromPin.value)) {
            this.toPin.value = this.fromPin.value;

            this._setupEventListener();
    
            Store.addConnection(this);
        } else {
            console.warn(`[ILLEGAL CONNECTION]: Target Pin expects type: ${this.toPin.valueType}`);
        }
    }

    _updateToPinValue(value: any) {
        this.toPin.value = value;
    }
    
    _setupEventListener() {
        this.fromPin.on('value:update', this._updateToPinValue);
    }

    removeEventListener() {
        this.fromPin.removeListener('value:update', this._updateToPinValue);
    }
}