import * as EventEmitter from 'eventemitter3';
import * as _ from 'lodash';
import {v4 as uuid} from 'uuid';

import PinTypes from './misc/PinTypes';

import {Wire} from './misc/types';

export default class Pin extends EventEmitter {

	id: string;
	label: string;
	_value: any;
	valueType?: string;

  	constructor(props: Wire.Node.PinProps) {
    	super();

		this.id = props.id || uuid();
		this.label = props.label;
		this.valueType = props.valueType;
    	this.value = props.value;
  	}

  	_validateValue(value: any) {

		let validator = (value: any) => true;
    
		switch(this.valueType) {
			case PinTypes.STRING:
				validator = _.isString;
				break;
			case PinTypes.NUMBER:
				validator = _.isNumber;
				break;
			case PinTypes.BOOLEAN:
				validator = _.isBoolean;
				break;
			case PinTypes.OBJECT:
				validator = _.isObject;
				break;
			case PinTypes.FUNCTION:
				validator = _.isFunction;
				break;
			case PinTypes.EVENT:
				validator = (value) => value instanceof EventEmitter;
				break;
			case PinTypes.ARRAY:
				validator = _.isArray;
				break;
		}

		return validator(value);
	}
	  
	set value(value: any) {
		if (this._validateValue(value)) {
			this._value = value;
			this.emit('pinValueUpdate', value);
		}
	}
}