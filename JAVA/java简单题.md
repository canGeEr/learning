# 简单题
例题1:
```java
//注意这个二维数组的用法,先留了个空指针 a[0] = null
int [][] a = new int[1][];
int [] b = new int [2];
a[0] = b;
a[0][0] = 1;
System.out.println(b[0]);
```