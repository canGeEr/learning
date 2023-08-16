# setInterval

```javascript
function setInterval(callback, time) {
  let setTimeoutId = setTimeout(() => {
    setTimeoutId = customSetInterval(callback, time);
    // 在执行之前已经能拿到下一次setTimeoutId
    callback();
  }, time);

  return setTimeoutId;
}
```

**进阶**：能够取消的形式

```javascript
function setInterval(
  callback,
  time,
  clearQuote = {
    id: undefined,
    clear() {
      clearTimeout(this.id);
    },
  }
) {
  clearQuote.id = setTimeout(() => {
    setInterval(callback, time, clearQuote);
    callback();
  }, time);
  return clearQuote;
}
```
