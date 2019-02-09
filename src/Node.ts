import * as EventEmitter from 'eventemitter3';
import * as _ from 'lodash';
import {v4 as uuid} from 'uuid';

import Pin from './Pin';
import Store from './Store';

import {Wire} from './misc/types';

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
	initialized: boolean = false;
	repeatableInputPin?: Wire.Node.PinProps;
	props: Wire.Node.NodeProps;
	extra?: {};
	compute?(inputPins: Pin[], outputPins: Pin[]): void;

	constructor(props: Wire.Node.NodeProps) {
		super();

		props = _.defaults(props, {
			id: uuid(),
			name: 'Untitled',
			category: 'Uncategorized'
		});

		this.id = props.id;
		this.name = props.name;
		this.category = props.category;
		this.position = props.position;
		this.repeatableInputPin = props.repeatableInputPin;
		this.extra = props.extra;

		this._initializePins(props.inputPins, props.outputPins);
		
        this.compute ? this.compute(this.inputPins, this.outputPins) : null;

		Store.addNode(this);

		this.initialized = true;

		this.props = props;
	}

	toJSON() {
		const ip = this.inputPins.map(ip => JSON.parse(ip.toJSON()));
		const op = this.outputPins.map(op => JSON.parse(op.toJSON()));

		return JSON.stringify({
			id: this.id,
			name: this.name,
			nodeType: this.constructor.name,
			props: this.props,
			inputPins: ip,
			outputPins: op
		});
	}

	_initializePins(inputPins: Wire.Node.PinProps[], outputPins: Wire.Node.PinProps[]) {
		this.inputPins = inputPins.map((p, i) => new Pin(p, this, true, i));
		this.outputPins = outputPins.map((p, i) => new Pin(p, this, false, i));
	}

	addRepeatableInputPin() {
		if (this.repeatableInputPin) {
			this.inputPins.push(new Pin(this.repeatableInputPin, this, true, this.inputPins.length));
			this.emit('update', this);
		}
	}

    onConnectionAdded() {
        this.compute ? this.compute(this.inputPins, this.outputPins) : null;
    }

    onConnectionRemoved() {
        this.compute ? this.compute(this.inputPins, this.outputPins) : null;
    }
}