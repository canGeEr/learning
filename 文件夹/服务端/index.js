const http =require('http')

const server = http.createServer()

server.on('request', function(httpRequest, httpResponse) {
  console.log('======', httpRequest.method)
  console.log( httpRequest.url, httpRequest.headers, httpRequest.headers.origin)
  console.log('======')
  if(httpRequest.headers.origin) {
    httpResponse.setHeader('Access-Control-Allow-Origin', httpRequest.headers.origin)
  }
  // httpResponse.setHeader('Set-Cookie', ['name=shepiji; domain=www.baidu.com; '])

  httpResponse.statusCode = 200
  httpResponse.end('请求成功, headers:' + JSON.stringify(httpRequest.headers))
})

server.listen('8080', 'localhost', function() {
  console.log('挂载了')
})