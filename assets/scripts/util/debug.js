/**
 * @typedef {Object} DebugConfig
 * @property {Boolean} [itemData=false] Set to log item data when created
 * @property {Boolean} [globalEventPosts=false] Set to log when events are posted
 * @property {Boolean} [hideEventPurge=false] Set to not warn when * is brodcasted.
 * @property {Boolean} [logHints=false] Set to log when the hint is changed.
 * @property {Boolean} [logOnceListeners=false] Set to log when a once listener is fired.
 */

/**
 * @type {DebugConfig}
 */
export const debug = {
	globalEventPosts: true
};
