import mockjs from 'mockjs';

function getFakeAppointment(req, res) {
  const result = mockjs.mock({
    'data|2': [{
      'serialNumber': '@integer(1,10000000)',
      'appointCode': /\d{10}/,
      'idCard':  /^440119\d{12}/,
      'mobile': /^1[385][1-9]\d{8}/,
      'fullname': '@cname()',
      'maskName': '口罩',
      'maskId' : '100001',
      'appointNum' : 5,
      'quantum' : '@integer(0,1)',
      'saled' : false,
    }],
    'success' : true,
    'message' : '',
  });
  return res.json(result);
}

function postAppointmentResult(req, res) {
  const result = mockjs.mock({
    'data': [{
      'serialNumber': '@integer(1,10000000)',
      'appointCode': /\d{10}/,
      'idCard':  /^440119\d{12}/,
      'mobile': /^1[385][1-9]\d{8}/,
      'fullname': '@cname()',
      'maskName': '口罩',
      'maskId' : '100001',
      'appointNum' : 5,
      'quantum' : '@integer(0,1)',
      'saled' : true,
    }],
    'success' : true,
    'message' : '',
  });
  return res.json(result);
}

function getFakeOrders(req, res) {
  const result = mockjs.mock({
    'data|10': [{
      'serialNumber': '@integer(1,10000000)',
      'chemisId': 'HY0001',
      'appointCode': /\d{10}/,
      'idCard':  /^440119\d{12}/,
      'mobile': /^1[385][1-9]\d{8}/,
      'fullname': '@cname()',
      'maskName': '口罩',
      'maskId' : '100001',
      'appointNum' : 5,
      'quantum' : '@integer(0,1)',
      'saled' : false,
      'appointDate' : '@date("yyyy-MM-dd")',
    }],
    'success' : true,
    'message' : '',
  });
  return res.json(result);
}

export default {
  'GET /rest/order/queryAppointOrder': getFakeAppointment,
  'POST /rest/order/confirmAppointOrder': postAppointmentResult,
  'GET /rest/order/queryChemistOrders': getFakeOrders,
};
