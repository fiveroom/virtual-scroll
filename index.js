const container = document.querySelector('.container');
const containerContent = document.querySelector('.container-content');
const containerVirtualMark = document.querySelector('.container-virtual-mark');
const containerHeight = container.clientHeight;
const containerWidth = container.clientWidth;
const PRERENDER_COUNT = 10;
const dataList = Array.from({length: 20000}).map((_, index) => index.toString());
const itemCount = dataList.length;
const itemSize = 54;
const itemWidthSize = 40;
const itemWidthCount = 100;

const itemWidthArray = Array.from({length: itemWidthCount})
    .map((_, index) => Math.round(Math.floor(Math.random() * (60 - 20 + 1))) + 70);

const itemCache = new Map();
const fixedRow = [];
const fixedCol = [];


/**
 *
 * @type {Array<number>}
 */
let sumOfIndex = []

let s = 0;
for (let i = 0; i < itemWidthArray.length; i++) {
    s = sumOfIndex[i] = s + itemWidthArray[i];
}

/**
 *
 * @type {HTMLDivElement[]}
 */
let cacheRow = [];

setVirtualSize();
render()
container.addEventListener('scroll', () => {
    render()
});

function render() {
    const verticalRange = getVerticalRenderRange();
    const horizontalRange = getHorizontalRenderRange();
    renderRange(verticalRange, horizontalRange);
    upDateOffset(verticalRange, horizontalRange);
}

function renderItem(source) {
    const item = document.createElement('div');
    item.classList.add('item');
    return item
}

function setVirtualSize() {
    containerVirtualMark.style.cssText = `height: ${itemCount * itemSize}px;width: ${itemWidthArray.reduce((a, b) => a + b, 0)}px;`;
}

function renderRange(range, horizontalRange) {
    containerContent.innerHTML = '';
    // cacheRow = [];
    const list = dataList.slice(range.start - 1, range.end);
    list.forEach(i => {
        const row = renderItem(i);
        // cacheRow.push(row);
        for (let j = horizontalRange.start - 1; j < horizontalRange.end; j++) {
            row.appendChild(renderCell(`${i}-${j}`, j));
        }
        containerContent.appendChild(row);
    })
}

function renderCell(value, index) {
    const div = document.createElement('div');
    div.innerText = value;
    div.style.flexBasis = itemWidthArray[index] + 'px';
    div.style.height = '100%';
    div.classList.add('cell');
    return div
}

function getVerticalRenderRange() {
    const scrollTop = container.scrollTop;
    let startIndex = Math.ceil(scrollTop / itemSize);
    let endIndex = startIndex + Math.ceil(containerHeight / itemSize);
    let start = Math.max(1, startIndex - PRERENDER_COUNT);
    let end = Math.min(itemCount, endIndex + PRERENDER_COUNT);
    return {start, end}
}

function getHorizontalRenderRange() {
    const scrollLeft = container.scrollLeft;
    let startIndex = binarySearch(sumOfIndex, scrollLeft);
    let endIndex = startIndex + Math.ceil(containerWidth / itemSize);
    let start = Math.max(1, startIndex - PRERENDER_COUNT);
    let end = Math.min(itemWidthCount, endIndex + PRERENDER_COUNT);
    return {start, end}
}

function upDateOffset(range, horizontalRange) {
    let offsetY = (range.start - 1) * itemSize;
    let offsetX = horizontalRange.start - 2 <= 0 ? 0 : sumOfIndex[horizontalRange.start - 2];
    containerContent.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

//horizontal 横向
//vertical

function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    let mid = 0;
    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return mid;
}

const arr = [1, 2, 3, 4, 5];
const target = 3.5;
const index = binarySearch(arr, target);
console.log(index); // Output: 2