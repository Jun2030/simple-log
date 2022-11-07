const padTo2Digits = (num: number): string => {
  return num.toString().padStart(2, '0');
};

/**
 * @description  :时间戳格式化
 * @param         {Date} dateVal 时间戳
 * @return        {*}
 */
export const formatTimestamp = (dateVal?: Date, onlyDate?: boolean): string => {
  const timestamp = dateVal || new Date();
  const year = timestamp.getFullYear();
  const month = padTo2Digits(timestamp.getMonth() + 1);
  const date = padTo2Digits(timestamp.getDate());
  if (onlyDate) {
    return `${year}-${month}-${date}`;
  } else {
    const hrs = padTo2Digits(timestamp.getHours());
    const mins = padTo2Digits(timestamp.getMinutes());
    const secs = padTo2Digits(timestamp.getSeconds());
    const ms = timestamp.getMilliseconds();
    return `${year}-${month}-${date} ${hrs}:${mins}:${secs}.${ms}`;
  }
};

const HTTP_REG = /(http|https):\/\/\S*/;
const WS_REG = /(ws|wss):\/\/\S*/;

/**
 * @description  :获取协议
 * @return        {*} '' | 'HTTP' | 'WS'
 */
export const getProtocol = (serverUrl: string): '' | 'HTTP' | 'WS' => {
  if (HTTP_REG.test(serverUrl)) {
    // http服务
    return 'HTTP';
  } else if (WS_REG.test(serverUrl)) {
    // ws服务
    return 'WS';
  } else {
    return '';
  }
};
