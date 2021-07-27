# 根据Pid构建树

## 题目
```javascript
/*
树的根节点是0
实现函数buildTree
const flatTreeDatas = [
{
    id: "1",
    parentId: "0"
},
{
    id: "1-1",
    parentId: "1"
},
{
    id: "1-1-1",
    parentId: "1-1"
},
{
    id: "1-2",
    parentId: "1"
},
{
    id: "1-3",
    parentId: "1"
},
{
    id: "2",
    parentId: "0"
},
{
    id: "2-1",
    parentId: "2"
},
{
    id: "2-2",
    parentId: "2"
},
{
    id: "2-3",
    parentId: "2"
}
];


输出：

[{id:"1",children:[{id:"1-1",children:[{id:"1-1-1"}]},{id:"1-2"}]},....] 
*/
```

## 实现
```javascript
//前序遍历解法
function buildTree(flatTreeDatas) {
    let root = {
        id: '0',
        children: []
    }

    function findChildren(root, flatTreeDatas) {
        for(let value of flatTreeDatas) {
            if(value.parentId === root.id) {
                let child = {id: value.id, children: []}
                findChildren(child, flatTreeDatas)
                root.children.push(child)
            }
        }
        return root
    }
    return findChildren(root, flatTreeDatas)
}
```

```javascript
//第二种，收集子元素
function buildTree(flatTreeDatas) {
    for(let node of flatTreeDatas) {
        node.children = flatTreeDatas.filter(function(item){
            return item.parentId === node.id
        })
    }
    return flatTreeDatas.filter(function(item) {
        return item.parentId === '0'
    })
}
```