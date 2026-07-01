import ExtData from '../../ExtData.js';

export default class DateFamily {
	writeDate(date) {
		const timeInSeconds = Math.floor(Number(date) / 1000);
		let a;
		const timeInSecondsUint8Array = (a = new DataView(new ArrayBuffer(4)), a.setUint32(0, timeInSeconds), new Uint8Array(a.buffer));

		const extData = new ExtData(-1, timeInSecondsUint8Array);

		return this.writeExtension(extData);
	}
}

DateFamily.prototype.writeTimestamp = DateFamily.prototype.writeDate;

