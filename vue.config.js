const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://wa-backend-gw0k.onrender.com',
        changeOrigin: true
      }
    }
  }
};
