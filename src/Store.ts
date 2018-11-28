import * as _ from 'lodash';

import Node from './Node';
import Connection from './Connection';

export class Store {
    
    connections: Connection[] = [];
    nodes: Node[] = [];

    addNode(node: Node) {
        this.nodes.push(node);
    }

    removeNode(node: Node) {
        const nodeIndex = this.nodes.indexOf(node);

        if (nodeIndex === -1) return;

        this.nodes.splice(nodeIndex, 1);
    }

    addConnection(connection: Connection) {
        this.connections.push(connection);
    }

    removeConnection(connection: Connection) {
        const connectionIndex = this.connections.indexOf(connection);
        
        if (connectionIndex === -1) return;

        connection.removeEventListener();

        this.connections.splice(connectionIndex, 1);
    }
}

export default new Store();