import { HttpServer, filterData, parseLog, setupWSServer } from './helper';
import { styles } from './style';
import { formatTimestamp, getProtocol } from '@/utils';

export type LogLevel = 'log' | 'info' | 'warn' | 'error';

export interface InitConfig {
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

export interface SetLogOption {
  message: unknown;
  level: LogLevel;
}

export interface StoreItem {
  // 时间点，格式为 2022-11-07 14:35:27.983
  timer: string;
  // 日志级别
  level: LogLevel;
  // 日志内容
  message: unknown;
}

export interface SearchOption {
  time?: Date[];
  level?: LogLevel;
  content?: string;
}

export class SimpleLog {
  private config: Required<InitConfig> = {
    hideConsole: false,
    consolePrefix: 'SimpleLog',
    hideConsolePrefix: false,
    recordLogs: true,
    nameSpace: '__ROOT_LOG__',
    logLevel: ['log', 'info', 'warn', 'error'],
    logMaxLength: 1000,
    logFileName: 'log.txt',
    lineBreak: '\n',
    reportServerUrl: '',
    tokenKey: 'token',
    tokenValue: '',
  };

  private tempLogs: StoreItem[] = [];
  private wsServer: any = null;

  constructor(initConfig?: InitConfig) {
    initConfig && (this.config = Object.assign(this.config, initConfig));
    // 连接远程服务
    const { reportServerUrl } = this.config;
    reportServerUrl && this.initServerConnect(reportServerUrl);
  }

  private initServerConnect = async (url: string) => {
    const protocol: ProtocolType = getProtocol(url);
    if (protocol !== 'HTTP' && protocol !== 'WS') {
      return this.error('日志上报接口不支持');
    } else if (protocol === 'WS') {
      this.wsServer = await setupWSServer(url, this.log, this.error);
    }
  };

  /* 获取日志设置参数 */
  public getConfig = () => {
    return this.config;
  };

  /* 设置日志参数 */
  public setConfig = (config?: Partial<InitConfig>) => {
    config && (this.config = Object.assign(this.config, config));
    return this;
  };

  /* 读取日志 */
  public getLog = (nameSpace?: string, time?: string | FixedLengthArray<[string, string]>, level?: LogLevel | '', content?: string) => {
    this.tempLogs = [];
    this.tempLogs = filterData(parseLog(nameSpace || this.config.nameSpace, this.error), time, level, content);
    return this;
  };

  /* 设置日志 */
  private setLog = (option: SetLogOption): void => {
    if (!this.config.recordLogs) return;
    const { message, level } = option;
    if (!this.config.logLevel.includes(level)) return;
    const logMsg = message ?? '';
    const logLevel: LogLevel = level ?? 'log';
    if (!this.config.hideConsole) {
      try {
        if (this.config.hideConsolePrefix) {
          console[logLevel](`%c ${logLevel} `, styles(logLevel, true), logMsg);
        } else {
          console[logLevel](`%c ${this.config.consolePrefix} %c ${logLevel} `, styles(), styles(logLevel, false), logMsg);
        }
      } catch (error) {
        console.log(logMsg);
      }
    }
    const newStoreData: StoreItem = {
      timer: formatTimestamp(),
      level: logLevel,
      message: logMsg,
    };
    const curStoreDataArray: StoreItem[] = parseLog(this.config.nameSpace, this.error);
    if (curStoreDataArray.length >= this.config.logMaxLength) { curStoreDataArray.pop(); }
    curStoreDataArray.unshift(newStoreData);
    window.localStorage.setItem(this.config.nameSpace, JSON.stringify(curStoreDataArray));
    if (this.config.reportServerUrl) {
      if (this.wsServer) {
        (this.wsServer as WebSocket).send(JSON.stringify(newStoreData));
      } else {
        HttpServer(this.config.reportServerUrl, { tokenKey: this.config.tokenKey, tokenValue: this.config.tokenValue }, newStoreData);
      }
    }
  };

  /* 清除日志 */
  public clear = (nameSpace = this.config.nameSpace) => {
    window.localStorage.removeItem(nameSpace);
    return this;
  };

  /* 下载日志 */
  public download = (time?: string | FixedLengthArray<[string, string]>, level?: LogLevel | '', content?: string): void => {
    const downloadFileName = `${formatTimestamp()}-${this.config.logFileName}`;
    let file = 'data:text/plain;charset=utf-8,';

    const curStoreDataArray: StoreItem[] = this.tempLogs ? this.tempLogs : parseLog(this.config.nameSpace, this.error);
    const filteredDataArray = filterData(curStoreDataArray, time, level, content);
    filteredDataArray.forEach((item): void => {
      file += encodeURIComponent(`${JSON.stringify(item)}${this.config.lineBreak}`);
    });

    const a: HTMLAnchorElement = document.createElement('a');
    a.href = file;
    a.target = '_blank';
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  /* log */
  public log = (message: unknown) => {
    this.setLog({
      level: 'log',
      message,
    });
    return this;
  };

  /* info */
  public info = (message: unknown) => {
    this.setLog({
      level: 'info',
      message,
    });
    return this;
  };

  /* warn */
  public warn = (message: unknown) => {
    this.setLog({
      level: 'warn',
      message,
    });
    return this;
  };

  /* error */
  public error = (message: unknown) => {
    this.setLog({
      level: 'error',
      message,
    });
    return this;
  };
}

