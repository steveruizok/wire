import * as EventEmitter from 'eventemitter3';

import {Wire} from './misc/types';

export default class Node extends EventEmitter {
  constructor(props: Wire.Node.NodeProps) {
    super();
  }
}