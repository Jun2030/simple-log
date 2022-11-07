# :sparkles:@2030/simple-log

> 前端日志SDK,支持本地（浏览器）+远程（http[s]/websocket）

## :fire:功能特性

- 前端日志可脱离后端本地处理
- 支持本地+远程同步保存/上报
- 支持链式操作
- 支持日志本地（搜索）下载
- 支持ES,UMD引入（IIFE全局变量：SimpleLog）
- 文件链接支持CDN（unpkg/jsdelivr）
- 无三方依赖，Vite构建
- 现代浏览器均兼容


## :bulb:使用说明

### 1. 安装
`npm/yarn/pnpm` 安装：
```bash
> npm i @2030/simple-log
> yarn add @2030/simple-log
> pnpm add @2030/simple-log
```

### 2. 使用

```typeScript
// ES-引入方式一：直接使用实例
import { Logger } from '@2030/simple-log';
// ES-引入方法二：可本地实例
// import { SimpleLog } from '@2030/simple-log';
// const Log = new SimpleLog(InitConfig);
// CMD-引入方式三：
// const { Logger } = require('@2030/simple-log');
// IIFE-引入方式四：
// <script src="unpkg.com/browse/@2030/simple-log" type="text/javascript"></script>

// 使用
Logger.log("hello world");
// IIFE使用
SimpleLog.Logger.log("hello world");
// 下载
Logger.download();
```
## :basketball: API及配置
### 方法：
- `setConfig(config?: Partial<InitConfig>)`: 设置日志参数
- `getConfig()`: 获取日志参数
- `getLog(nameSpace?: string, time?: string | FixedLengthArray<[string, string]>, level?: LogLevel | '', content?: string)`: 获取日志（可筛选）
- `download(time?: string | FixedLengthArray<[string, string]>, level?: LogLevel | '', content?: string)`: 下载日志（可筛选）
- `clear(nameSpace = this.config.nameSpace)`: 清除日志
- `log(msg)`: 写入log日志
- `info(msg)`: 写入info日志
- `warn(msg)`: 写入warn日志
- `error(msg)`: 写入error日志

### 配置：
- `InitConfig`: 初始化配置
  ```typescript
  interface InitConfig {
    // 隐藏浏览器日志输出，默认：false
    hideConsole?: boolean;
    // 浏览器日志输出前缀，默认：SimpleLog
    consolePrefix?: string;
    // 隐藏浏览器日志输出前缀，默认：false
    hideConsolePrefix?: boolean;
    // 浏览器日志命名空间，默认：__ROOT_LOG__
    nameSpace?: string;
    // 记录并存储日志，默认：true
    recordLogs?: boolean;
    // 单一命名空间内，可保留的最大日志条数，默认：1000
    logMaxLength?: number;
    // 本地可存储日志级别，默认：['log', 'info', 'warn', 'error']
    logLevel?: LogLevel[];
    // 日志输出末尾名称，默认：log.txt，输出完整名称为：2022-11-07 14_35_27.984-log.txt
    logFileName?: string;
    // 日志换行标识，默认：\n
    lineBreak?: string;
    // 日志上报服务URL,可http[s]/ws[s],默认： ''，不上报
    reportServerUrl?: string;
    // http[s]上报鉴权字段名称，默认：token
    tokenKey?: string;
    // http[s]上报鉴权字段值，默认：''
    tokenValue?: string;
  }
  ```
- `LogLevel`: 日志级别
  ```typescript
  type LogLevel = 'log' | 'info' | 'warn' | 'error';
  ```
- `StoreItem`: 单条日志数据结构
  ```typescript
  interface StoreItem {
    // 时间点，格式为 2022-11-07 14:35:27.983
    timer: string;
    // 日志级别
    level: LogLevel;
    // 日志内容
    message: unknown;
  }
  ```


## :key:License

[MIT](./LICENSE) License &copy; 2022 ZiJun
