import type { LogLevel } from './index';

export const styles = (type?: LogLevel, leftRadius?: boolean) => {
  const commonStyle = [
    'font-size: 14px',
    'color: #F5F5F5',
    'background: #606060',
    'border-top-left-radius: 3px',
    'border-bottom-left-radius: 3px',
  ];
  if (type) {
    switch (type) {
      case 'log':
        commonStyle.push('background-color: #b7eb8f');
        break;
      case 'info':
        commonStyle.push('background-color: #91d5ff');
        break;
      case 'warn':
        commonStyle.push('background-color: #ffe58f');
        break;
      case 'error':
        commonStyle.push('background-color: #ffccc7');
        break;
      default:
        commonStyle.push('background-color: #b7eb8f');
        break;
    }
    commonStyle.push(
      'border-top-left-radius: 0',
      'border-bottom-left-radius: 0',
      'border-top-right-radius: 3px',
      'border-bottom-right-radius: 3px',
    );
    leftRadius && commonStyle.push(
      'border-top-left-radius: 3px',
      'border-bottom-left-radius: 3px',
    );
  }
  return commonStyle.join(';');
};
