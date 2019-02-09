import Node from '../Node';
import Pin from '../Pin';
export declare namespace Wire {
    namespace Node {
        interface PinProps {
            id: string;
            value: string | number | boolean;
            defaultValue: string | number | boolean;
            label: string;
            valueType?: string;
            enumerableValue?: boolean;
        }
        interface NodeProps {
            id: string;
            name: string;
            category: string;
            inputPins: PinProps[];
            outputPins: PinProps[];
            repeatableInputPin: PinProps;
            position: {
                x: number;
                y: number;
            };
            data: any;
        }
    }
    namespace Connection {
        interface ConnectionProps {
            id: string;
            fromNode: Node;
            fromPin: Pin;
            toNode: Node;
            toPin: Pin;
        }
    }
}
