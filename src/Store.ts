import * as EventEmitter from 'eventemitter3';
import * as _ from 'lodash';

import Node from './Node';
import Connection from './Connection';

export class Store extends EventEmitter {
    
    connections: Connection[] = [];
    nodes: Node[] = [];

    addNode(node: Node) {
        this.nodes.push(node);

        this.emit('node:added', node, this.nodes);
    }

    removeNode(node: Node) {
        const nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex === -1) return;

        this.nodes.splice(nodeIndex, 1);

        this.emit('node:removed', node, this.nodes);
    }

    addConnection(connection: Connection) {
        this.connections.push(connection);

        this.emit('connection:added', connection, this.connections);
    }

    removeConnection(connection: Connection) {
        const connectionIndex = this.connections.indexOf(connection);
        if (connectionIndex === -1) return;

        connection.removeEventListener();
        this.connections.splice(connectionIndex, 1);

        this.emit('connection:removed', connection, this.connections);
    }
}

export default new Store();