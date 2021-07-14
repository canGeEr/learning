# setinterval

```javascript
const Index = {
  setInterval(callback, spacing) {
    setTimeout(function(){
      setTimeout(arguments.callee, spacing)
      callback()
    }, spacing)
  },
  setInterval(callback, spacing) {
    setTimeout(function() {
      setInterval()
      callback()
    }, spacing)
  }
}
```