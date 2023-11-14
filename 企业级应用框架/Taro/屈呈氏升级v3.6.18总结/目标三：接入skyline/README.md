## worklet动画函数压缩之后失效
```javascript
export function CurveAnimation({
  animation, animationStatus, curve, reverseCurve
}) {
  const { derived } = wx.worklet

  return derived(() => {
    'worklet'

    const useForwardCurve = !reverseCurve || animationStatus.value !== AnimationStatus.reverse
    const activeCurve = useForwardCurve ? curve : reverseCurve

    const t = animation.value
    if (!activeCurve) return t
    if (t === 0 || t === 1) return t
    return activeCurve(t)
  })
}
```
经过terser压缩之后
```javascript
function c(e) {
	var t = e.animation,
	  n = e.animationStatus,
	  i = e.curve,
	  o = e.reverseCurve,
	  a = wx.worklet.derived
	return a(function () {
	  'worklet'
	  var e = !o || n.value !== r.reverse,
		a = e ? i : o,
		u = t.value
	  return a ? (0 === u || 1 === u ? u : a(u)) : u
	})
  }
```
'worklet' 声明被去掉

解决方法：
```javascript
terser: {
	enable: true,
	config: {
		  compress: {
			...others,
			directives: false
		  }
	}
},
```