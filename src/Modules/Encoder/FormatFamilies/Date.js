export default class DateFamily {
	writeDate(date) {
		const timeInSeconds = Math.floor(Number(date) / 1000);
		let a;
		const timeInSecondsUint8Array = (a = new DataView(new ArrayBuffer(4)), a.setUint32(0, timeInSeconds), new Uint8Array(a.buffer));

		return this.writeExtension(-1, timeInSecondsUint8Array);
	}
}

DateFamily.prototype.writeTimestamp = DateFamily.prototype.writeDate;

