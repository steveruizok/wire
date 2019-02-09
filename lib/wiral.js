define("misc/ValueTypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        STRING: 'String',
        NUMBER: 'Number',
        BOOLEAN: 'Boolean',
        OBJECT: 'Object',
        FUNCTION: 'Function',
        EVENT: 'Event'
    };
});
define("Pin", ["require", "exports", "eventemitter3", "lodash", "uuid", "misc/ValueTypes"], function (require, exports, EventEmitter, _, uuid_1, ValueTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
define("Store", ["require", "exports", "eventemitter3"], function (require, exports, EventEmitter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Store extends EventEmitter {
        constructor() {
            super(...arguments);
            this.connections = new Map();
            this.nodes = new Map();
        }
        addNode(node) {
            this.nodes.set(node.id, node);
            node.initialized = true;
            this.emit('nodes:update', this.nodes);
        }
        removeNode(node) {
            if (!this.nodes.has(node.id))
                return;
            const nodeDeleted = this.nodes.delete(node.id);
            if (nodeDeleted) {
                node.inputPins.forEach(p => p.connections.forEach(c => {
                    // Remove event listener on connection
                    c.removeEventListener();
                    // Remove connection from fromPin connections
                    const connectionIndexInFromPin = c.fromPin.connections.indexOf(c);
                    c.fromPin.connections.splice(connectionIndexInFromPin, 1);
                    // Run onConnectionRemoved on fromPin node
                    c.fromPin.node.onConnectionRemoved ? c.fromPin.node.onConnectionRemoved() : null;
                    // Delete connection from connection collection
                    const connectionDeleted = this.connections.delete(c.id);
                    this.emit('connections:update', this.connections);
                }));
                node.outputPins.forEach(p => p.connections.forEach(c => {
                    // Reset toPin value to its default value
                    c.toPin.value = c.toPin.defaultValue;
                    // Remove event listener on connection
                    c.removeEventListener();
                    // Remove connection from toPin connections
                    const connectionIndexInToPin = c.toPin.connections.indexOf(c);
                    c.toPin.connections.splice(connectionIndexInToPin, 1);
                    // Run onConnectionRemoved on toPin node
                    c.toPin.node.onConnectionRemoved ? c.toPin.node.onConnectionRemoved() : null;
                    // Delete connection from connection collection
                    const connectionDeleted = this.connections.delete(c.id);
                    this.emit('connections:update', this.connections);
                }));
                this.emit('nodes:update', this.nodes);
            }
        }
        addConnection(connection) {
            this.connections.set(connection.id, connection);
            connection.fromPin.node.onConnectionAdded ? connection.fromPin.node.onConnectionAdded() : null;
            connection.toPin.node.onConnectionAdded ? connection.toPin.node.onConnectionAdded() : null;
            this.emit('connections:update', this.connections);
        }
        removeConnection(connection) {
            // Reset toPin value to its default value
            connection.toPin.value = connection.toPin.defaultValue;
            // Remove event listener on connection
            connection.removeEventListener();
            // Remove connection from fromPin
            const connectionIndexInFromPin = connection.fromPin.connections.indexOf(connection);
            connection.fromPin.connections.splice(connectionIndexInFromPin, 1);
            // Remove connection from toPin
            const connectionIndexInToPin = connection.toPin.connections.indexOf(connection);
            connection.toPin.connections.splice(connectionIndexInToPin, 1);
            // Run onConncetionRemoved on fromPin node and toPin node
            connection.fromPin.node.onConnectionRemoved ? connection.fromPin.node.onConnectionRemoved() : null;
            connection.toPin.node.onConnectionRemoved ? connection.toPin.node.onConnectionRemoved() : null;
            // Delete connection from connection collection
            this.connections.delete(connection.id);
            this.emit('connections:update', this.connections);
        }
        toJSON() {
            const nodes = [...this.nodes.values()].map(n => JSON.parse(n.toJSON()));
            const connections = [...this.connections.values()].map(c => JSON.parse(c.toJSON()));
            return JSON.stringify({
                nodes,
                connections
            });
        }
    }
    exports.Store = Store;
    exports.default = new Store();
});
define("Node", ["require", "exports", "eventemitter3", "lodash", "uuid", "Pin", "Store"], function (require, exports, EventEmitter, _, uuid_2, Pin_1, Store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Node extends EventEmitter {
        constructor(props) {
            super();
            this.initialized = false;
            props = _.defaults(props, {
                id: uuid_2.v4(),
                name: 'Untitled',
                category: 'Uncategorized'
            });
            this.id = props.id;
            this.name = props.name;
            this.category = props.category;
            this.position = props.position;
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
                    position: this.position,
                    repeatableInputPin: this.repeatableInputPin,
                    data: this.data,
                    inputPins: this.inputPins.map(ip => JSON.parse(ip.toJSON())),
                    outputPins: this.outputPins.map(op => JSON.parse(op.toJSON()))
                }
            });
        }
    }
    exports.default = Node;
});
define("misc/types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Connection", ["require", "exports", "eventemitter3", "lodash", "uuid", "Store"], function (require, exports, EventEmitter, _, uuid_3, Store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Connection extends EventEmitter {
        constructor(props) {
            super();
            this._updateToPinValue = this._updateToPinValue.bind(this);
            props = _.defaults(props, {
                id: uuid_3.v4()
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
                    Store_2.default.addConnection(this);
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
});
define("Wire", ["require", "exports", "Node", "Pin", "Connection", "Store", "misc/ValueTypes"], function (require, exports, Node_1, Pin_2, Connection_1, Store_3, ValueTypes_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        Node: Node_1.default,
        Pin: Pin_2.default,
        Connection: Connection_1.default,
        Store: Store_3.default,
        ValueTypes: ValueTypes_2.default
    };
});
