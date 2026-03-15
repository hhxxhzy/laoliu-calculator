const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // 处理根路径
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // 安全检查：确保文件在项目目录内
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 文件不存在，返回404
                res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - 页面未找到</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            h1 { color: #333; }
                            p { color: #666; }
                            a { color: #667eea; text-decoration: none; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - 页面未找到</h1>
                        <p>您访问的页面不存在。</p>
                        <p><a href="/">返回计算器</a></p>
                    </body>
                    </html>
                `);
            } else {
                // 其他错误
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            }
            return;
        }
        
        // 获取文件扩展名并设置Content-Type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(data);
    });
});

server.on('error', (err) => {
    if (err.code === 'EACCES') {
        console.error(`错误：需要root权限才能在${PORT}端口运行。请尝试：`);
        console.error(`1. 使用其他端口: PORT=8080 node server.js`);
        console.error(`2. 使用sudo运行: sudo node server.js`);
        console.error(`3. 或者使用setcap命令给node二进制文件权限:`);
        console.error(`   sudo setcap 'cap_net_bind_service=+ep' \`which node\``);
    } else if (err.code === 'EADDRINUSE') {
        console.error(`错误：端口${PORT}已被占用。请检查是否有其他服务正在运行。`);
        console.error(`尝试使用其他端口: PORT=8081 node server.js`);
    } else {
        console.error(`服务器错误: ${err.message}`);
    }
    process.exit(1);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`🚀 计算器服务器已启动！`);
    console.log(`📁 项目目录: ${__dirname}`);
    console.log(`🌐 访问地址: http://localhost:${PORT}`);
    console.log(`         或: http://[你的IP地址]:${PORT}`);
    console.log(`📱 支持设备: 电脑、手机、平板`);
    console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log(`=========================================`);
    
    // 显示网络接口信息
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    console.log(`📡 网络接口信息:`);
    Object.keys(interfaces).forEach(iface => {
        interfaces[iface].forEach(address => {
            if (address.family === 'IPv4' && !address.internal) {
                console.log(`   ${iface}: http://${address.address}:${PORT}`);
            }
        });
    });
    console.log(`=========================================`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 收到关闭信号，正在停止服务器...');
    server.close(() => {
        console.log('✅ 服务器已停止');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 收到终止信号，正在停止服务器...');
    server.close(() => {
        console.log('✅ 服务器已停止');
        process.exit(0);
    });
});