import { debug } from "../util/debug.js";

class EventBoard {
	constructor() {
		this.eventList = {};
		this.onceList = {};
		this.starList = [];
		this.onceStarList = [];
	}

	watch(event, callback) {
		if (event != "*") {
			if (!this.eventList[event]) this.eventList[event] = [callback];
			else this.eventList[event].push(callback);
		} else {
			this.starList.push(callback);
		}
	}

	once(event, callback) {
		if (debug.logOnceListeners) console.log(event);
		if (event != "*") {
			if (!this.onceList[event]) this.onceList[event] = [callback];
			else this.onceList[event].push(callback);
		} else {
			this.onceStarList.push(callback);
		}
	}

	post(event, ...data) {
		if (event == "*") {
			if (!debug.hideEventPurge)
				console.warn("Trying to post '*'. Purging event board...");
			Object.values(this.eventList)
				.flat()
				.forEach((cb) => {
					cb(...data);
				});
			return true;
		} else {
			let eventFound = false;
			this.starList.forEach((cb) => cb(event));

			if (this.eventList[event]) {
				this.eventList[event].forEach((cb) => {
					cb(...data);
				});
				eventFound = true;
			}

			if (this.onceList[event]) {
				this.onceList[event].filter((cb) => {
					cb(...data);
				});

				if (debug.logOnceListeners) console.log(this.onceList[event]);

				eventFound = true;
			}

			return eventFound;
		}
	}
}

export const globalEventBoard = new EventBoard();

if (debug.globalEventPosts) globalEventBoard.watch("*", console.log);
