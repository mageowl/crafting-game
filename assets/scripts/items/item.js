import { draggable } from "../util/dragDrop.js";
import itemData from "./itemData.js";
import { HTMLItemSlotElement } from "./slot.js";
import { debug } from "../util/debug.js";
import { globalEventBoard } from "../util/events.js";

export class Item {
	/**
	 * @class Item
	 *
	 * @param {string} id The type of item.
	 * This will change its icon and name. The data is looked up in itemData.json
	 * @param {HTMLElement} [parent] The parent to add the element to.
	 */

	constructor(id, parent) {
		/**
		 * @property {string} type The type of item.
		 */
		this.id = id;
		this.data = itemData[id];
		if (debug.logItemData) {
			console.groupCollapsed(this.data.name);
			console.log("ID:", this.id);
			console.log("Metadata:", this.data);
			console.groupEnd();
		}

		this.element.classList.add("item");
		if (parent) {
			if (parent instanceof HTMLItemSlotElement) parent.addItem(this);
			else parent.appendChild(this.element);
		}

		let nameEl = document.createElement("span");
		nameEl.classList.add("name");
		nameEl.innerHTML = this.data.name;
		this.element.appendChild(nameEl);

		let iconEl = document.createElement("img");
		iconEl.classList.add("icon");
		iconEl.src = "assets/art/items/" + this.data.icon + ".png";
		this.element.appendChild(iconEl);

		draggable(this.element, (dropEl) => {
			dropEl.addItem(this);
		});
	}

	enableRightClick() {
		let property = (this.data.properties ?? []).filter((p) =>
			p.startsWith("rightClick")
		)[0];
		this.element.oncontextmenu = () => {
			new Function("item", property.split(":")[1]).call(null, this);
			globalEventBoard.post("itemUse", this.id, this.data);
		};
	}

	/**
	 * @property {HTMLDivElement} element The element repersenting the item.
	 */

	element = document.createElement("div");
	lastSlot = null;
}
