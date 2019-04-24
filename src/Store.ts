import * as EventEmitter from 'eventemitter3'
import * as _ from 'lodash'

import Node from './Node'
import Connection from './Connection'

export class Store extends EventEmitter {
	connections: Map<string, Connection> = new Map()
	nodes: Map<string, Node> = new Map()

	addNode(node: Node) {
		this.nodes.set(node.id, node)
		node.initialized = true

		this.emit('nodes:update', this.nodes)
	}

	removeNode(node: Node) {
		if (!this.nodes.has(node.id)) return

		const nodeDeleted = this.nodes.delete(node.id)

		if (nodeDeleted) {
			node.inputPins.forEach((p) =>
				p.connections.forEach((c) => {
					// Remove event listener on connection
					c.removeEventListener()

					// Remove connection from fromPin connections
					_.pull(c.fromPin.connections, c)

					// Run onConnectionRemoved on fromPin node
					const { onConnectionRemoved } = c.fromPin.node
					_.isFunction(onConnectionRemoved) && onConnectionRemoved()

					// Delete connection from connection collection
					const connectionDeleted = this.connections.delete(c.id)

					this.emit('connections:update', this.connections)
				})
			)

			node.outputPins.forEach((p) =>
				p.connections.forEach((c) => {
					// Reset toPin value to its default value
					c.toPin.value = c.toPin.defaultValue

					// Remove event listener on connection
					c.removeEventListener()

					// Remove connection from toPin connections
					_.pull(c.toPin.connections, c)

					// Run onConnectionRemoved on toPin node
					const { onConnectionRemoved } = c.toPin.node
					_.isFunction(onConnectionRemoved) && onConnectionRemoved()

					// Delete connection from connection collection
					const connectionDeleted = this.connections.delete(c.id)

					this.emit('connections:update', this.connections)
				})
			)

			this.emit('nodes:update', this.nodes)
		}
	}

	addConnection(connection: Connection) {
		this.connections.set(connection.id, connection)
		const { onConnectionAdded: foca } = connection.fromPin.node
		_.isFunction(foca) && foca()

		const { onConnectionAdded: toca } = connection.toPin.node
		_.isFunction(toca) && toca()

		this.emit('connections:update', this.connections)
	}

	removeConnection(connection: Connection) {
		// Reset toPin value to its default value
		connection.toPin.value = connection.toPin.defaultValue

		// Remove event listener on connection
		connection.removeEventListener()

		// Remove connection from fromPin / toPin
		_.pull(connection.fromPin.connections, connection)
		_.pull(connection.toPin.connections, connection)

		// Run onConncetionRemoved on fromPin node and toPin node
		const { onConnectionRemoved: focr } = connection.fromPin.node
		_.isFunction(focr) && focr()

		const { onConnectionRemoved: tocr } = connection.toPin.node
		_.isFunction(tocr) && tocr()

		// Delete connection from connection collection
		this.connections.delete(connection.id)

		this.emit('connections:update', this.connections)
	}

	toJSON() {
		const nodes = [...this.nodes.values()].map((n) => JSON.parse(n.toJSON()))
		const connections = [...this.connections.values()].map((c) =>
			JSON.parse(c.toJSON())
		)

		return JSON.stringify({
			nodes,
			connections,
		})
	}
}

export default new Store()
