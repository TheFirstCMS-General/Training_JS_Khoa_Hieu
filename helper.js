function GetNumberInput(count, message) {
    let obj;
    while (true) {
        if (count == 0) {
            break;
        }
        obj = prompt(message);
        if (obj !== null && !isNaN(obj)) {
            break;
        }
        count--;
    }
    return obj;
}

export {GetNumberInput};