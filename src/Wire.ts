import Node from './Node';
import Pin from './Pin';

import {Wire} from './misc/types';

const Wire: Wire.Library = {
  Node: Node,
  Pin: Pin
};

export default Wire;