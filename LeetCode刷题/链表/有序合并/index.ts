interface CustomNode {
  value: number;
  next: CustomNode | null;
}


class CustomNodeList {
  headPointer: CustomNode;

  constructor(values: number[]) {
    let pointer: CustomNode 
    this.headPointer = {
      value: NaN,
      next: null
    }
    values.forEach(value => {
      const customNode: CustomNode = {
        value,
        next: null
      }
      if(pointer) {
        pointer.next = customNode
        pointer = customNode
      } else {
        this.headPointer = pointer = customNode
      }
    })
  }

  // 打印
  print() {
    const values: number[] = []
    let cur: CustomNode | null = this.headPointer
    while(cur) {
      values.push(cur.value)
      cur = cur.next
    }
    console.log(values.join(', '))
    return values
  }

  // 去重
  duplicateRemoval() {
    // 链表去重，PS 这里进行了很多次next转换的操作
    // let cur = pointer1;

    // while(cur && cur.next) {
    //   if(cur.value === cur.next.value) {
    //     cur.next = cur.next.next
    //   } else {
    //     cur = cur.next
    //   }
    // }
    let slow: CustomNode | null = this.headPointer;

    while(slow && slow.next) {
      let fast: CustomNode | null = slow.next;
      while(fast && slow.value === fast.value) {
        fast = fast.next
      }
      slow.next = fast
      slow = fast
    }
  }

  // 连同重复的一起删除
  duplicateRemovalAll() {
    const dummy: CustomNode | null = {
      value: Number.NaN,
      next: this.headPointer
    }
    let current = dummy

    // 找到下次的slow，不重复的数字
    while(current && current.next && current.next.next) {
      let slow: CustomNode | null = current.next
      let fast: CustomNode | null = current.next.next;
      if(slow.value === fast.value) {
        do {
          fast = fast.next
        } while(fast && slow.value === fast.value)
        current.next = fast
      } else {
        current = current.next
      }
    }

    return dummy.next
  }

  // 合并有序链表
  mergeCustomNodeList(customNodeList: CustomNodeList) {
    let pointer1: CustomNode | null = this.headPointer
    let pointer2: CustomNode | null = customNodeList.headPointer

    const mergerHeadPointer: CustomNode  = { value: 0, next: null }
    let pointer3 = mergerHeadPointer
    while(pointer1 && pointer2) {
      if(pointer1.value <= pointer2.value) {
        pointer3.next = pointer1
        pointer1 = pointer1.next
      } else {
        pointer3.next = pointer2
        pointer2 = pointer2.next
      }
      pointer3 = pointer3.next
    }
  
    // 如果是空的话
    pointer3.next = pointer1 || pointer2
    return mergerHeadPointer.next
  }
}



module.exports = {
  CustomNodeList,
}