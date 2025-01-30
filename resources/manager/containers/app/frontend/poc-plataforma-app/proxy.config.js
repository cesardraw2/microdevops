const proxy = [
    {
      context: ['/sgr'], 
      target: 'http://localhost:9080', 
      secure: false,
      logLevel: 'debug',
      pathRewrite: {'^/sgr' : '/sgr'},
      changeOrigin: true  }
  ];
  module.exports = proxy;