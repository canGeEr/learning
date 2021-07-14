# 实现 instanceof

```javascript
const Index = {
  instanceof(resurce, classConstructor) {
    const property = classConstructor.prototype;
    while (resurce) {
      resurce = Object.getPrototypeOf(resurce);
      if (resurce === property) return true;
    }
    return false;
  },
};
```
