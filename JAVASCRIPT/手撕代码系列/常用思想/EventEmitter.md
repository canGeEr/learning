# EventEmitter

## 关键点

- once 怎么实现，如果是包裹函数，在 once 绑定之后，立即 off 去除，怎么去除
- off 怎么实现
- 遍历 forEach 真的可以吗，数组可能是被动态修改的

## 实现

```javascript
class EventEmitter {
  events;
  constructor() {
    this.events = {};
  }

  on(eventType, callback) {
    if (!(eventType in this.events)) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(callback);
  }

  off(eventType, callback) {
    const currentEvents = this.events[eventType];
    if (currentEvents) {
      for (let [key, value] of currentEvents.entries()) {
        if (value === callback || value.fn === callback) {
          currentEvents.splice(key, 1);
          break;
        }
      }
    }
  }

  emit(eventType, ...args) {
    if (eventType in this.events) {
      const events = this.events[eventType].slice(0); // 保证执行一遍
      events.forEach((callback) => {
        callback(...args);
      });
    }
  }

  once(eventType, callback) {
    const realCallback = (...args) => {
      callback(...args);
      this.off(eventType, realCallback);
    };
    realCallback.fn = callback;
    this.on(eventType, realCallback);
  }
}

const events = new EventEmitter();

let com = function (...args) {
  console.log("点击发生", args);
};

events.on("click", com);

let common = function (...args) {
  console.log("点击发生，once", args);
};

events.once("click", common);

events.off("click", common);

events.on("click", com);

setTimeout(() => {
  console.log(events.events["click"].length);
  events.off("click", com);
  events.emit("click", 1, 2);
  console.log(events);
}, 1000);
```
