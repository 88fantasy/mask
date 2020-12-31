// @ts-ignore
import { login, getWechatKey } from '@/services/account';
import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';

import { setAuthority, setAccount } from '@/utils/authority';

export default {
  namespace: 'account',
  state: {
    msg : "",
    accountData: {
      user : "",
      accountName : "",
    },
  },
  effects: {
    *login({ payload }, { call, put, select }) {
      Toast.loading('正在登录...');
      const response = yield call(login, payload);
      yield put({
        type: 'saveAccountData',
        payload: {
          ...response,
        },
      });
      Toast.hide();

      const { accountData } = yield select(state => state.account);
      if(accountData.user !== '') {
        setAccount({
          user : accountData.user,
          accountName : accountData.accountName,
        });
        setAuthority("user");
        yield put(routerRedux.replace('/'));
      }
    },
  },
  reducers: {
    saveAccountData(state, { payload }) {
      if(payload.success) {
        const { data } = payload;
        return {
          ...state,
          accountData : {
            user : data.user,
            accountName : data.accountName,
            msg : '',
          }
        };
      }
      else {
        return {
          ...state,
          msg : payload.message,
          accountData : {
            user : '',
            accountName : '',
          }
        };
      }
    },
  },
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     return history.listen(({ pathname, query }) => {
  //       if (pathname === '/users') {
  //         dispatch({ type: 'fetch', payload: query });
  //       }
  //     });
  //   },
  // },
};
