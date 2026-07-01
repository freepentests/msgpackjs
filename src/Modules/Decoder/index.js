import TypeIdentifiers from './TypeIdentifiers.js';

import MixinHelper from '../MixinHelper.js';

import ByteBuffer from 'bytebuffer'; 
import msgpack from '@msgpack/msgpack';

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

	decode8ByteLengthBinArray(bb) {
		const length = bb.readUint8();
		const bytes = bb.readBytes(length).toBuffer();

		return new Uint8Array(bytes);
	}

	decode16ByteLengthBinArray(bb) {
		const length = bb.readUint16();
		const bytes = bb.readBytes(length).toBuffer();

		return new Uint8Array(bytes);
	}

	decode32ByteLengthBinArray(bb) {
		const length = bb.readUint32();
		const bytes = bb.readBytes(length).toBuffer();

		return new Uint8Array(bytes);
	}

	decodeFloat32(bb) {
		const number = bb.readFloat32();

		return number;
	}

	decodeFloat64(bb) {
		const number = bb.readFloat64();

		return number;
	}

	decode8ByteLengthString(bb) {
		const length = bb.readUint8();
		const string = bb.readUTF8String(length);

		return string;
	}

	decode16ByteLengthString(bb) {
		const length = bb.readUint16();
		const string = bb.readUTF8String(length);

		return string;
	}

	decode32ByteLengthString(bb) {
		const length = bb.readUint32();
		const string = bb.readUTF8String(length);

		return string;
	}

	decodeFixArray(bb) {
		bb.offset--; // initial byte has already been read and we need to read it again, so offset needs to go back by 1
		const length = bb.readUint8() & 0b00001111;

		const elements = [];

		for (let i = 0; i < length; i++) {
			elements.push(this.decode(bb));
		}

		return elements;
	}

	decode(data) {
		const bb = data.__isByteBuffer__ ? data : ByteBuffer.wrap(data);

		const typeIdentifier = bb.readUint8(); // the first byte identifies the type of data that has been encoded (type identifier)

		const isPositiveFixint = typeIdentifier >= 0 && typeIdentifier < 128;
		const isNegativeFixint = typeIdentifier >= TypeIdentifiers.negativeFixint && typeIdentifier < TypeIdentifiers.negativeFixint + 32;
		const isFixStr = typeIdentifier >= TypeIdentifiers.fixStr && typeIdentifier < TypeIdentifiers.fixStr + 32;
		const isFixArray = typeIdentifier >= TypeIdentifiers.fixArray && typeIdentifier < TypeIdentifiers.fixArray + 16;

		if (isPositiveFixint) {
			return this.decodePositiveFixint(bb);
		} else if (isNegativeFixint) {
			return this.decodeNegativeFixint(bb);
		} else if (isFixStr) {
			return this.decodeFixStr(bb);
		} else if (isFixArray) {
			return this.decodeFixArray(bb);
		}

		switch (typeIdentifier) {
			case TypeIdentifiers.trueBool: return true;
			case TypeIdentifiers.falseBool: return false;
			case TypeIdentifiers.nil: return null;

			case TypeIdentifiers.binArray8Byte: return this.decode8ByteLengthBinArray(bb);
			case TypeIdentifiers.binArray16Byte: return this.decode16ByteLengthBinArray(bb);
			case TypeIdentifiers.binArray32Byte: return this.decode32ByteLengthBinArray(bb);

			case TypeIdentifiers.float32: return bb.readFloat32();
			case TypeIdentifiers.float64: return bb.readFloat64();

			case TypeIdentifiers.uint8: return bb.readUint8();
			case TypeIdentifiers.uint16: return bb.readUint16();
			case TypeIdentifiers.uint32: return bb.readUint32();
			case TypeIdentifiers.uint64: return bb.readUint64();

			case TypeIdentifiers.int8: return bb.readInt8();
			case TypeIdentifiers.int16: return bb.readInt16();
			case TypeIdentifiers.int32: return bb.readInt32();
			case TypeIdentifiers.int64: return bb.readInt64();

			case TypeIdentifiers.str8Byte: return this.decode8ByteLengthString(bb);
			case TypeIdentifiers.str16Byte: return this.decode16ByteLengthString(bb);
			case TypeIdentifiers.str32Byte: return this.decode32ByteLengthString(bb);
		}
	}
}

