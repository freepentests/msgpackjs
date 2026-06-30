import TypeIdentifiers from './TypeIdentifiers.js';

import MixinHelper from '../MixinHelper.js';

import ByteBuffer from 'bytebuffer'; 
//import msgpack from '@msgpack/msgpack';

export default class Decoder {
	decode(data) {
		const bb = ByteBuffer.wrap(data);

		const typeIdentifier = bb.readUint8(); // the first byte identifies the type of data that has been encoded (type identifier)
	}
}

