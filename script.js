'use strict';

// 1 
function deepEqual(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) return true;
    return false;
}

// 2
function* chunkArray(arr, num) {
    let len = arr.length;
    let tempArr = arr;

    for (let i = 0; i < len; i += num) yield tempArr.splice(0, num);
}

const iterator = chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 3);

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

// 3 
function bulkRun(array) {
    let promises = array.map(elem => elem[0](...elem[1]));
    // Возвращаем промис, когда все переданные в него промисы вполнятся
    return Promise.all(promises);
}

// В задании некорректный пример
const f1 = () => 1;
const f2 = a => a;
const f3 = (...args) => new Promise(resolve => setTimeout(resolve, 1000, args));

bulkRun(
    [
        [f1, []],
        [f2, [2]],
        [f3, [3, 4]]
    ]
).then(console.log); // Output: [1, 2, [3, 4]]

// 4
let matrix = [
    [5, 3, 6],
    [7, 11, 2],
    [15, 9, 4]
];

function getSmallestInMatrix(matrix) {
    let smallest = Infinity;
    let res = [];

    // Поиска наименьшего числа в матрице
    matrix.forEach(arr => {
        arr.forEach(elem => elem < smallest ? smallest = elem : false);
    });

    // Умножение на кажного нечётного числа на наименьшее число матрицы
    matrix.forEach(arr => {
        let tempArr = arr.map(elem => elem % 2 !== 0 ? elem * smallest : elem);
        res.push(tempArr);
    });

    return res;
}
console.log(getSmallestInMatrix(matrix));


// 5 
const insertedArr = [
    ['name', 'developer'],
    ['age', 5],
    ['skills', [
        ['html', 4],
        ['css', 5],
        ['js', 5]
    ]]
];

function arrayToObject(arr) {
    // Проверка является ли аргумент массивом
    if (!Array.isArray(arr)) throw new Error('Argument must be an array');

    return arr.reduce((obj, [key, val]) => {
        if (Array.isArray(val)) {
            obj[key] = arrayToObject(val);
            return obj;
        }
        obj[key] = val;
        return obj;
    }, {});
}
console.dir(arrayToObject(insertedArr));

// 6
async function getBase64FromUrl(url) {
    const img = await fetch(url);
    const blob = await img.blob();
    return new Promise(resolve => {
        const reader = new FileReader();
        // Читаем blob
        reader.readAsDataURL(blob);
        // Когда загрузка завершится
        reader.onloadend = () => {
            // Получаем base64 из fileReader
            const base64data = reader.result;
            resolve(base64data);
        };
    });
}

getBase64FromUrl('https://lh3.googleusercontent.com/i7cTyGnCwLIJhT1t2YpLW-zHt8ZKalgQiqfrYnZQl975-ygD_0mOXaYZMzekfKW_ydHRutDbNzeqpWoLkFR4Yx2Z2bgNj2XskKJrfw8')
    .then(console.log)
    .catch(console.error);


// 7
const insertedObj = {
    name: 'developer',
    age: 5,
    skills: {
        html: 4,
        css: 5,
        js: 5
    }
};

function objectToArray(obj) {
    // Проверка является ли аргумент обЪектом
    if (obj.toString() !== '[object Object]') throw new Error('Argument must be an object');

    let ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i);

    while (i--) {
        if (obj[ownProps[i]].toString() === '[object Object]') {
            obj[ownProps[i]] = objectToArray(obj[ownProps[i]]);
        }
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
}

console.dir(objectToArray(insertedObj));


// 8
const testElem = document.querySelector('.test');

function nodeChildCount(parentNode, mainNum) {
    let childCounter = 0;

    function insertedCounter(node, num) {
        if (num !== 0) {
            childCounter += node.childElementCount;
            num--;
            // Вместо node.children можно использовать node.childNodes, чтобы подсчитать ещё и кол-во текстовых нод
            for (let elem of node.children) {
                if (elem.hasChildNodes()) insertedCounter(elem, num);
            }
        }
    }
    insertedCounter(parentNode, mainNum);

    return childCounter;
}

console.log(nodeChildCount(testElem, 2));

// 9
String.prototype.removeDuplicate = function () {
    let set = new Set(this.split(' '));
    return [...set].join(' ');
};

console.log(("Int32 Int32 Int32 Int32 Int32 Int32 Int32 Int32 Int32 Double Double Double").removeDuplicate());

// 10
function NotificationException() {}

function ErrorException() {}

function primitiveMultiply(a, b) {
    const rand = Math.random();
    if (rand < 0.5) {
        return a * b;
    } else if (rand > 0.85) {
        throw new ErrorException();
    } else {
        throw new NotificationException();
    }
}

function reliableMultiply(a, b) {
    try {
        return primitiveMultiply(a, b);
    } catch (e) {
        if (e instanceof NotificationException) {
            return reliableMultiply(a, b);
        } else {
            throw e;
        }
    }
}

console.log(reliableMultiply(8, 8));