"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("eventemitter3");
const _ = require("lodash");
const uuid_1 = require("uuid");
const Store_1 = require("./Store");
class Connection extends EventEmitter {
    constructor(props) {
        super();
        this._updateToPinValue = this._updateToPinValue.bind(this);
        props = _.defaults(props, {
            id: uuid_1.v4()
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
                Store_1.default.addConnection(this);
            }
            else {
                console.warn(`[ILLEGAL CONNECTION]: Target Pin expects type: ${this.toPin.valueType}`);
            }
        }
        else {
            console.warn(`[ILLEGAL CONNECTION]: Target Pin already has a connection`);
        }
    }
    _updateToPinValue(value) {
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
exports.default = Connection;
