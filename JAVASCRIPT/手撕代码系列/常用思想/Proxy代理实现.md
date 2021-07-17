## 数据代理原理

```javascript
//数据代理
Object.defineProperty(target, propertyName, {
  get() {
    return deepObj || resource[propertyName];
  },
  set(newValue) {
    resource[propertyName] = newValue;
  },
  enumerable: true,
  configurable: true,
});
```

## 实现 ES6 的 Proxy

```javascript
function Proxy(source, target) {
  if (!isObject(source)) return target;
  Reflect.ownKeys(source).forEach((property) => {
    const value = source[property];
    const newTarget = isObject(value) ? {} : value;
    Proxy(value, newTarget); // 循环劫持
    Object.defineProperty(target, property, {
      get() {
        return newTarget;
      },
      set(newValue) {
        source[property] = newValue;
      },
    });
  });
}
```
