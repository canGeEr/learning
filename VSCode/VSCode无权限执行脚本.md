# VSCode无权限执行脚本
1. 先运行VSCode软件
2. 在VSCode终端中执行get-ExecutionPolicy，显示Restricted，表示状态是禁止的
3. 这时执行set-ExecutionPolicy RemoteSigned
4. 此时再执行get-ExecutionPolicy，显示RemoteSigned，则表示状态解禁，可以运行
5. 现在在终端执行脚本是可以运行的