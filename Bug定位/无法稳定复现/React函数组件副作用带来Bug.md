
## 原因：函数组件使用外部对象，并产生副作用
某些情况下对外部对象的值进行修改，在组件卸载的时候未完成副作用的清除，导致下次函数组件重新创建的时候仍然使用到上一次的副作用结果

上次结果 => 本次开始，组件前后的数据不一致，渲染结果可能不一致

举例：
```javascript
const data = { value: 0 };

function App() {
	// 危险：data使用外部引用，App重新mount时data可能不一致
	const ref = useRef(data);
	useEffect(() => {
		setInterval(() => {
			// 危险：注意这里直接修改了data引用的某些属性
			ref.current.value++;
		}, 1000);
	}, []);
	return <span>{ref.current.value}</span>
}
```

## 具体案例分析
> [【订单申报】【商家端】修改驳回的申报订单会出现异常情况，删除掉所有订单后重新添加，会出现删除订单，有的时候甚至出现上个申报的订单](https://tapd.woa.com/No37/bugtrace/bugs/view?bug_id=1020425357115489243&jump_count=1)

![enter image description here](/tencent/api/attachments/s3/url?attachmentid=15068611)

背景：前后端约定，编辑情况下，新增的订单收集到addList、删除的订单收集到delList

前端：维护了dataSource（当前Table的数据），operateRef 收集addList和delList

核心Bug代码：
```javascript
export const operateRefDefault = { addList: [], delList: [] };

function ReportOrder() {
	// ....;
	// 记录remove,add record
  	const operateRef = useRef(operateRefDefault);
	
	// 在某次添加或者删除的回调 UseOperateOrderList => 更新 operateRef.current的 addList 和 delList
}
```

复现Bug场景：
- 商家端，第一次编辑，删除某些订单、新增某些订单，完成提交（但是 operateRefDefault 得 addList、delList仍然保存记录 ）
- 运营端，审核驳回
- 商家端（保持不刷新页面），重新进入编辑页，operateRefDefault还在内存中，上次的记录也在保留，如果再次删除，那么优先删除addList!!#ff0000 （本应该是添加到delList）!!，如果再添加，优先删除delList!!#ff0000 （本应该是添加到addList）!!

解决方案：useRef({ addList: [], delList: [] })，由内部每次重新创建

