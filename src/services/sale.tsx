// @ts-ignore
import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryAppointment(params) {
  return request(`/rest/order/queryAppointOrder?${stringify(params)}`);
}

export async function confirmAppointment(params) {
  return request('/rest/order/confirmAppointOrder', {
    method: 'POST',
    expirys : false,
    body: {
      ...params,
    },
  });
}

export async function queryChemistOrders(params) {
  return request(`/rest/order/queryChemistOrders?${stringify(params)}`);
}