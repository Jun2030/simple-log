import type { LogLevel, StoreItem } from './index';

interface DataEvent extends Event {
  data?: string | Record<string, unknown>;
}

interface HttpOption {
  tokenKey: string;
  tokenValue: string;
}

/* 解析本地存储日志 */
export const parseLog = (namespace: string, error: any): StoreItem[] => {
  let curArray: StoreItem[] = [];
  const curStoreDataJSON: Nullable<string> = window.localStorage.getItem(namespace);
  if (curStoreDataJSON) {
    try {
      curArray = JSON.parse(curStoreDataJSON);
    } catch {
      error('JSON.parse解析出错');
    }
  }
  return curArray;
};

/**
 * @description  :过滤搜索数据
 * @param         {StoreItem} dataArray 本地store存储日志集合
 * @param         {string} time 过滤参数-时间
 * @param         {LogLevel} level 过滤参数-日志级别
 * @param         {string} content 过滤参数-日志内容
 * @return        {*} 过滤后的日志集合
 */
export const filterData = (dataArray: StoreItem[], time?: string | FixedLengthArray<[string, string]>, level?: LogLevel | '', content?: string) => {
  let resArr: StoreItem[] = dataArray;
  if (time) {
    if (Array.isArray(time)) {
      resArr = resArr.filter(item => item.timer >= time[0] && item.timer <= time[1]);
    } else {
      resArr = resArr.filter(item => item.timer >= time);
    }
  }
  if (level) {
    resArr = resArr.filter(item => item.level === level);
  }
  if (content) {
    resArr = resArr.filter(item => item.message && (item.message as string).includes(content));
  }
  return resArr;
};

/**
 * @description  :建立websocket连接
 * @param         {string} wsUrl ws/wss 日志上报连接地址
 * @param         {any} log Log实例log方法
 * @param         {any} error Log实例error方法
 * @return        {ws} websocket 实例
 */
export const setupWSServer = (wsUrl: string, log: any, error: any): Promise<WebSocket | null> => {
  return new Promise((resolve, reject) => {
    if ('WebSocket' in window) {
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        switch (ws.readyState) {
          case ws.CONNECTING:
            log('websocket服务正在连接');
            break;
          case ws.OPEN:
            log('websocket服务连接成功');
            return null;
          default:
            break;
        }
      };
      ws.onclose = () => {
        switch (ws.readyState) {
          case ws.CLOSING:
            log('websocket服务正在断开');
            break;
          case ws.CLOSED:
            log('websocket服务已断开');
            break;
          default:
            break;
        }
      };
      ws.onerror = (event: DataEvent) => {
        return error(event.data || 'websocket服务连接错误');
      };
      resolve(ws);
    } else {
      return reject(new Error('不支持WebSocket'));
    }
  });
};

/**
 * @description  :建立Http连接
 * @param         {string} httpUrl http日志上报地址
 * @param         {HttpOption} options 鉴权相关配置
 * @param         {any} data 上报数据
 * @return        {*}
 */
export const HttpServer = (httpUrl: string, options: HttpOption, data: any): Promise<unknown> => {
  const { tokenKey, tokenValue } = options;
  return new Promise((resolve, reject): void => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', httpUrl, true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8;');
    tokenKey && tokenValue && xhr.setRequestHeader(tokenKey, tokenValue);
    xhr.responseType = 'json';
    console.log({ data });
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(new Error('日志上报出错'));
      }
    };
  });
};
