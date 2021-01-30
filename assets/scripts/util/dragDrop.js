let dragging = null

/**
 * @callback dropHandler
 * @param {HTMLElement} drop The element that the object was dropped on.
 * @param {HTMLElement} [object] The orginal object.
 */

let defaultOptions = { transisions: false }

/**
 * @function draggable Set up draggable object.
 * @param {HTMLElement} object The object to set up dragging for.
 * @param {dropHandler} handler Callback for drop.
 * @param {object} [options = defaultOptions] Options for drag and drop sequence
 * @param {boolean} [options.transisions = false] Use css transisions to animate the movement 
 */
export const draggable = (object, handler, options = defaultOptions) => {
	object.droppable = true
	object.dropHandler = handler
	object.style.cursor = "grab"
	object.onmousedown = function (event) {

		if (object.droppable == false || event.button == 2) return

		let top = object.style.top
		let left = object.style.left
		let noParentLeft = object.getBoundingClientRect().left
		let noParentTop = object.getBoundingClientRect().top
		
		let parent = object.parentNode

		let shiftX = event.clientX - noParentLeft
		let shiftY = event.clientY - noParentTop

		dragging = object

		object.style.position = "absolute"
		object.style.cursor = "grabbing"
		if (options.transisions) object.style.transform = "scale(1.2)"
		object.style.zIndex = 1
		document.body.append(object)

		moveAt(event.pageX, event.pageY)

		// moves the object at (pageX, pageY) coordinates
		// taking initial shifts into account
		function moveAt(pageX, pageY) {
			object.style.left = pageX - shiftX + "px"
			object.style.top = pageY - shiftY + "px"
		}

		function onMouseMove(event) {
			moveAt(event.pageX, event.pageY)
		}

		// move the object on mousemove
		document.addEventListener("mousemove", onMouseMove)

		let currentDrop = null

		// Drop the object, remove unneeded handlers
		function drop (event) {
			object.style.transform = "none"
			object.style.zIndex = -1
			object.style.cursor = "grab"

			dragging = null

			// Check for object to drop onto.
			let elemBelow = document.elementFromPoint(event.clientX, event.clientY)
			object.style.zIndex = 0

			let dropBelow = elemBelow.closest('.drop')

			if (options.transisions) object.style.transition = "top 500ms, left 500ms, transform 400ms"
			if (dropBelow != currentDrop) {
				object.droppable = false
				currentDrop = dropBelow
				if (currentDrop) {
					handler(currentDrop, object)
					object.style.left = currentDrop.getBoundingClientRect().left
					object.style.top = currentDrop.getBoundingClientRect().top
					object.dropped = true
					let left = currentDrop.style.left
					let top = parseInt(currentDrop.style.top) + 198
					setTimeout(() => {
						if (options.transisions) object.style.transition = "transform 400ms"
						object.style.left = left
						object.style.top = top
						if (options.transisions) {
							setTimeout(() => {
								object.droppable = true
								object.style.zIndex = "unset"
							}, 300)
						}
					}, 1001)
					if (!options.transisions) {
						object.droppable = true
						object.style.zIndex = "unset"
					}
				}
			} else {
				object.style.left = parseInt(noParentLeft) + 0	
				object.style.top = noParentTop
				setTimeout(() => {
					if (options.transisions) object.style.transition = "transform 400ms"
					parent.appendChild(object)
					object.style.left = left
					object.style.top = top
				}, 501)
			}

			document.removeEventListener("mousemove", onMouseMove)
			object.onmouseup = null

		}

		object.drop = drop
		object.onmouseup = drop
	}

	object.ondragstart = function () {
		return false
	}
}

export const undraggable = (object) => {
	object.droppable = false
	object.onmousedown = null
}

window.oncontextmenu = (e) => {
	if (!e.metaKey) e.preventDefault()
}

document.onmouseleave = (e) => {
	if (dragging) {
		dragging.drop({ clientX: 0, clientY: 0 })
	}
}