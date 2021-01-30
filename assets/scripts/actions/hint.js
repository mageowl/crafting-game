import { Item } from "../items/item.js";
import itemData from "../items/itemData.js";
import { globalEventBoard } from "../util/events.js";
import { debug } from "../util/debug.js";

const hintEl = document.querySelector("#bottom #hint");

/**
 * Sets hint text.
 *
 * @export
 * @param {string} text Text to set.
 * @param {Object} condition Condition to close hint.
 * @param {("craft"|"obtain"|"time")} condition.type Type of condition.
 * @param {(import("../crafting/recipes.js").ItemID)} condition.item Item to check.
 * @param {(import("../crafting/recipes.js").ItemID)} [condition.time] Delay until hint is hidden in milliseconds. Only used if type is 'time'.
 */
export function setHint(text, condition, callback) {
	if (debug.logHints) console.log(text);

	let compiledText = text
		.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
		.replace(/\$([^$]+)\$/g, (_, itemID) => {
			return `<img src="assets/art/items/${itemData[itemID].icon}.png" style="width:32px;image-rendering:pixelated;margin-bottom:-10px;" alt="${itemID}">`;
		});
	hintEl.innerHTML = compiledText;
	hintEl.style.display = "block";

	if (condition) {
		switch (condition.type) {
			case "craft":
				globalEventBoard.once("craftItem", (craftedItem) => {
					if (condition.item == craftedItem) {
						if (condition.next) {
							condition.next();
						} else {
							hideHint();
						}
					}
				});
				break;

			case "use":
				globalEventBoard.once("itemUse", (item) => {
					if (condition.item == item) {
						if (condition.next) {
							condition.next();
						} else {
							hideHint();
						}
					}
				});
				break;

			case "time":
				setTimeout(() => {
					if (condition.next) {
						condition.next();
					} else {
						hideHint();
					}
				}, condition.time);
		}
	}
}

function hideHint() {
	hintEl.style.display = "none";
}

setHint(
	"Hello! Welcome to **Crafting Game**. Your first task is to grow a $flower$.",
	{
		type: "craft",
		item: "flower",
		next() {
			setHint("Great! Maybe add more $fertilizer$...", {
				type: "craft",
				item: "tree",
				next() {
					setHint(
						"Whoops! That was probablly a **little** too much... Anyway, time to make some $log$s!",
						{
							type: "craft",
							item: "log",
							next() {
								setHint(
									"Great! You can use your $magicBook$ to get items you've already crafted.",
									{
										type: "use",
										item: "magicBook",
										next() {
											setHint(
												"Nice! Play around for a little while see what you can find...",
												{ type: "time", time: 5000 }
											);
										}
									}
								);
							}
						}
					);
				}
			});
		}
	}
);
