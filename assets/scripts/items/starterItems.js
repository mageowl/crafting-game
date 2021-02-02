import { getInventory } from "./slot.js";
import { Item } from "./item.js";

const inventory = getInventory();

[
	new Item("magicBook", inventory).enableRightClick(),
	new Item("sand", inventory),
	new Item("litFurnace", inventory),
	new Item("sand", inventory)
];
