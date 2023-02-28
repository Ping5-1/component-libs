/*
 * @objectDescription: 
 * @LastEditors: wyp
 * @LastEditTime: 2023-02-28 10:59:32
 * @FilePath: \component-libs\src\utils\validate.js
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 百分比
export function percentValidate(rule, value, callback) {
  if (!value) {
    callback();
  }
  
  if (!reg.test(value)) {
    callback(new Error('请输入数字值'));
  } else  if (value < 0 || value > 100) {
    callback(new Error('请输入0-100以内的数字'));
  } 
  callback();
}

// 数字值
export function numberValidate(rule, value, callback) {
  if (!value) {
    callback();
  }

  if (!reg.test(value)) {
    callback(new Error('请输入数字值'));
  } 
  callback();
}

// 正数字值
export function positiveNumberValidate(rule, value, callback) {
  if (!value) {
    callback();
  }

  if (!positiveReg.test(value)) {
    callback(new Error('请输入正数值'));
  } 
  callback();
}

// 颜色值
export function isLegalColor(color) {
  var colorReg1 = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i;
  var colorReg2 = /^rgb\(([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\)$/i;
  var colorReg3 = /^rgba\(([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,(1|1.0|0.[0-9])\)$/i;
  return colorReg1.test(color) || colorReg2.test(color) || colorReg3.test(color);
}


// 整数值表单校验
export function intergerValidate(rule, value, callback) {
  if (!value) { callback();}
  const  reg = /^[1-9]\d*$/;
  if (!reg.test(value)) {
    callback(new Error('请输入正数值'));
  } 
  callback();
}

// 处理XXX和 XXX-XX 以及 XXX/XX 格式的IP范围
export function ipRangeValidate(rule, value, callback) {
  value = value.replace(/\s*/g,'');
  if (!value) {
    callback();
  }

  const ipReg = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
  let split = value.match('-') || [];// 用于判断有几个 -
  let netSplit = value.split('/') || [];// 直接分割 /
  if(split.length !== 1 && split.length !== 2 && split.length !== 0) callback(new Error('输入格式有误！'));

  // 处理不包含 - 的格式
  if(!split.length) {
    // 单IP
    if (!netSplit.length && !ipReg.test(value)) {
      callback(new Error('输入格式有误！'));
    }
    // 子网掩码写法
    if(!ipReg.test(netSplit[0]) || netSplit[1] < 16 || netSplit[1] > 30) {
      callback(new Error('输入格式有误！'));
    }
    callback();
  }

  // IP范围
  const ip = '(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))';
  const ipRange = '(' + ip + '\\-' + ip + ')';
  const ipOrRange = `(${ip}|${ipRange})`;
  let ipRangeReg = eval(`/^(${ip}\\.){2}${ipOrRange}\\.${ipOrRange}$/`);
  if(!ipRangeReg.test(value)) {
    callback(new Error('输入格式有误！'));
  }

  // 判断范围大小
  let range = value.split('.');
  range.forEach((val)=>{
    let [small,large] = val.split('-') || ['',''];
    if(small >= large) {
      callback(new Error('输入格式有误！'));
      return;
    }
  });
  callback();
}
