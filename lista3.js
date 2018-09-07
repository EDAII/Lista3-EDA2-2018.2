const NS_PER_SEC = 1e9;

function getRandomNumber(minValue = 0, maxValue = 10000000000000) {
    return Math.floor(Math.random() * maxValue) + minValue;
}

function getArrayOfRandomNumbers(arraySize = 10, maxValue = 10000000000000, minValue = 0) {
    let sortedArray = [];

    if (Math.sign(minValue) !== 1) { minValue = 0; }

    if (Math.sign(arraySize) !== 1) { arraySize = 10 }

    if (minValue >= maxValue) { minValue = 0; maxValue = 10000000000000; }

    if (Math.sign(maxValue) !== 1) { maxValue = 10000000000000; }

    if ((maxValue - minValue) < sortedArray) { arraySize = 10; minValue = 0; maxValue = 10000000000000; }

    while (sortedArray.length < arraySize) {
        const randomNumber = getRandomNumber(minValue, maxValue);
        if (sortedArray.indexOf(randomNumber) === -1) {
            sortedArray.push(randomNumber);
        }
    }
    return sortedArray;
}

function swap(array, a, b) {
    [array[a], array[b]] = [array[b], array[a]];
}

function shellSort(array) {
    let increment = array.length / 2;
    while (increment > 0) {
        for (let i = increment; i < array.length; i++) {
            let j = i;
            const temp = array[i];
            while (j >= increment && temp < array[j - increment]) {
                array[j] = array[j - increment];
                j -= increment;
            }
            array[j] = temp;
        }
        if (increment === 2) {
            increment = 1;
        } else {
            increment = Math.floor((increment * 5) / 11);
        }
    }
}

