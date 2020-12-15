# 06 06-Object.equals方法
PS：本节是对上一节的一些补充，比如常量池是啥，什么是构造函数

## **一、equals 和 ==**
> [Java 中方法区与常量池](https://zhuanlan.zhihu.com/p/107776367)
- 在 JDK6.0 及之前版本，字符串常量池是放在 Perm Gen 区(也就是方法区)中，此时常量池中存储的是对象。
- 在 JDK7.0 版本，字符串常量池被移到了堆中了。此时常量池存储的就是引用了。在 JDK8.0 中，永久代（方法区）被元空间取代了。

java提供两种判断相等的方式：
- equals 
- ==
Object.equals默认是 == 方式，但是可以被重写，比如String类的

```java
String str1 = "abc";
String str2 = "abc";
String str3 = new String("abc");
str1 == str2  //true
str1 == str3  //false
str1.equals(str3) //true
```
第一、二句比较的是对象的地址值，str1和str2是常量池的同一个对象，str3是堆中的新建的对象，地址值自然不相等    
第三句，是一个包装对象new String(str1).equals(new String(str3))，由于String的类的方法被重写，自然的结果是true

## **二、怎么重写equals**
重写equals方法的要求：

1. 自反性：对于任何非空引用x，x.equals(x)应该返回true。

2. 对称性：对于任何引用x和y，如果x.equals(y)返回true，那么y.equals(x)也应该返回true。

3. 传递性：对于任何引用x、y和z，如果x.equals(y)返回true，y.equals(z)返回true，那么x.equals(z)也应该返回true。

4. 一致性：如果x和y引用的对象没有发生变化，那么反复调用x.equals(y)应该返回同样的结果。

5. 非空性：对于任意非空引用x，x.equals(null)应该返回false。

函数签名：public boolean equals(任意)
