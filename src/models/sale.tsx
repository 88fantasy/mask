// @ts-ignore
import { queryAppointment, confirmAppointment, queryChemistOrders } from '@/services/sale';
import { Toast } from 'antd-mobile';
// import { router } from 'dva/router';

const translate = (rows : []) => {
  rows.map ( row => {
    row.mobile = `${row.mobile.substring(0,3)}****${row.mobile.substring(7)}`;
    Object.assign(row,{
      saleString : row.saled? '已核销' : '未核销',
      quantumString : row.quantum === 0 ? '上午' : '下午',
    });
  });
};

export default {
  namespace: 'sale',
  state: {
    appointmentData: [],
    orderData : [],
    message : '',
  },
  effects: {
    *queryAppointment({ payload, callback }, { call, put, select }) {
      Toast.loading('正在获取预约码信息...');
      const response = yield call(queryAppointment, payload);
      yield put({
        type: 'saveAppointmentData',
        payload: {
          ...response,
        },
      });
      Toast.hide();
      if (callback) {
        callback(response, true);
      }
    },
    *confirmAppointment({ payload }, { call, put, select }) {
      Toast.loading('正在核销...');
      const response = yield call(confirmAppointment, payload);
      yield put({
        type: 'saveAppointmentData',
        payload: {
          ...response,
        },
      });
      Toast.hide();
    },
    *queryChemistOrders({ payload }, { call, put, select }) {
      Toast.loading('正在查找门店所有预约码...');
      const response = yield call(queryChemistOrders, payload);
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
    saveAppointmentData(state, { payload }) {
      const { success, data } = payload;

      if( success) {
        translate(data);
      }

      return {
        ...state,
        appointmentData : data,
        message : success? '' : payload.message
      };
    },
    saveOrderData(state, { payload }) {
      const { success, data } = payload;

      if( success) {
        translate(data);
      }

      return {
        ...state,
        orderData : data,
        message : success? '' : payload.message
      };
    },
  },
};