function partition(array, left, right) {
    const pivot = array[Math.floor((right + left) / 2)];
    let i = left;
    let j = right;
    while (i <= j) {
        while (array[i] < pivot) {
            i++;
        }
        while (pivot < array[j]) {
            j--;
        }
        if (i <= j) {
            swap(array, i, j);
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(array, left, right) {
    let index;
    if (array.length > 1) {
        index = partition(array, left, right);
        if (left < index - 1) {
            quickSort(array, left, index - 1);
        }
        if (index < right) {
            quickSort(array, index, right);
        }
    }
};

function findMaxValue(array) {
    if (array && array.length > 0) {
        let max = array[0];
        for (let i = 1; i < array.length; i++) {
            if (max < array[i]) {
                max = array[i];
            }
        }
        return max;
    }
    return undefined;
}

function findMinValue(array) {
    if (array && array.length > 0) {
        let min = array[0];
        for (let i = 1; i < array.length; i++) {
            if (array[i] < min) {
                min = array[i];
            }
        }
        return min;
    }
    return undefined;
}

function getBucketIndex(value, minValue, significantDigit, radixBase) {
    return Math.floor(((value - minValue) / significantDigit) % radixBase);
}

function countingSortForRadix(array, radixBase, significantDigit, minValue) {
    let bucketsIndex;
    const buckets = [];
    const aux = [];
    for (let i = 0; i < radixBase; i++) {
        buckets[i] = 0;
    }
    for (let i = 0; i < array.length; i++) {
        bucketsIndex = getBucketIndex(array[i], minValue, significantDigit, radixBase);
        buckets[bucketsIndex]++;
    }
    for (let i = 1; i < radixBase; i++) {
        buckets[i] += buckets[i - 1];
    }
    for (let i = array.length - 1; i >= 0; i--) {
        bucketsIndex = getBucketIndex(array[i], minValue, significantDigit, radixBase);
        aux[--buckets[bucketsIndex]] = array[i];
    }
    for (let i = 0; i < array.length; i++) {
        array[i] = aux[i];
    }
    return array;
};

function radixSort(array, radixBase = 10) {
    if (array.length < 2) {
        return array;
    }
    const minValue = findMinValue(array);
    const maxValue = findMaxValue(array);

    let significantDigit = 1;
    while ((maxValue - minValue) / significantDigit >= 1) {
        array = countingSortForRadix(array, radixBase, significantDigit, minValue);
        significantDigit *= radixBase;
    }
}

function merge(left, right) {
    let i = 0;
    let j = 0;
    const result = [];
    while (i < left.length && j < right.length) {
        result.push((left[i] < right[j]) ? left[i++] : right[j++]);
    }
    return result.concat(i < left.length ? left.slice(i) : right.slice(j));
}

function mergeSort(array) {
    if (array.length > 1) {
        const middle = Math.floor(array.length / 2);
        const left = mergeSort(array.slice(0, middle));
        const right = mergeSort(array.slice(middle, array.length));
        array = merge(left, right);
    }
}

let arrayWith1KRandomNumbers = getArrayOfRandomNumbers(1000, 10000);
// console.log('arrayWith1KRandomNumbers\t' + arrayWith1KRandomNumbers);
const timeQuickSort = process.hrtime();
quickSort(arrayWith1KRandomNumbers, 0, arrayWith1KRandomNumbers.length - 1);
const diffQuickSort = process.hrtime(timeQuickSort);
console.log(`\nquickSort(arrayWith1KRandomNumbers, 0, arrayWith1KRandomNumbers.length - 1): took ${diffQuickSort[0] * NS_PER_SEC + diffQuickSort[1]} nanoseconds or ${diffQuickSort[0] + diffQuickSort[1] / NS_PER_SEC} seconds.\n`);
// console.log('\narrayWith1KRandomNumbers sorted by quickSort\t' + arrayWith1KRandomNumbers);

arrayWith1KRandomNumbers = getArrayOfRandomNumbers(1000, 10000);
// console.log('\narrayWith1KRandomNumbers\t' + arrayWith1KRandomNumbers);
const timeRadixSort = process.hrtime();
radixSort(arrayWith1KRandomNumbers, 100);
const diffRadixSort = process.hrtime(timeRadixSort);
console.log(`\nradixSort(arrayWith1KRandomNumbers, 100): took ${diffRadixSort[0] * NS_PER_SEC + diffRadixSort[1]} nanoseconds or ${diffRadixSort[0] + diffRadixSort[1] / NS_PER_SEC} seconds.\n`);
// console.log('\narrayWith1KRandomNumbers sorted by radixSort\t' + arrayWith1KRandomNumbers);

arrayWith1KRandomNumbers = getArrayOfRandomNumbers(1000, 10000);
// console.log('\narrayWith1KRandomNumbers\t' + arrayWith1KRandomNumbers);
const timeShellSort = process.hrtime();
shellSort(arrayWith1KRandomNumbers);
const diffShellSort = process.hrtime(timeShellSort);
console.log(`\nshellSort(arrayWith1KRandomNumbers): took ${diffShellSort[0] * NS_PER_SEC + diffShellSort[1]} nanoseconds or ${diffShellSort[0] + diffShellSort[1] / NS_PER_SEC} seconds.\n`);
// console.log('\narrayWith1KRandomNumbers sorted by shellSort\t' + arrayWith1KRandomNumbers);

arrayWith1KRandomNumbers = getArrayOfRandomNumbers(1000, 10000);
// console.log('\narrayWith1KRandomNumbers\t' + arrayWith1KRandomNumbers);
const timeMergeSort = process.hrtime();
mergeSort(arrayWith1KRandomNumbers);
const diffMergeSort = process.hrtime(timeMergeSort);
console.log(`\nmergeSort(arrayWith1KRandomNumbers): took ${diffMergeSort[0] * NS_PER_SEC + diffMergeSort[1]} nanoseconds or ${diffMergeSort[0] + diffMergeSort[1] / NS_PER_SEC} seconds.\n`);
// console.log('\narrayWith1KRandomNumbers sorted by shellSort\t' + arrayWith1KRandomNumbers);
