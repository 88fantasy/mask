import mockjs from 'mockjs';

function getFakePaymentss(req, res) {
  const result = mockjs.mock({
    'data|200': [{
      'pk': '@integer(1,10000000)',
      'address': '@integer(1,10000000)',
      'maskId': 100011,
      'maskName': '口罩',
      'payTime' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      'appointDate' : '@date("yyyy-MM-dd")',
    }],
    'success' : true,
    'message' : '',
  });
  return res.json(result);
}

export default {
  'GET /rest/mailpay/queryPayments': getFakePaymentss,
};
