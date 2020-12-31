import mockjs from 'mockjs';


function postLoginTestResult(req, res) {
  const result = mockjs.mock({
    success: true,
    data : {
      user : 'GZ0001',
      accountName : '电商',
    },
  });
  return res.json(result);
}

function getWechatKeyResult(req, res) {
  const result = mockjs.mock({
    success: true,
    data : {
      appId : 'wx0739399759ec14dc',
      noncestr : '3VlthdrrEB6SFvY5',
      timestamp : 1581383443,
      signature : 'dfc3f93e9c054525834d9a012399a14ba374996c',
    },
  });
  return res.json(result);
}

export default {
  'POST /rest/account/login': postLoginTestResult,
  'GET /rest/account/getWechatKey': getWechatKeyResult,
};
