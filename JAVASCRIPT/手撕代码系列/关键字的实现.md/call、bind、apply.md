# call、bind、apply

## call

```javascript
// 真正的call的length = 1
Function.prototype.call = function (instance, ...args) {
  // 非严格模式下
  if (instance === null || instance === undefined) {
    instance = window;
  }
  // 非对象的时候需要处理
  instance = Object(instance);
  const callback = this;
  // 确保完全不会覆盖其他属性
  const tempKey = Symbol("temp");
  instance[tempKey] = callback;
  const result = instance[tempKey](...args);
  // 删除临时key
  delete instance[tempKey];
  // 注意需要返回结果
  return result;
};
```

## apply

```javascript
// 真正的call的length = 2
Function.prototype.apply = function (instance, args) {
  return this.call(instance, ...(args || []));
};
```

## bind

```javascript
Function.prototype.call = function (instance, ...initArgs) {
  const that = this;
  return function (...args) {
    return that.call(instance, ...[].concat(initArgs, args));
  };
};
```
