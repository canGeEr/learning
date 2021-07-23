# call、bind、apply

## call

```javascript
Function.prototype.call = function (context, ...args) {
  if (typeof this !== "function") throw "非函数对象调用错误";
  const tempName = Symbol("callFun");
  context[tempName] = this;
  const result = context[tempName](...args);
  delete context[tempName];
  return result;
};
```

## apply

```javascript
Function.prototype.aply = function (context, args = []) {
  if (typeof this !== "function") throw "非函数对象调用错误";
  const tempName = Symbol("callFun");
  context[tempName] = this;
  const result = context[tempName](...args);
  delete context[tempName];
  return result;
};
```

## bind

```javascript
Function.prototype.call = function (context, ...args) {
  const callback = this;
  return function (...arg1) {
    if (typeof this !== "function") throw "非函数对象调用错误";
    const tempName = Symbol("callFun");
    context[tempName] = callback;
    const result = context[tempName](...args, ...arg1);
    delete context[tempName];
    return result;
  };
};
```
