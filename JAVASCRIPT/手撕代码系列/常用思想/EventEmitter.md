# EventEmitter

## 关键点

- once 怎么实现，如果是包裹函数，在 once 绑定之后，立即 off 去除，怎么去除
- off 怎么实现
- 遍历 forEach 真的可以吗，数组可能是被动态修改的

## 实现

```typescript
type Registry = [number, () => void];

type Callable = Map<number, Function>;

type Subscriber = Map<string, Callable>;

export interface IEventBus {
  // 发布
  emit<T>(event: string, arg?: T): void;
  // 订阅
  on(event: string, callback: Function): Registry;
  // 取消订阅
  off(event: string, key?: Function | number): void;
  // 订阅一次
  once(event: string, callback: Function): void;
}

export class EventBus implements IEventBus {
  // 绑定函数事件的key
  private static nextId = 0;
  private static instance?: EventBus = undefined;

  // 单利模式
  public static getInstance(): EventBus {
    if (this.instance === undefined) {
      this.instance = new EventBus();
    }

    return this.instance;
  }

  // 用Map是为了方便删除
  private subscribers: Subscriber;

  private constructor() {
    this.subscribers = new Map();
  }

  public emit<T>(event: string, ...arg: T []): void {
    const subscriber = this.subscribers.get(event);

    if (!subscriber) return;

    subscriber.forEach(fun => fun(...arg));
  }

  public on(event: string, callback: Function): Registry {
    const id = this.getNextId();
    let eventSubscribers = this.subscribers.get(event);
    // 不存在则初始化
    if (!eventSubscribers) {
      eventSubscribers = new Map();
      this.subscribers.set(event, eventSubscribers);
    }
    eventSubscribers.set(id, callback);

    return [
      id,
      // 取消订阅，注意这里用箭头函数不会改变this的指向
      () => {
        this.off(event, id);
      },
    ];
  }

  public off(event: string, key?: Function | number) {
    // 全部清除
    if (!key) {
      this.subscribers.delete(event);
      return;
    }
    const eventSubscribers = this.subscribers.get(event);
    // 清除单个绑定函数
    if (!eventSubscribers) return;
    if (typeof key === 'number') {
      const id = key;
      eventSubscribers?.delete(id);
    }
    if (typeof key === 'function') {
      const callback = key;
      for (const [id, idCallback] of eventSubscribers) {
        // 找到了直接终止迭代
        if (idCallback === callback) {
          eventSubscribers.delete(id);
          break;
        };
      }
    }
    // 如果事件所有函数都被解除绑定，那么清除事件
    if (!eventSubscribers.size) {
      this.subscribers.delete(event);
    }
    return;
  }

  public once(event: string, callback: Function) {
    const innerCallback = () => {
      callback();
      // 调用之后立马清除
      this.off(event, innerCallback);
    };
    this.on(event, innerCallback);
    return;
  }

  private getNextId(): number {
    return EventBus.nextId += 1;
  }
}
```
