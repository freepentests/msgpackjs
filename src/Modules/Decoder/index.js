import TypeIdentifiers from './TypeIdentifiers.js';

import MixinHelper from '../MixinHelper.js';

import ByteBuffer from 'bytebuffer'; 
//import msgpack from '@msgpack/msgpack';

export default class Decoder {
	decodePositiveFixint(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		return bb.readUint8() & 0b01111111;
	}

	decodeNegativeFixint(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		return bb.readUint8() - 256;
	}

	decodeFixStr(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		const initialByte = bb.readUint8();

		const stringLength = initialByte & 0b00011111;
		const stringContents = bb.readUTF8String(stringLength);

		return stringContents;
	}

	decode(data) {
		const bb = ByteBuffer.wrap(data);

		const typeIdentifier = bb.readUint8(); // the first byte identifies the type of data that has been encoded (type identifier)

		const isPositiveFixint = typeIdentifier >= 0 && typeIdentifier < 128;
		const isNegativeFixint = typeIdentifier >= TypeIdentifiers.negativeFixint && typeIdentifier < TypeIdentifiers.negativeFixint + 32;
		const isFixStr = typeIdentifier >= TypeIdentifiers.fixStr && typeIdentifier < TypeIdentifiers.fixStr + 32;

		if (isPositiveFixint) {
			return this.decodePositiveFixint(bb);
		} else if (isNegativeFixint) {
			return this.decodeNegativeFixint(bb);
		} else if (isFixStr) {
			return this.decodeFixStr(bb);
		}
	}
}

