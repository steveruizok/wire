"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("eventemitter3");
const _ = require("lodash");
const uuid_1 = require("uuid");
const Pin_1 = require("./Pin");
const Store_1 = require("./Store");
class Node extends EventEmitter {
    constructor(props) {
        super();
        this.initialized = false;
        props = _.defaults(props, {
            id: uuid_1.v4(),
            name: 'Untitled',
            category: 'Uncategorized'
        });
        this.id = props.id;
        this.name = props.name;
        this.category = props.category;
        this.repeatableInputPin = props.repeatableInputPin;
        this.data = props.data;
        this._initializePins(props.inputPins, props.outputPins);
        this.compute ? this.compute() : null;
        Store_1.default.addNode(this);
    }
    _initializePins(inputPins, outputPins) {
        this.inputPins = inputPins.map((p, i) => new Pin_1.default(p, this, true, i));
        this.outputPins = outputPins.map((p, i) => new Pin_1.default(p, this, false, i));
    }
    addRepeatableInputPin() {
        if (this.repeatableInputPin) {
            this.inputPins.push(new Pin_1.default(this.repeatableInputPin, this, true, this.inputPins.length));
            this.emit('update', this);
        }
    }
    onConnectionAdded() {
        this.compute ? this.compute() : null;
    }
    onConnectionRemoved() {
        this.compute ? this.compute() : null;
    }
    toJSON() {
        return JSON.stringify({
            constructor: this.constructor.name,
            props: {
                id: this.id,
                name: this.name,
                category: this.category,
                repeatableInputPin: this.repeatableInputPin,
                data: this.data,
                inputPins: this.inputPins.map(ip => JSON.parse(ip.toJSON())),
                outputPins: this.outputPins.map(op => JSON.parse(op.toJSON()))
            }
        });
    }
}
exports.default = Node;
