"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("eventemitter3");
const _ = require("lodash");
const uuid_1 = require("uuid");
const ValueTypes_1 = require("./misc/ValueTypes");
class Pin extends EventEmitter {
    constructor(props, node, isInputPin = false, index) {
        super();
        props = _.defaults(props, {
            id: uuid_1.v4(),
            label: 'Untitled',
            enumerableValue: false
        });
        this.node = node;
        this.id = props.id;
        this.label = props.label;
        this.value = props.value || props.defaultValue;
        this.defaultValue = props.defaultValue;
        this.valueType = props.valueType;
        this.enumerableValue = props.enumerableValue;
        this.isInputPin = isInputPin;
        this.index = index;
        this.connections = [];
    }
    validateValue(value) {
        let validator = (value) => true;
        switch (this.valueType) {
            case ValueTypes_1.default.STRING:
                validator = _.isString;
                break;
            case ValueTypes_1.default.NUMBER:
                validator = (value) => !isNaN(value * 1);
                break;
            case ValueTypes_1.default.BOOLEAN:
                validator = _.isBoolean;
                break;
            case ValueTypes_1.default.OBJECT:
                validator = _.isObject;
                break;
            case ValueTypes_1.default.FUNCTION:
                validator = _.isFunction;
                break;
            case ValueTypes_1.default.EVENT:
                validator = (value) => value instanceof EventEmitter;
                break;
        }
        if (this.enumerableValue) {
            if (_.isArray(value) && value.length) {
                return _.every(value, validator);
            }
            else {
                return false;
            }
        }
        else {
            return validator(value);
        }
    }
    toJSON() {
        return JSON.stringify({
            id: this.id,
            label: this.label,
            value: this.value || this.defaultValue,
            defaultValue: this.defaultValue,
            valueType: this.valueType,
            enumerableValue: this.enumerableValue
        });
    }
    get value() {
        return this._value;
    }
    set value(value) {
        if (this.validateValue(value)) {
            this._value = value;
            this.emit('update', value);
            if (this.node.initialized && this.isInputPin) {
                this.node.compute ? this.node.compute() : null;
            }
        }
    }
    get connected() {
        return !!this.connections.length;
    }
}
exports.default = Pin;
