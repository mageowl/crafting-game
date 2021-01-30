import recipes from "./recipes.js";
import { Item } from "../items/item.js";
import { getInventory } from "../items/slot.js";
import { deepCopy } from "../util/deepCopy.js";
import { makeReference } from "../actions/reference.js";
import { globalEventBoard } from "../util/events.js";
import "../actions/tools.js";

let craftingGrid = [[], [], []];
let row = 0;

const gridItemChange = () => {
	if (result.item.id != "none") result.removeItem();
	Object.values(recipes).forEach((recipeObj) => {
		let compiledRecipe = [];
		if (recipeObj.size != 1) {
			recipeObj.recipe.forEach((row, rowN) => {
				if (recipeObj.size - 10 < 0) {
					compiledRecipe.push([]);
					row.forEach((itemTag) => {
						compiledRecipe[rowN].push(recipeObj.itemMap[itemTag] ?? "none");
					});
				} else compiledRecipe.push([recipeObj.itemMap[row] ?? "none"]);
			});
		}

		let compiledTable = [];
		craftingGrid.forEach((row, rowN) => {
			compiledTable.push([]);
			row.forEach((slot) => {
				compiledTable[rowN].push(slot.item.id);
			});
		});

		const checkSection = (offsetX = 0, offsetY = 0) => {
			let section = deepCopy(compiledRecipe);
			let width = section[0].length;
			let height = section.length;

			if (width < 3) {
				let distance = 3 - width;
				section.forEach((row) => {
					if (offsetX >= 1) row.unshift(...new Array(offsetX).fill("none"));
					if (offsetX <= 1) row.push(...new Array(distance).fill("none"));
					if (offsetX == 1) row.pop();
				});
			}

			if (height < 3) {
				let distance = 3 - height;
				if (offsetY >= 1)
					section.unshift(
						...new Array(distance).fill(["none", "none", "none"])
					);
				else
					section.push(...new Array(distance).fill(["none", "none", "none"]));
			}

			if (JSON.stringify(section) == JSON.stringify(compiledTable)) {
				result.addItem(new Item(recipeObj.result), true, false);
				return true;
			}

			return false;
		};

		switch (recipeObj.size) {
			case 3:
				checkSection();
				break;

			case 2:
				checkSection(0, 0);
				checkSection(1, 0);
				checkSection(0, 1);
				checkSection(1, 1);
				break;

			case 13:
				checkSection(0);
				checkSection(1);
				checkSection(2);

			case 12:
				checkSection(0, 0);
				checkSection(1, 0);
				checkSection(2, 0);
				checkSection(0, 1);
				checkSection(1, 1);
				checkSection(2, 1);

			case 1:
				let containsItems = true;
				let tableItems;
				recipeObj.recipe.forEach((item) => {
					let found = false;
					tableItems = 0;
					compiledTable.forEach((row) => {
						if (row.includes(item)) found = true;
						tableItems += row.filter((item) => item != "none").length;
					});
					if (!found) containsItems = false;
				});
				if (containsItems && recipeObj.recipe.length == tableItems) {
					result.addItem(new Item(recipeObj.result), true, false);
				}
		}
	});
};

let result;
Array.from(document.getElementsByTagName("item-slot")).forEach((slot) => {
	if (!slot.inventory && slot.id != "result") {
		craftingGrid[row].push(slot);
		if (craftingGrid[row].length == 3) row++;

		slot.onitemdrop = gridItemChange;
		slot.onitemtake = gridItemChange;
	} else if (slot.id == "result") {
		result = slot;
		slot.onitemtake = (item) => {
			let reference = true;
			(item.data.properties ?? []).forEach((property) => {
				let name = property.split(":")[0];
				switch (name) {
					case "rightClick":
						item.enableRightClick();
						break;

					case "noReference":
						reference = false;
						break;

					default:
						break;
				}
			});

			if (reference) {
				makeReference(item);
			}

			craftingGrid.forEach((row) => {
				row.forEach((gridSlot) => {
					let gridItem = gridSlot.item;

					if (gridItem.id != "none") {
						let keepID = "none";
						(gridItem.data.properties ?? []).forEach((property) => {
							let name = property.split(":")[0];
							switch (name) {
								case "keep":
									keepID = property.split(":")[1];
									break;

								default:
									break;
							}
						});

						gridSlot.removeItem();
						if (keepID != "none") {
							let keepItem = new Item(keepID);
							gridSlot.addItem(keepItem);
						}
					}
				});
			});

			gridItemChange();
			globalEventBoard.post("craftItem", item.id, item.data);
		};

		slot.classList.remove("drop");
	}
});
