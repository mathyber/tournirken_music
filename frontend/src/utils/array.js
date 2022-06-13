export const unique = (array) => {
    let newArray = [];
    array.map(v => {
        !newArray.find(n => n.id === v.id) && newArray.push(v);
    })
    return newArray;
}