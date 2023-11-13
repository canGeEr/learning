# dialog弹窗问题
在一个空白的页面，有一个弹窗元素，点击弹出没有效果，点击非弹窗区域关闭弹窗

## 事件流实现
```javascript
const dialog = document.getElementById('...') // 弹窗元素
document.body.addEventListener('click', function() {
  dialog.style.display = 'none'
})

dialog.addEventListener('click', function(event = window.event) {
  event.stopPropagation()
})
```

## contains API实现
```javascript
document.body.addEventListener('click', function(event = window.event) {
  const { target } = event
  if(!dialog.contains(target)) {
    dialog.style.display = 'none'
  }
})
```