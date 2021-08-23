# 01-React结合 TS，到底怎么结合

## React.FC

大家常用的 React.FC，它是个啥？   
在Hooks出来之前，我们把React组件分为函数式组件和类组件
- 函数式纯函数（只允许对传入的props对象进行读，无法保存状态）
- 类组件（用class关键字声明），它在被创建的时候，能返回一个实例对象，保存状态，方法等等

但是React-Hooks打破了这以限制，通过闭包（作用域）实现能在函数组件中也保存状态（虽然这个状态保存在函数外面），支持函数组件也可以拥有自己的“记忆”保存状态。

在大力推进Hooks下，大家渐渐地视React中只有函数组件FunctionComponent，**React.FC 指代的就是 React 的 FunctionComponent**

## 看看React.FC类型源码
```typescript
// 为 P 加上 children 属性
type PropsWithChildren<P> = P & { children?: ReactNode };
 
// 生成 defaultProps
type Partial<T> = { [P in keyof T]?: T[P] | undefined; }

// 生成 propTypes
type WeakValidationMap<T> = {
    [K in keyof T]?: null extends T[K]
        ? Validator<T[K] | null | undefined>
        : undefined extends T[K]
        ? Validator<T[K] | null | undefined>
        : Validator<T[K]>
};

interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
    propTypes?: WeakValidationMap<P>;
    contextTypes?: ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
}

// 简洁的别名
type FC<P = {}> = FunctionComponent<P>;
```
从上面可以得到,React.FC干了这些：
- 传入P（你自己声明的数据的属性），默认是一个对象类型
- 识别 P，生成对应的 props，context、propTypes、defaultProps、displayName等数据类型
- 但是注意，及时声明了这么多，它只说给TS看的，编译的时候不会生成多余的代码，只是帮你省去了编写类型的时间；另外一点，便于编辑器识别函数是React组件（能有更多的提示、更智能的ESlint检查）

## typeof 获取数据的类型
只要是非类型的数据，使用typeof就能获取对应的类型，即使你没有对数据进行数据类型声明，TS会自动推断数据类型，并返回

```typescript
type Person = typeof {
  name: 'shepiji',
  age: 12
}
/*
=> Person === {
  name: string;
  age: number;
}
```
更常用的地方在于，无法直接获取一个组件的类型，你开发者又不好直接定义

```typescript
const InputComponent = typeof Input | typeof TextArea

<InputComponent />
```
这样的 InputComponent 就可以传入 InputProps 和 TextAreaProps了，在封装时尤为有效，比如你要动态的返回一个函数组件，但是函数组件的 props入参就让你头疼了，要组合所有的返回情况


## 导出数据连带导出类型
上面说过在没有办法的情况下，使用typeof直接获取类型，但是啥情况下需要使用到？导出了数据，没有导出使用到的类型
```typescript
// CP.tsx 文件下
interface ComponentProps {
  name: string;
}

export const CP: React.FC<ComponentProps> = (props) => {

}

// index.tsx 文件下
<CP {...asyncProps} /> // 能够使用CP，但是在传入参数的时候可能

/*
asyncProps 一般情况下会有问题，最好
const asyncProps: ComponentProps = {}
```

> 封装在内部的所有可以被外部访问的数据，都需要导出它的类型













