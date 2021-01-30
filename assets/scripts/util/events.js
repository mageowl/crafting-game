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
			if (!this.eventList[event]) this.eventList[event] = [callback];
			else this.eventList[event].push(callback);

			return Object.values(this.eventList).flat().length;
		} else {
			this.starList.push(callback);
		}
	}

	off(id) {
		let eventNameFound = false;
		Object.values(this.eventList).forEach((eventCallbacks, eventIndex) => {
			let eventName = Object.keys(this.eventList);
			eventCallbacks.forEach((_, callbackIndex) => {
				if (callbackIndex + eventIndex == id) {
					delete this.eventList[eventName][callbackIndex];
					eventNameFound = eventName;
				}
			});
		});
		if (eventNameFound) {
			this.eventList[eventNameFound].filter((v) => v != null);
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
			this.starList.forEach((cb) => cb(event));

			if (this.eventList[event]) {
				this.eventList[event].forEach((cb) => {
					cb(...data);
				});
				return true;
			} else return false;
		}
	}
}

export const globalEventBoard = new EventBoard();

if (debug.logGlobalEventPosts) globalEventBoard.on("*", console.log);
