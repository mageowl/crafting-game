import { Item } from "../items/item.js";
import { getInventory } from "../items/slot.js";

const inventory = getInventory();

let gui = document.getElementById("reference-gui");

let timer = 0;
let guiOpen = false;
let book;

gui.style.display = "none";

window.openReferenceGui = (item) => {
	if (timer == 1) return;
	if (guiOpen) {
		guiOpen = false;
		gui.style.display = "none";
		return;
	}

	gui.style.display = "block";
	book = item;
	guiOpen = true;
};

window.takeReference = (id) => {
	new Item(id, inventory);
	gui.style.display = "none";
	book.element.querySelector("img").src = "assets/art/items/book.png";
	guiOpen = false;

	timer = 1;
	setTimeout(() => {
		timer = 0;
		book.element.querySelector("img").src =
			"assets/art/items/reference_book.png";
	}, 1000);
};

export let unlockedItems = [];

export const makeReference = (item) => {
	if (unlockedItems.includes(item.id)) return;

	unlockedItems.push(item.id);
	let icon = document.createElement("img");
	icon.classList.add("icon");
	icon.src = "assets/art/items/" + item.data.icon + ".png";
	icon.onclick = new Function(`takeReference("${item.id}")`);
	document.getElementById("reference-gui").appendChild(icon);
};
