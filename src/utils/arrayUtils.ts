export const shuffle = <T>(array: T[]): T[] => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export const arrayAlreadyHasArray = <T>(arr: T[][], testArr: T[]): boolean => {
    for (var i = 0; i < arr.length; i++) {
        let checker = []
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === testArr[j]) {
                checker.push(true)
            } else {
                checker.push(false)
            }
        }
        if (checker.every(check => check === true)) {
            return true
        }
    }
    return false
}