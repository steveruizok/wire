import * as EventEmitter from 'eventemitter3';
import * as _ from 'lodash';
import {v4 as uuid} from 'uuid';

import Pin from './Pin';
import Store from './Store';

import {Wire} from './misc/types';

export default class Node extends EventEmitter {

	id: string;
	label: string;
	inputPins: Pin[];
	outputPins: Pin[];
	position: {
		x: number;
		y: number;
	};

	constructor(props: Wire.Node.NodeProps) {
		super();

		props = _.defaults(props, {
			id: uuid(),
			label: 'Untitled'
		});

		this.id = props.id;
		this.label = props.label;
		this.position = props.position;

		this._initializePins(props.inputPins, props.outputPins);

		Store.addNode(this);
	}

	_initializePins(inputPins: Wire.Node.PinProps[], outputPins: Wire.Node.PinProps[]) {
		this.inputPins = inputPins.map((p, i) => new Pin(p, this, true, i));
		this.outputPins = outputPins.map((p, i) => new Pin(p, this, false, i));
	}
}