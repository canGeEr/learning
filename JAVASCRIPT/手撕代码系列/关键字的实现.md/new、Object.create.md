# new、Object.create

## new

```javascript
{
    new: function (constructor, ...args) {
        const obj = Object.create(constructor.prototype)
        const result = constructor.call(result, ...args)
        return result instanceof Object ? result : obj
    }
}
```

## Object.create

```javascript
Object.create = function (prototype, descriptors) {
  if (!isObject()) {
    throw new TypeError("Object prototype may only be an Object or null");
  }
  // 判断是否为object
  if (!instance) {
    return Object.setPrototypeOf({}, null);
  }
  const ConstructorFun = new Function();
  ConstructorFun.prototype = instance;
  ConstructorFun.prototype.constructor = ConstructorFun;
  const result = new ConstructorFun();
  delete ConstructorFun.prototype.constructor;
  Object.defineProperties(result, descriptors || {});
  return result;
};
```
