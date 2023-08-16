# 实现 instanceof

```javascript
function instanceOf(classConstructor) {
  const classPrototype = classConstructor.prototype;
  let prototype = Object.getPrototypeOf(this);

  while (prototype) {
    if (prototype === classPrototype) return true;
    prototype = Object.getPrototypeOf(prototype);
  }

  return false;
}
```
