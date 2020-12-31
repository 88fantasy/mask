import { Toast, Modal } from 'antd-mobile';
import { setAuthority } from '@/utils/authority';
import { isWeiXin } from '@/utils/utils';
// import initWx from '@/utils/wx';
// import debug from '@/utils/debug';
import './global.less';

if (!isWeiXin()) {
  // const { host } = window.location;
  // if( host !== '47.113.226.39') {
  //   window.location.replace('http://47.113.226.39/');
  // }
} 
else {
  // initWx({
  //   title: '“盐值担当”2018城区形象表情包大赛',
  //   imgUrl: 'https://h5.parsec.com.cn/common/emoticon-icon.png',
  //   isNeedLogin: true,
  //   desc: '盐田城区形象表情包大赛，万元奖金等你拿',
  //   openid: process.env.NODE_ENV === 'development' ? 'oEgayjggrU06oORZJVeFUJ_KF1Mk' : undefined,
  // });
  const localHref = encodeURIComponent(window.location.href.split('#')[0]);
  const body = JSON.stringify({
    url : localHref
  },null,2);
  fetch('/rest/wx/wechatKey',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
      cache: 'no-cache',
      body,
    })
     .then(res =>res.json())
     .then((response) => {
      const config = {
        ...response.data,
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        jsApiList: [ 'checkJsApi', 'scanQRCode' ] // 必填，需要使用的JS接口列表
      };

      window.wx.config(config);
      
     })
     .catch(e => console.log('错误:', e));
}

// Notify user if offline now
window.addEventListener('sw.offline', () => {
  Toast.offline('当前处于离线状态');
});

// Pop up a prompt on the page asking the user if they want to use the latest version
window.addEventListener('sw.updated', e => {
  // console.log('sw.updated');
  const reloadSW = async () => {
    // Check if there is sw whose state is waiting in ServiceWorkerRegistration
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
    const worker = e.detail && e.detail.waiting;
    if (!worker) {
      return Promise.resolve();
    }
    // Send skip-waiting event to waiting SW with MessageChannel
    await new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = event => {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
    });
    // Refresh current page to use the updated HTML and other assets after SW has skiped waiting
    window.location.reload(true);
    return true;
  };
  Modal.alert('有新内容', '请点击“刷新”按钮或者手动刷新页面', [
    {
      text: '刷新',
      onPress: () => {
        reloadSW();
      },
    },
  ]);
});
