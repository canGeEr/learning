# 自写api **dirDepthTree**
功能简述:  
构建出来一个树形的目录结构对象

## dirDepthTree方法
```javascript
const conf = { encoding: 'utf-8', withFileTypes: true };

async function dirDepthTree(url) {
    const dirTree = {}
    dirTree.name = path.basename(path.resolve(url));
    const dirs = await fs.readdirSync(url, conf);
    if (dirs.length) {
        dirTree.children = [];
        for (let i = 0; i < dirs.length; i++) {
            const item = dirs[i];
            if (item.isDirectory()) {
                dirTree.children[i] = await dirDepthTree(path.join(url, item.name));
            }
            else {
                dirTree.children[i] = item.name;
            }
        }
    }
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
        //没有子目录的文件夹
        if(tree.children) {
            tree.children.forEach((item)=>{
                dipthGetObj(item);
            })
        }
    }
}
```

## 调用测试
dirDepthTree(url).then((dirTree) => {
    proVisitTree(dirTree)
})

## 最后
本来想好好看看nodejs的，突然玩起来了ansyc, 这里要注意ansyc也是一个promise对象,可以直接await
但是注意，await只能用在async函数，所以用不了forEach等函数