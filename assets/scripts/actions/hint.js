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
 * @param {("craft"|"use"|"time"|"obtain")} condition.type Type of condition.
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
		let listenerID;

		switch (condition.type) {
			case "craft":
				listenerID = globalEventBoard.on("craftItem", (craftedItem) => {
					if (condition.item == craftedItem) {
						if (condition.next) {
							condition.next();
						} else {
							hideHint();
						}

						globalEventBoard.off(listenerID);
					}
					console.log(craftedItem);
				});
				console.log(listenerID);
				break;

			case "use":
				listenerID = globalEventBoard.on("itemUse", (item) => {
					if (condition.item == item) {
						if (condition.next) {
							condition.next();
						} else {
							hideHint();
						}

						globalEventBoard.off(listenerID);
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
												"Nice! Play around for a little while and see what you can find... hint: **somebody** (aka Dave) put in Minecraft recipes.",
												{ type: "time", time: 7000 }
											);

											let listenerID = globalEventBoard.on(
												"craftItem",
												(craftedItem) => {
													if (craftedItem == "woodenPickaxe") {
														setHint(
															"A $woodenPickaxe$?!?! You weren't suposed to get that yet! **DAVE!!** -pause- **YES THERE'S A PROBLEM! HE GOT A PICKAXE!** -pause- **NO IT'S NOT A $diamondPickaxe$! IT'S WOODEN!** -pause- Oh, well. I suppose you should mine some rocks...",
															{
																type: "obtain",
																item: "stone",
																next() {
																	setHint(
																		"Amazing! Now if you can remember that pickaxe recipe...",
																		{
																			type: "craft",
																			item: "stonePickaxe",
																			next() {
																				setHint(
																					"Perfect! Now all we need is a $stoneShovel$. (Put a stone on a long stick.)"
																				);
																			}
																		}
																	);
																}
															}
														);

														globalEventBoard.off(listenerID);
													}
												}
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
