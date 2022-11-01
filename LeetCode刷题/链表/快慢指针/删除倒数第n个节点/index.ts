const IndexModule = require('./../../有序合并/index')

interface CustomNode {
  value: number;
  next: CustomNode | null;
}

IndexModule.CustomNodeList.prototype.removeNthFromEnd = removeNthFromEnd

function removeNthFromEnd(n: number) {
  // 头节点被删除，dummy更好处理
  const dummy = {
    value: Number.NaN,
    next: this.headPointer
  }
  let slow = dummy
  let fast = dummy
  // 这里需要默认n有效，向前走n步，保持n步的差（多1是为了找到删除节点）
  while(fast && n > 0) {
    fast = fast.next
    n--;
  }
  while(fast.next) {
    fast = fast.next
    slow = slow.next
  }
  slow.next = slow.next.next
  return dummy.next
}