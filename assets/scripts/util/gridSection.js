/**
 * 
 * @param {int} width The width of the subsection.
 * @param {int} height The height of the subsection.
 * @param {any[][]} grid The grid to divide.
 * @param {int} [offsetX=0] The offset of the subsection in the X direction.
 * @param {int} [offsetY=0] The offset of the subsection in the Y direction.
 */
export const gridSubsection = (width, height, grid, offsetX = 0, offsetY = 0) => {
    let subsection = grid
    subsection = subsection.slice(offsetY, height + offsetY)

    subsection.forEach((row, i) => {
        subsection[i] = row.slice(offsetX, width + offsetX)
    })

    return subsection
}