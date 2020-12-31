// @ts-ignore
import request from '@/utils/request';
import { stringify } from 'qs';


export async function queryPayments(params) {
  return request(`/rest/mailpay/queryPayments?${stringify(params)}`);
}