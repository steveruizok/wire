import * as EventEmitter from 'eventemitter3';
import Node from './Node';
import Connection from './Connection';
export declare class Store extends EventEmitter {
    connections: Map<string, Connection>;
    nodes: Map<string, Node>;
    addNode(node: Node): void;
    removeNode(node: Node): void;
    addConnection(connection: Connection): void;
    removeConnection(connection: Connection): void;
    toJSON(): string;
}
declare const _default: Store;
export default _default;
