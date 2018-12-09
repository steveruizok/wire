import * as EventEmitter from 'eventemitter3';
import * as _ from 'lodash';

import Node from './Node';
import Connection from './Connection';

export class Store extends EventEmitter {
    
    connections: Connection[] = [];
    nodes: Node[] = [];

    addNode(node: Node) {
        this.nodes.push(node);

        this.emit('nodes:updated', this.nodes);
    }

    removeNode(node: Node) {
        const nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex === -1) return;

        this.nodes.splice(nodeIndex, 1);

        node.inputPins.forEach(p => p.connections.forEach(c => {
            const connectionIndex = this.connections.indexOf(c);
            if (connectionIndex === -1) return;
    
            c.toPin.value = c.toPin.defaultValue;
    
            c.removeEventListener();

            const connectionIndexInFromPin = c.fromPin.connections.indexOf(c);
            c.fromPin.connections.splice(connectionIndexInFromPin, 1);

            c.toPin.node.onConnectionRemoved ? c.toPin.node.onConnectionRemoved() : null;

            this.connections.splice(connectionIndex, 1);

            this.emit('connections:updated', this.connections);
        }));

        node.outputPins.forEach(p => p.connections.forEach(c => {
            const connectionIndex = this.connections.indexOf(c);
            if (connectionIndex === -1) return;
    
            c.toPin.value = c.toPin.defaultValue;
    
            c.removeEventListener();

            const connectionIndexInToPin = c.toPin.connections.indexOf(c);
            c.toPin.connections.splice(connectionIndexInToPin, 1);

            c.toPin.node.onConnectionRemoved ? c.toPin.node.onConnectionRemoved() : null;

            this.connections.splice(connectionIndex, 1);

            this.emit('connections:updated', this.connections);
        }));

        this.emit('nodes:updated', this.nodes);
    }

    addConnection(connection: Connection) {
        this.connections.push(connection);

        connection.toPin.node.onConnectionAdded ? connection.toPin.node.onConnectionAdded() : null;

        this.emit('connections:updated', this.connections);
    }

    removeConnection(connection: Connection) {

        const connectionIndex = this.connections.indexOf(connection);
        if (connectionIndex === -1) return;

        connection.toPin.value = connection.toPin.defaultValue;

        connection.removeEventListener();

        const connectionIndexInFromPin = connection.fromPin.connections.indexOf(connection);
        connection.fromPin.connections.splice(connectionIndexInFromPin, 1);

        const connectionIndexInToPin = connection.toPin.connections.indexOf(connection);
        connection.toPin.connections.splice(connectionIndexInToPin, 1);

        connection.toPin.node.onConnectionRemoved ? connection.toPin.node.onConnectionRemoved() : null;

        this.connections.splice(connectionIndex, 1);

        this.emit('connections:updated', this.connections);
    }
}

export default new Store();