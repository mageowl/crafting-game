import { debug } from "../util/debug.js";

class EventBoard {
	constructor() {
		/** @type {Object<string,Function[]>} */
		this.eventList = {};
		this.starList = [];
	}

	/**
	 * Adds listener to event board
	 *
	 * @param {string} event Event to attach callback to.
	 * @param {Function} callback Callback to event.
	 * @returns {number} ID of callback. Used in `EventBoard.off(id)`
	 * @memberof EventBoard
	 */
	on(event, callback) {
		if (event != "*") {
			let id =
				Object.values(this.eventList).length > 0
					? Object.values(this.eventList)
							.flat()
							.map((v) => v.id)
							.reduce((a, b) => (a < b ? b : a)) + 1
					: 0;
			if (!this.eventList[event]) this.eventList[event] = [{ callback, id }];
			else this.eventList[event].push({ callback, id });

			return id;
		} else {
			this.starList.push(callback);
		}
	}

	off(id) {
		let eventNameFound = false;
		Object.values(this.eventList).forEach((eventCallbacks, i) => {
			let eventName = Object.keys(this.eventList)[i];
			eventCallbacks.forEach((obj, i) => {
				if (obj.id == id) {
					delete this.eventList[eventName][i];
					eventNameFound = eventName;
				}
			});
		});

		if (eventNameFound) {
			this.eventList[eventNameFound].filter((v) => v != null);
			return true;
		} else return false;
	}

	post(event, ...data) {
		if (event == "*") {
			if (!debug.hideEventPurge)
				console.warn("Trying to post '*'. Purging event board...");
			Object.values(this.eventList)
				.flat()
				.forEach((obj) => {
					obj.callback(...data);
				});
			return true;
		} else {
			this.starList.forEach((cb) => cb(event));

			if (this.eventList[event]) {
				this.eventList[event].forEach((obj) => {
					obj.callback(...data);
				});
				return true;
			} else return false;
		}
	}
}

export const globalEventBoard = new EventBoard();

if (debug.logGlobalEventPosts) globalEventBoard.on("*", console.log);
