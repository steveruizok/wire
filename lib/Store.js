"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("eventemitter3");
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
