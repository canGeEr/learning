# VSCode 如何设置终端

## 旧版本

在 VSCode 的设置，写入配置信息：

```json
{
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe"
}
```

即 VSCode 配置 key，和对应的 git 的对应路径，那么你打开 VSCode 的终端（windows 的话），默认就是 git bush

## 新版本

主要是 VSCode 的命令更新了：terminal.integrated.profiles.windows 配置一个 JSON 对象字符串，即 windows 的终端可以选择多种：

```json
"terminal.integrated.profiles.windows": {
    "PowerShell": {
        "source": "PowerShell",
        "icon": "terminal-powershell"
    },
    "Command Prompt": {
        "path": [
            "${env:windir}\\Sysnative\\cmd.exe",
            "${env:windir}\\System32\\cmd.exe"
        ],
        "args": [],
        "icon": "terminal-cmd"
    },
    "Git Bash": {
        "path": "D:\\Application\\Git\\bin\\bash.exe",
        "args": [],
    }
}
```

请注意到，这个配置的属性：PowerShell、Command Prompt 是在 VSCode 选择哪个终端的 title（只是显示最用），它对应的配置信息：

- path 该终端的路径
- args 执行打开终端执行的命令
- source 终端的名子（这种适用于系统能够自动识别的终端）

## 默认终端

上面配置了三个终端，但是默认的是第一个 PowerShell，如果我们希望每次打开终端都是先开 git bush：

```json
{
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```
