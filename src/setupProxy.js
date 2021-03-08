const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: 'http://127.0.0.1:8011',
            // target: 'http://192.168.2.195:8011',
            changeOrigin: true,
            pathRewrite : {
                "/api": "/",
            }
            // ws: true,
        })
    );
};
