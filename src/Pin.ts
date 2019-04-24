import * as EventEmitter from 'eventemitter3'
import * as _ from 'lodash'
import { v4 as uuid } from 'uuid'

import ValueTypes from './misc/ValueTypes'
import Node from './Node'
import Connection from './Connection'

import { Wire, ValueType } from './misc/types'

export default class Pin extends EventEmitter {
	id: string
	label: string
	isInputPin: boolean
	_value: any
	defaultValue: any
	node: Node
	index: number
	valueType?: ValueType
	enumerableValue?: boolean
	connections: Connection[]

	constructor(
		props: Wire.Node.PinProps = {} as Wire.Node.PinProps,
		node: Node,
		isInputPin: boolean = false,
		index: number
	) {
		super()

		const {
			id = uuid(),
			label = 'Untitled',
			enumerableValue = false,
			value,
			valueType,
			defaultValue,
		} = props

		this.node = node
		this.id = id
		this.label = label
		this.value = value || defaultValue
		this.defaultValue = defaultValue
		this.valueType = valueType
		this.enumerableValue = enumerableValue
		this.isInputPin = isInputPin
		this.index = index
		this.connections = []
	}

	validateValue(value: any) {
		const validators = {
			String: _.isString,
			Number: (value: any) => !isNaN(value * 1),
			Boolean: _.isBoolean,
			Object: _.isObject,
			Function: _.isFunction,
			Event: (value: any) => value instanceof EventEmitter,
		}

		const validator: (value: any) => boolean = validators[this.valueType]

		if (this.enumerableValue) {
			if (_.isArray(value) && value.length) {
				return _.every(value, validator)
			} else {
				return false
			}
		} else {
			return validator ? validator(value) : true
		}
	}

	toJSON = () =>
		JSON.stringify({
			id: this.id,
			label: this.label,
			value: this.value || this.defaultValue,
			defaultValue: this.defaultValue,
			valueType: this.valueType,
			enumerableValue: this.enumerableValue,
		})

	get value() {
		return this._value
	}

	set value(value: any) {
		if (this.validateValue(value)) {
			this._value = value
			this.emit('update', value)

			if (this.node.initialized && this.isInputPin) {
				this.node.compute && this.node.compute()
			}
		}
	}

	get connected() {
		return !!this.connections.length
	}
}
