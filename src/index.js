import Encoder from './Modules/Encoder/index.js';
import Decoder from './Modules/Decoder/index.js';
import ExtData from './Modules/ExtData.js';

const encoder = new Encoder();
const decoder = new Decoder();

const msgpack = {
	encode: encoder.encode.bind(encoder),
	decode: decoder.decode.bind(decoder)
};

export { Encoder, Decoder, ExtData };
export default msgpack;

