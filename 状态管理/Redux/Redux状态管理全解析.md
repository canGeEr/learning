> redux、react-redux、react-toolkit，umi的plugin-model 解析 https://gitee.com/cangeer/learn-redux/tree/master/doc doc是文档，code-example是代码案例

需要深入redux的原因有两个：
1. 独立应用比如电子面单编辑器为了方便迁移，并没有集成状态管理库，而是使用Context + useReducer，遇到一些性能瓶颈
2. 当前驾驶舱和商家端都深度集成dva，本质是redux，无法使用useSelector API，但是旧的models又不好迁移
3. redux的代码清晰，设计思路完善并简洁很适合学习

学习完之后总结如下：

## react-redux状态管理三要素
- Provider，向下提供 store 对象
- useSelector | connect ，useContext 的 store 对象，store订阅listener函数
- dispatch触发 store更新，调用listener订阅者函数，listener内部比对生产state值是否相同，不相同则强制更新

## 为什么Context + useReducer不行
1. Context 向下提供value的时候，value会刷新，导致顶层组件刷新，react组件刷新会刷新所有的子组件
2. useContext订阅Context更新成本太高，只要Context的value引用更新了什么，就会触发订阅组件更新，没有浅对比

## umi的plugin-model我们能不能用
**当前项目umi版本低，插件版本也低**，该版本确实能实现状态管理，但是
1. 不会对model hooks返回的对象进行浅对比，极易造成性能问题，开发者使用心智负担比较重
2. 只能在src/models下编写很不方便
3. 由于是umi运行时输出的代码，无法改造

## 当前项目的models不好迁移怎么办
import { getDvaApp } from 'umi';

```typescript
import { useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
import { getDvaApp } from 'umi';
import { Store } from 'redux';
import { ConnectState } from '@/models/connect';

export const reduxStore = getDvaApp()._store as Store;

const equalityFn = (a: any, b: any) => a === b;

export default function useSelector<T>(selector: (state: ConnectState) => T) {
  const [, forceRender] = useReducer(s => s + 1, 0);
  const latestSelector = useRef<Function>();
  const latestStoreState = useRef<any>();
  const latestSelectedState = useRef<T>();
  const storeState = reduxStore.getState();

  const selectedState = useMemo(() => selector(storeState), [
    selector,
    storeState,
  ]);

  useLayoutEffect(() => {
    latestSelector.current = selector;
    latestStoreState.current = storeState;
    latestSelectedState.current = selector(storeState);
  });

  useEffect(() => {
    function checkForUpdates() {
      const newStoreState = reduxStore.getState();
      console.log(newStoreState);
      if (newStoreState === latestStoreState.current) {
        return;
      }
      const newSelectedState = latestSelector.current?.(newStoreState);
      if (equalityFn(newSelectedState, latestSelectedState.current)) {
        return;
      }

      latestSelectedState.current = newSelectedState;
      latestStoreState.current = newStoreState;

      forceRender();
    }
    checkForUpdates();
    const unsubscribe = reduxStore.subscribe(checkForUpdates);
    return unsubscribe;
  }, []);

  return selectedState;
}

// 数据选择器
export const currentUserSelector = (state: ConnectState) => state.user.currentUser;
```

## 总结
1. 小型应用可以参考plugin-model模式，自己撸一个状态管理，Provider + emitter  + useSelector 替代Context + useReducer
2. useReducer 或者 redux 的reducer可以结合 immer实现，在一定程度上能优化性能，其次代码显得更优雅
3. 自己实现useSelector是为了能方便的使用旧的models，因为重构成本较大，新的状态管理强烈推荐**jotai**
