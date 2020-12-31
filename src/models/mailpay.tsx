// @ts-ignore
import { queryPayments } from '@/services/mailpay';
import { Toast } from 'antd-mobile';
// import { router } from 'dva/router';

export default {
  namespace: 'mailpay',
  state: {
    paymentData : [],
    message : '',
  },
  effects: {
    *queryPayments({ payload }, { call, put, select }) {
      Toast.loading('正在查找付款信息...');
      const response = yield call(queryPayments, payload);
      yield put({
        type: 'saveOrderData',
        payload: {
          ...response,
        },
      });
      Toast.hide();
    },
  },
  reducers: {
    saveOrderData(state, { payload }) {
      const { success, data } = payload;

      return {
        ...state,
        paymentData : data,
        message : success? '' : payload.message
      };
    },
  },
};
