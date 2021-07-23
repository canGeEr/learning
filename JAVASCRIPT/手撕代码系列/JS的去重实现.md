# JS 数组去重

## 改变原数组删除重复元素

```javascript
//splice删除数组长度
function distinct(arr) {
  let length = arr.length;
  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      if (arr[j] === arr[i]) {
        arr.splice(j, 1);
        length--;
        j--;
      }
    }
  }
}
```

## 生成新数组判断能否插入新数组

```javascript
// include 或者 indexOf
function distinct(arr) {
  const result = [];
  for (let value of arr) {
    !result.includes(value) && result.push(value);
  }
  return result;
}
```

## 通过特殊的数据解构过滤

```javascript
//Object属性不重复 只支持字符串
function distinct(arr) {
  let object = {};
  for (let value of arr) {
    if (!(value in object)) object[value] = true;
  }
  return Object.keys(object);
}

//使用Map数据结构 支持各数据类型
function distinct(arr) {
  let map = new Map();
  let result = [];
  for (let value of arr) {
    if (!map.has(value)) {
      map.set(value, true);
      result.push(value);
    }
  }
  return result;
}

//Set 自带值去重效果
function distinct(arr) {
  return Array.from(new Set(arr));
}
```

## 特性顺序去除

```javascript
//sort 相邻元素比较
function distinct(arr) {
  arr.sort();
  let result = [arr[0]];
  let i = 1;
  while (i < arr.length) {
    arr[i - 1] !== arr[i] && result.push(arr[i]);
    i++;
  }
  return result;
}
```

## 技巧类型

```javascript
//filter + indexOf
function distinct(arr) {
  return arr.filter((value, index) => {
    arr.indexOf(value) === index;
  });
}
```
