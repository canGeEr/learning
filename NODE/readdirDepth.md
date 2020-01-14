# 自写api **dirDepthTree**
功能简述:  
构建出来一个树形的目录结构对象

## dirDepthTree方法
```javascript
const conf = { encoding: 'utf-8', withFileTypes: true };

function dirDepthTree(url) {
    const dirTree = {}
    dirTree.name = path.basename(path.resolve(url));
    const dirs = fs.readdirSync(url, conf);
    dirTree.children = [];
    dirs.forEach((dir, index) => {
        if (dir.isDirectory()) {
            dirTree.children[index] = dirDepthTree(path.join(url, dir.name));
        }
        else {
            dirTree.children[index] = dir.name;
        }
    })
    return dirTree;
}
```

## 前序遍历树
```javascript
function proVisitTree(tree) {
    if(typeof tree !== 'object') 
        console.log(tree);
    else {
        console.log(tree.name);
        tree.children.forEach((item)=>{
            proVisitTree(item);
        })
    }
}
```

## 调用测试
proVisitTree(dirDepthTree(url))

## 最后
本来想好好看看nodejs的，突然玩起来了ansyc, 这里要注意ansyc也是一个promise对象,可以直接await
但是注意，await只能用在async函数，所以用不了forEach等函数