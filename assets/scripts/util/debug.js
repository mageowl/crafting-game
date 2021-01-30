/**
 * @typedef {Object} DebugConfig
 * @property {Boolean} [logItemData=false] Set to log item data when created
 * @property {Boolean} [logGlobalEventPosts=false] Set to log when events are posted
 * @property {Boolean} [hideEventPurge=false] Set to not warn when * is brodcasted.
 * @property {Boolean} [logHints=false] Set to log when the hint is changed.
 * @property {Boolean} [logCraftingCheck=false] Set to log crafting check data.
 */

/**
 * @type {DebugConfig}
 */
export const debug = {
	logGlobalEventPosts: true
};
