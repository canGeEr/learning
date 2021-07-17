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

## Object.createx

```javascript
Object.create = function (prototype, descriptors) {
  const ConstructorFun = new Function();
  ConstructorFun.prototype = prototype;
  prototype.constructor = ConstructorFun;
  const result = new ConstructorFun();
  Object.defineProperties(result, desciptors);
  return result;
};
```
