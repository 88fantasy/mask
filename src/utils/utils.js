import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

/**
 *  获取 UUID
 *
 * @param len 长度
 * @param radix 基数
 * @returns {string}
 */
export function generateUUID(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

/**
 * 判断是否微信端
 *
 * @export
 * @returns
 */
export function isWeiXin() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
}


function getCsvBlob(headers, rows) {
  const BOM = '\uFEFF';
  const columnDelimiter = ','; //默认列分隔符','
  const rowDelimiter = '\r\n'; //默认行分隔符 '\r\n'
  let csv = headers.reduce((previous, header) => (previous ? previous + columnDelimiter : '') + (header.title || header.column), '');
  if (Array.isArray(rows) && rows.length > 0) {
    const columns = headers.map(header => header.column);
      csv = rows.reduce((previous, row) => {
        const rowCsv = columns.reduce((pre, column) => {
              if (row.hasOwnProperty(column)) {
                  let cell = row[column];
                  if (cell != null) {
                    const header = headers.find(item => item.column === column);
                      if (header.formatter != null && typeof (header.formatter) === "function") {
                          cell = header.formatter(cell);
                      }
                      if (cell != null) {
                          cell = cell.toString().replace(new RegExp(rowDelimiter, 'g'), ' '); // 若数据中本来就含行分隔符，则用' '替换
                          cell = new RegExp(columnDelimiter).test(cell) ? `"${cell}"` : cell; // 若数据中本来就含列分隔符，则用""包起来
                          return pre ? pre + columnDelimiter + cell : pre + cell;
                      }
                  }
                  return pre ? pre + columnDelimiter : `${pre} `;// reduce初始值为''，故第一次迭代时不会在行首加列分隔符。后面的遇到值为空或不存在的列要填充含空格的空白" ",则pre返回true，会加列分隔符
              }
              return pre ? pre + columnDelimiter : `${pre} `;// 即使不存在该列也要填充空白，避免数据和表头错位不对应
              
          }, '');
          return previous + rowDelimiter + rowCsv;
      }, csv);
  }
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  return blob;
}

/*
 * 参数：
 *    headers：表头
 *             格式如：
 *             [
 *               {
 *                  column:"userid", //列字段
 *                  title: "姓名", //表头标题
 *                  formatter:(value) =>{return ... }   //格式化函数  
 *                },
 *                ...
 *              ]
 *    
 *    rows：行
 *          格式如：[{userid:101,gender:0 },{userid:102,gender:1}]
 *    filename：导出保存的文件名
 */
export function exportCsv(headers, rows, filename) {
  if (Array.isArray(headers) && headers.length > 0) { //表头信息不能为空
    const fileName = filename || "export.csv";
      const blob = getCsvBlob(headers, rows);
      if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
      }
  }
}

