# IM系统数据库设计 & 前端逻辑处理

## 数据库表
> 一下默认大家都有的字段就没写了，locked，create_time，update_time就没写了

### **user** 表
id 等，没什么好说的

### **friend_group** 表
好友分组列表：
id，user_id（是谁的好友列表），group_name（组名），group_type（分组类型，是否为默认分组）
> 默认分组无法删除，用户新建一个分组，就添加一条记录，主要区分就是user_id和group_name

### **friend** 表
好友表，记录好友关系。主要字段：    
id，user_id，friend_id，friend_group_id（好友分组id）

### **friend_request_record** 表
好友申请表：  
id，from_id（对应user_id），to_id（对应user_id），intro（简介）, state（未读，已读，拒绝，接受）

### **chat_reocrd_type** 表
消息类型表
> 文件，音频，还是其它，因为前端渲染的时候要知道数据是什么类型，去做相应的渲染

### **group** 表
群组表：    
id，user_id，group_name，avatarUrl，group_group_id（可选的，这其实和friend_group_id，是为了对群组分组，如果有该需求，你要新建一个group_group表，表示群组分组）

### **group_member** 表
群组成员表：    
id，member_id（对于user_id），group_id（group表的id）

### **chat_reocrd** 表
聊天记录表啦。因为有些信息离线要接收，没有数据库表根本处理不了。
字段主要id，user_id, friend_id（好友信息），group_id（属于那个群），chat_reocrd_type_id，readed（是否已读信息），content（内容）

### **拓展**
还是可以加很多表的，比如**群聊申请加入表**，**群组分组表**，**空间消息文章消息**，**系统消息表**（可能做一些推送）


## 前端逻辑

### 用户列表及其分组
已知数据 user_id    
根据friend 和 friend_group 和 直接查表获取所有用户的分组，及其分组的好友

### 群组列表
已知数据 user_id    
根据 group 和 user_id 和 直接查表获取所有群组

### 群组成员
已知数据 group_id   
根据 group_member 和 group_id 和 直接查表获取所有群组成员

### 对话消息记录
- 本地存储  
  - 用户自己发送的聊天消息要存储在本地
  - 用户实时侦听到的要存储在本地
  - 用户和好友聊天记录快照（QQ的消息列表，它不是数据库信息，当然也可以从数据库获取）
  - 向用户提交的好友请求信息
- 数据库获取
  - 用户本地聊天记录不够，用户点击获取聊天记录
  - 存储在数据库的用户未读的信息要在用户一上线就交给用户（拿到数据，知道未读消息，渲染红点，和**聊天记录的快照 => 要查询本地存储的对比**）
  - 存储在数据库的用户未读的请求好友信息，渲染好友请求，请求状态


## 交互
消息类型

### **login**
是否上线

### **outLogin**
是否下线，注意，为了不浪费服务器资源，最好做心电图机制

### **OneToOne**
一对一聊天记录

### **ManyToMany**
一对一聊天记录

### **request_friend**
请求添加好友

### **request_group**
请求添加群组


## 总结
数据库其实不难，对于一个近p2p来说，它对前端的要求显然不同于CS那么简单的获取数据渲染，它必须C,S都了解怎么去做。单真正做的时候发现前端渲染逻辑可能较复杂。