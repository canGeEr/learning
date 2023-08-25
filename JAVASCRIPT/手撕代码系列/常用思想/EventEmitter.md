# EventEmitter

## 关键点

- once 怎么实现，如果是包裹函数，在 once 绑定之后，立即 off 去除，怎么去除
- off 怎么实现
- 遍历 forEach 真的可以吗，数组可能是被动态修改的

## 实现

```typescript
class EventEmit {
  constructor() {
    this.cache = new Map();
  }
  on(name, callback) {
    if (!this.cache.has(name)) {
      this.cache.set(name, []);
    }
    this.cache.get(name).push(callback);
    return () => this.delete(name, callback);
  }
  delete(name, callback) {
    const callbackList = this.cache.get(name);
    if (!callbackList?.length) return;
    const callbackIndex = callbackList.find((item) => callback === item);
    if (callbackIndex === -1) return;
    // 替换callback位置为空
    callbackList[callbackIndex] = undefined;
  }
  once(name, callback) {
    const clearFun = this.on(name, () => {
      callback();
      clearFun();
    });
    return clearFun;
  }
  emit(name) {
    const callbackList = this.cache.get(name);
    if (!callbackList?.length) return;
    // 注意，可能边执行的时候边背删除了
    callbackList.forEach((callback) => callback?.());
    this.cache.set(name, callbackList.filter(Boolean));
  }
}

const eventEmit = new EventEmit();

const clearFirst = eventEmit.on("fuck", () => {
  console.log("first1");
});

eventEmit.once("fuck", () => {
  console.log("first once");
  clearFirst();
  clearSecond();
});

const clearSecond = eventEmit.on("fuck", () => {
  console.log("first2");
});

eventEmit.emit("fuck");

eventEmit.emit("fuck");
```
