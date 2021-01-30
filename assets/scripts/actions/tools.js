import { Item } from "../items/item.js";
import { getInventory } from "../items/slot.js";

let tables = {
	shovel: [
		{
			item: "dirt",
			weight: 10
		},
		{
			item: "sand",
			weight: 8
		},
		{
			item: "snow",
			weight: 7
		}
	],
	pickaxe: [
		{
			item: "rock",
			weight: 10
		},
		{
			item: "coal",
			weight: 9
		},
		{
			item: "ironBar",
			weight: 7
		}
	]
};

window.dig = function (toolPower) {
	let compiledTable = tables.shovel
		.filter((item) => item.weight >= 10 - toolPower)
		.flatMap((item) => new Array(item.weight).fill(item.item));
	let item = new Item(
		compiledTable[Math.floor(Math.random() * compiledTable.length)],
		getInventory()
	);
};

window.mine = function (toolPower) {
	let compiledTable = tables.pickaxe
		.filter((item) => item.weight >= 10 - toolPower)
		.flatMap((item) => new Array(item.weight).fill(item.item));
	let item = new Item(
		compiledTable[Math.floor(Math.random() * compiledTable.length)],
		getInventory()
	);
};
