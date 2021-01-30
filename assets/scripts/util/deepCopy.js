export const deepCopy = (array) => {
    return array.map(el => Array.isArray(el) ? deepCopy(el) : el)
}