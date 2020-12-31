// @ts-ignore
import request from '@/utils/request';

export async function login(params) {
  return request('/rest/account/login', {
    method: 'POST',
    expirys : false,
    body: {
      ...params,
    },
  });
}