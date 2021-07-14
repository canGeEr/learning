## jsonp 的实现

```javascript
function jsonp({ url, params, callback }) {
  return new Promise((fulfill, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = serialize(url, { ...params, callback });
    window[callback] = function (data) {
      fulfill(data);
      document.body.appendChild(script);
    };
    document.body.appendChild(script);
  });
}

//反序列化
function deSerialize(url) {
  let temp = url.split("?");
  let prefixUrl = temp[0];
  let paramsArr = temp[1].split("&");
  let params = {};
  for (let item of paramsArr) {
    temp = item.split("=");
    params[temp[0]] = temp[1];
  }
  return {
    params,
    url: prefixUrl,
  };
}

//序列化
function serialize({ url, params }) {
  let str = url + "?";
  for (let pro in params) {
    str += pro + "=" + params[pro] + "&";
  }
  return str.slice(0, -1);
}
```
