import * as EventEmitter from 'eventemitter3';
import * as _ from 'lodash';
import {v4 as uuid} from 'uuid';

import ValueTypes from './misc/ValueTypes';
import Node from './Node';
import Connection from './Connection';

import {Wire} from './misc/types';

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

  	constructor(props: Wire.Node.PinProps, node: Node, isInputPin: boolean = false, index: number) {
		super();
		
		props = _.defaults(props, {
			id: uuid(),
			label: 'Untitled',
			enumerableValue: false
		});

		this.node = node;
		this.id = props.id;
		this.label = props.label;
		this.value = props.value;
		this.defaultValue = props.value;
		this.valueType = props.valueType;
		this.enumerableValue = props.enumerableValue;
		this.isInputPin = isInputPin;
		this.index = index;
		this.connections = [];
  	}

  	validateValue(value: any) {

		let validator = (value: any) => true;
    
		switch(this.valueType) {
			case ValueTypes.STRING:
				validator = _.isString;
				break;
			case ValueTypes.NUMBER:
				validator = (value) => !isNaN(value * 1);
				break;
			case ValueTypes.BOOLEAN:
				validator = _.isBoolean;
				break;
			case ValueTypes.OBJECT:
				validator = _.isObject;
				break;
			case ValueTypes.FUNCTION:
				validator = _.isFunction;
				break;
			case ValueTypes.EVENT:
				validator = (value) => value instanceof EventEmitter;
				break;
		}

		if (this.enumerableValue) {

			if (_.isArray(value) && value.length) {
				return _.every(value, validator);
			} else {
				return false;
			}

		} else {
			return validator(value);
		}
	}

	get value() {
		return this._value;
	}
	  
	set value(value: any) {
		if (this.validateValue(value)) {
			this._value = value;
			this.emit('update', value);

			if (this.node.initialized && this.isInputPin) {
				this.node.compute ? this.node.compute(this.node.inputPins, this.node.outputPins) : null;
			}
		}
	}

	get connected() {
		return !!this.connections.length;
	}
}