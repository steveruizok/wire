import * as EventEmitter from 'eventemitter3';
import Node from './Node';
import Connection from './Connection';
export declare class Store extends EventEmitter {
    connections: Connection[];
    nodes: Node[];
    addNode(node: Node): void;
    removeNode(node: Node): void;
    addConnection(connection: Connection): void;
    removeConnection(connection: Connection): void;
}
declare const _default: Store;
export default _default;
