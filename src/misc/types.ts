import Node from '../Node';
import Pin from '../Pin';

export namespace Wire {

	export namespace Node {
		export interface PinProps {
			id: string;
			value: string | number | boolean;
			label: string;
			valueType?: string;
		}

		export interface NodeProps {
			id: string;
			inputPins: PinProps[];
			outputPins: PinProps[];
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