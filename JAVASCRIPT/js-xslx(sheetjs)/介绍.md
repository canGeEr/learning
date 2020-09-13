# SheetJs库
> 资源
- [github.com/SheetJS](https://github.com/SheetJS)
- [github.com/SheetJS/sheetjs](https://github.com/SheetJS/sheetjs)
- [sheetjs官网](https://sheetjs.com/)

## 使用
```html
<script type="text/javascript" src="//unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
```

### (1) 说明 && 理解
首先需要清除，xlsx可以处理多种数据原，htmltable、json、等。因此，xlsx选择Sheet类对象作为中间格式，通过xlsx的（解析功能）方法转换数据源到sheet对象，最后组成包含多个Sheet（可单一，可多，xlsx为了方便直接用数组处理）的工作簿WorkBook。xlsx通过写作功能完成最后的数据转换。   

为了更加清晰：
- XLSX通过转换方法（解析功能）将数据源转换到Sheet对象
- 将Sheet对象改造处理成WorkBook对象
- XLSX通过写作功能完成最后的数据转换（一般就是导出）

### (2) 体验一个小demo
```javascript
var jsonStr = [{ //数据源
    "姓名": "路人甲\t",
    "电话": "123456789\t",
    "邮箱": "000@123456.com\t"
}, {
    "姓名": "炮灰乙\t",
    "电话": "123456789\t",
    "邮箱": "000@123456.com\t"
}, {
    "姓名": "土匪丙\t",
    "电话": "123456789\t",
    "邮箱": "000@123456.com\t"
}, {
    "姓名": "流氓丁\t",
    "电话": "123456789\t",
    "邮箱": "000@123456.com\t"
}]
 
//转换方法 json => sheet
var mySheet= XLSX.utils.json_to_sheet(jsonStr); //中间对象

var workBook = {
  SheetNames: ['mySheet'],
  Sheets: { 
    mySheet
  },
  Props: {}
};

// 组成配置输出
var workBookOutPotion = {
  //bookType 工作簿类型
  bookType: 'xlsx',
  //bookSST 生成共享字符串表
  bookSST: false,
  //type 输出数据编码
  type: 'array'// ["base64", "binary", "string", "buffer", "file"]
};

//生成工作簿输出，数据为2进制

//第一种
var workBookOut = XLSX.write(workBook, workBookOutPotion);
//第二种 自动识别文件名，其余操作自动完成
XLSX.writeFile(workBook,  'SheetJSTableExport.xlsx' );
```

### (3) 还是(2) 的demo，但是我们换个数据源
```javascript
// 假定情况 上传xlsx文件
// 当 input 事件响应时 做如下操作
function readerXlsx(file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = e.target.result;

    //以二进制的方式读取
    var workBook = XLSX.read(data, {
        type: 'binary' 
    });

    var sheet = workBook.Sheets[workBook.SheetNames[0]];//sheet0代表excel表格中的第一页

    var strObj = XLSX.utils.sheet_to_json(sheet);//利用接口实现转换。

    return JSON.stringify(strObj)
  }
  //注意这段代码 readAsBinaryString 读取文件的内容为二进制
  reader.readAsBinaryString(file);
}
```

## 总结
上面的操作其实可以清晰的介绍了XLSX的核心用法，对于其它格式的转换只需要查询文档API接口就行，如：
- 输入：
  - aoa_to_sheet 将JS数据数组的数组转换为工作表。
  - **json_to_sheet** 将JS对象数组转换为工作表。
  - **table_to_sheet** 将DOM TABLE元素转换为工作表。
  - sheet_add_aoa 将JS数据数组添加到现有工作表中。
  - sheet_add_json 将JS对象数组添加到现有工作表中。

- 出口：
  - **sheet_to_json** 将工作表对象转换为JSON对象数组。
  - **sheet_to_csv** 生成定界符分隔值输出。
  - sheet_to_txt 生成UTF16格式的文本。
  - sheet_to_html 生成HTML输出。
  - sheet_to_formulae 生成公式列表（具有值后备）。