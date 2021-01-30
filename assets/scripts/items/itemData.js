/**
 * @typedef {Object} ItemData
 * @property {string} name Visual name of item.
 * @property {string} icon Name of image to use (minus the '.png'.)
 * @property {string[]} [properties=[]] Special properties of item (such as right click actions and item keeping)
 */

/** @type {Object<string, ItemData>} */
const data = {
	leather: {
		icon: "leather",
		name: "Leather"
	},
	paper: {
		icon: "paper",
		name: "Paper"
	},
	magicBook: {
		icon: "reference_book",
		name: "Magic Book (Right Click)",
		properties: ["rightClick:openReferenceGui(item)", "noReference"]
	},
	book: {
		icon: "book",
		name: "Book"
	},
	inkBottle: {
		icon: "ink",
		name: "Ink Bottle",
		properties: ["keep:glassBottle"]
	},
	glassBottle: {
		icon: "glass_bottle",
		name: "Glass Bottle"
	},
	waterBottle: {
		icon: "water_bottle",
		name: "Water Bottle",
		properties: ["keep:glassBottle"]
	},
	stick: {
		icon: "stick",
		name: "Stick"
	},
	fertilizer: {
		icon: "fertilizer",
		name: "Fertilizer"
	},
	tree: {
		icon: "tree",
		name: "Tree",
		properties: ["keep:fertilizer"]
	},
	log: {
		icon: "log",
		name: "Log"
	},
	woodenShovel: {
		icon: "wooden_shovel",
		name: "Wooden Shovel (Right Click)",
		properties: ["noReference", "rightClick:dig(1)"]
	},
	dirt: {
		icon: "dirt",
		name: "Dirt"
	},
	snow: {
		icon: "snowball",
		name: "Snowball"
	},
	sand: {
		icon: "sand",
		name: "Sand"
	},
	wheat: {
		icon: "wheat",
		name: "Wheat",
		properties: ["tag:lure.cow"]
	},
	flower: {
		icon: "poppy",
		name: "Flower"
	},
	grass: {
		icon: "grass_block",
		name: "Grass Block"
	},
	rock: {
		icon: "rock",
		name: "Rock"
	},
	stoneBlock: {
		icon: "stone_block",
		name: "Stone Block"
	},
	woodenPickaxe: {
		icon: "wooden_pickaxe",
		name: "Wooden Pickaxe (Right Click)",
		properties: ["rightClick:mine(1)"]
	},
	stonePickaxe: {
		icon: "stone_pickaxe",
		name: "Stone Pickaxe (Right Click)",
		properties: ["rightClick:mine(3)"]
	},
	stoneShovel: {
		icon: "stone_shovel",
		name: "Stone Shovel (Right Click)",
		properties: ["rightClick:dig(3)"]
	},
	coal: {
		icon: "coal",
		name: "Coal"
	}
};

export default data;
