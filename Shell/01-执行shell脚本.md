# 执行shell脚本
> [Shell 是一个用 C 语言编写的程序...](https://www.runoob.com/linux/linux-shell.html) 这是菜鸟教程，感觉写的不错，而且不难，建议直接看

## Shell环境
Shell环境的意思是谁能解析执行Shell脚本：
- Bourne Again Shell（**/bin/bash** 我们常用的bush）
- Bourne Shell（/usr/bin/sh或/bin/sh
- C Shell（/usr/bin/csh）
- K Shell（/usr/bin/ksh）
- Shell for Root（/sbin/sh）

## Shell脚本如何编写
1. 创建文件，test-shell.sh 文件（你甚至可以不加后缀，本质上代码的解析执行不靠后缀，而是读取字符串，解析token流，创建AST）
2. 在文件写入 

    ```bush
    // 也可以不加 双引号，默认的不是指令的字符都会被解析字符串（当然非数字）
    echo "hello world"
    ```

3. 接下来就是执行 shell
    - 让test-shell.sh文件变成可执行文件 

      ```bush
      chmod +x ./test-shell.sh
      ```
      ，通过注释指定谁执行shell脚本（告诉系统）

      ```bush
      // 在 test-shell.sh 顶部插入 +++
      #!/bin/bash
      ```
      接下来，点击test-shell.sh文件，就会自动的找到 /bin/bash，执行这也的命令：/bin/bash test-shell.sh
    
    - 手动执行文件：/bin/bash test-shell.sh