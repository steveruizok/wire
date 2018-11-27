import * as EventEmitter from 'eventemitter3';
import {v4 as uuid} from 'uuid';

import Pin from './Pin';

import {Wire} from './misc/types';

export default class Node extends EventEmitter {

	id: string;
	inputPins: Pin[];
	outputPins: Pin[];

	constructor(props: Wire.Node.NodeProps) {
		super();

		this.id = props.id || uuid();

		this._initializePins(props.inputPins, props.outputPins);
	}

	_initializePins(inputPins: Wire.Node.PinProps[], outputPins: Wire.Node.PinProps[]) {
		this.inputPins = inputPins.map(p => new Pin(p));
		this.outputPins = outputPins.map(p => new Pin(p));
	}
}