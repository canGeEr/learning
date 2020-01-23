# JSX语法

## react官网对它得简介
https://zh-hans.reactjs.org/docs/introducing-jsx.html

## 一些注意事项

由于有了一些转换器  
1. 所以不用直接写 `` 或者繁琐得 ''，直接写html可识别  
2. 另一个就是变量或者表达式(即最后能返回一个左值),一定要用 "{}" 包裹 (和vue得"{{}}"不同)  
3. 在 "{}" 得变量 的作用域是JS作用域


## 在vue里写JSX
```javascript
export default {
  name: 'TableHead',
  data() {
    return {
      titleBar: ['name', 'legal', 'grade', 'operate'],
    }
  },
  //render函数是更推荐写的，比较方便
  render(h) {
    const titleBar = this.titleBar;
    const specialYTd = 'operate'
    return (
      <tr>
        {titleBar.map((item)=>{
          return <td rowspan={item === specialYTd ? '2' : false }>{item}</td>
        })}
      </tr>
    )
  }
}
```