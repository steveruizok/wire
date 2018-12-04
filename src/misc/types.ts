import Node from '../Node';
import Pin from '../Pin';

export namespace Wire {

	export namespace Node {
		export interface PinProps {
			id: string;
			value: string | number | boolean;
			label: string;
			valueType?: string;
			enumerableValue?: boolean;
		}

		export interface NodeProps {
			id: string;
			label: string;
			inputPins: PinProps[];
			outputPins: PinProps[];
			position: {
				x: number;
				y: number;
			}
		}
	}

	export namespace Connection {
		export interface ConnectionProps {
			id: string;
			fromNode: Node;
			fromPin: Pin;
			toNode: Node;
			toPin: Pin;
		}
	}
}