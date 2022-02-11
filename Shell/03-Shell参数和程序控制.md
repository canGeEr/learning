# Shell参数和程序控制

## 传递参数
> [Shell 参数传递](https://www.runoob.com/linux/linux-shell-passing-arguments.html)
- $# 参数的个数
- $n 第N个参数
- $\$ 当前脚本运行的进程ID号
- $* 以一个单字符串显示所有向脚本传递的参数，其实就是把所有参数join一下
- $@ 返回参数数组
- ...

## 流程控制
> [Shell 流程控制](https://www.runoob.com/linux/linux-shell-process-control.html)

```bush
if condition
then
    command1 
    command2
    ...
    commandN 
fi // 这是结束符


if [ $a == $b ]
then
   echo "a 等于 b"
elif [ $a -gt $b ]
then
   echo "a 大于 b"
elif [ $a -lt $b ]
then
   echo "a 小于 b"
else
   echo "没有符合的条件"
fi
```

```bush
for value in array_name 
do //循环开始符号
    command1 
    command2
done // 循环结束
```

```bush
while condition
do
    command
done
```