# 老六的计算器 🧮

一个简洁实用的网页计算器，支持基本运算、历史记录和响应式设计。

## 功能特性

- ✅ 基本四则运算（加、减、乘、除）
- ✅ 百分比计算
- ✅ 小数点支持
- ✅ 退格和清空功能
- ✅ 计算历史记录（自动保存）
- ✅ 键盘支持
- ✅ 响应式设计（适配手机和电脑）
- ✅ 美观的UI界面

## 使用方法

### 网页操作
1. 点击数字按钮输入数字
2. 点击操作符按钮选择运算
3. 点击等号按钮计算结果
4. 点击C按钮清空
5. 点击←按钮退格

### 键盘快捷键
- **数字键 0-9**: 输入数字
- **小数点 .**: 输入小数点
- **+ - * /**: 选择运算
- **Enter 或 =**: 计算结果
- **Escape 或 Delete**: 清空
- **Backspace**: 退格
- **%**: 百分比计算

## 部署说明

### 快速启动
```bash
# 进入项目目录
cd calculator

# 启动服务器（需要root权限或使用其他端口）
sudo node server.js

# 或者使用其他端口（如8080）
PORT=8080 node server.js
```

### 使用PM2持久化运行（推荐）
```bash
# 安装PM2
npm install -g pm2

# 使用PM2启动（需要root权限）
sudo pm2 start server.js --name "calculator" -- 80

# 设置开机自启
sudo pm2 startup
sudo pm2 save
```

### 使用Docker部署
```bash
# 构建Docker镜像
docker build -t laoliu-calculator .

# 运行容器
docker run -d -p 80:80 --name calculator laoliu-calculator
```

## 项目结构
```
calculator/
├── index.html          # 主页面
├── style.css          # 样式文件
├── script.js          # 计算器逻辑
├── server.js          # Node.js服务器
├── package.json       # 项目配置
└── README.md          # 说明文档
```

## 技术栈
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Node.js (原生HTTP模块)
- **字体**: Google Fonts (Orbitron, Roboto)
- **图标**: Font Awesome 6
- **样式**: CSS Grid, Flexbox, 渐变背景

## 端口说明
- 默认端口: **80** (HTTP)
- 如果需要使用其他端口，修改`server.js`中的`PORT`变量
- 如果80端口被占用，可以使用8080、3000等其他端口

## 访问地址
- 本地访问: http://localhost:80
- 局域网访问: http://[你的IP地址]:80
- 公网访问: 需要配置端口转发或使用云服务

## 开发说明

### 本地开发
```bash
# 1. 克隆项目
git clone <repository-url>

# 2. 进入项目目录
cd calculator

# 3. 启动开发服务器
node server.js

# 4. 打开浏览器访问
#    http://localhost:8080
```

### 自定义配置
1. 修改`server.js`中的`PORT`变量更改端口
2. 修改`style.css`自定义样式
3. 修改`script.js`添加新功能

## 故障排除

### 端口80无法绑定
```bash
# 检查端口占用
sudo lsof -i :80

# 使用其他端口
PORT=8080 node server.js
```

### 权限问题
```bash
# 使用sudo运行
sudo node server.js

# 或者给node绑定低端口权限
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```

### 历史记录不保存
- 确保浏览器支持localStorage
- 检查浏览器是否启用了隐私模式

## 许可证
MIT License

## 作者
老六 (OpenClaw Assistant)

## 更新日志
- v1.0.0 (2026-03-15): 初始版本发布
  - 基本计算功能
  - 历史记录功能
  - 响应式设计
  - 键盘支持