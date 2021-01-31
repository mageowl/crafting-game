import { EventBoard } from "../util/events";

export const getInventory = () => {
	return Array.from(document.getElementsByTagName("item-slot")).filter(
		(value) => value.inventory
	)[0];
};

export class HTMLItemSlotElement extends HTMLElement {
	get inventory() {
		return this.hasAttribute("inventory");
	}

	set inventory(val) {
		if (val) this.setAttribute("inventory", "");
		else this.removeAttribute("inventory");

		if (this.inventory) this.classList.add("inventory");
		else this.classList.remove("inventory");
	}

	items = [];
	eventBoard = new EventBoard();

	get item() {
		return this.items[0] || { id: "none" };
	}

	set item(val) {
		this.addItem(val);
	}

	set items(val) {
		this.addItem(val);
	}

	itemdropevent = () => {};

	set onitemdrop(val) {
		this.itemdropevent = val;
	}

	itemtakeevent = () => {};

	set onitemtake(val) {
		this.itemtakeevent = val;
	}

	/**
	 * @class An HTML Element repersenting a item slot
	 */
	constructor() {
		super();

		this.classList.add("drop");
		if (this.inventory) this.classList.add("inventory");
	}

	/**
	 * @param {Item} item
	 * @param {boolean} [setItem = false] Set to true to replace the item (if there is one) without putting it in the inventory.
	 * @param {boolean} [triggerEvents = true] Set to false to keep events from triggering.
	 */
	addItem(item, setItem = false, triggerEvents = true) {
		if (item.lastSlot != null) {
			item.lastSlot.items.splice(0, 1);
			if (triggerEvents) item.lastSlot.itemtakeevent(item);
		}
		item.lastSlot = this;
		if (!this.inventory && this.item.id != "none") {
			if (!setItem) getInventory().addItem(this.item);
			else this.item.element.remove();
			this.items.splice(0, 1);
			if (triggerEvents) item.lastSlot.itemtakeevent(item);
		}

		this.items.push(item);
		this.appendChild(item.element);

		if (triggerEvents) {
			this.itemdropevent(item);
			this.eventBoard.post("itemDrop", item.id, item.data);
		}
	}

	removeItem() {
		this.item.element.remove();
		this.items.splice(0, 1);
	}
}

window.customElements.define("item-slot", HTMLItemSlotElement);
