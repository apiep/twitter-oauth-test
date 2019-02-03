const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios')

var global = {}
if (this.hasOwnProperty('window')) {
  global = window
}

const consumerKey = 'YOUR_TWITTER_KEY'
const consumerSecret = 'YOUR_TWITTER_SECRET_KEY'

const oauth = global.oauth = OAuth({
  consumer: {
    key: consumerKey,
    secret: consumerSecret
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

global.authorize = function authorize() {
  return oauth.authorize({
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'post',
    data: {
      oauth_callback: 'http://localhost:1234/twitter'
    }
  })
}

global.requestToken = function requestToken() {
  return axios({
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'post',
    headers: oauth.toHeader(global.authorize()),
    transformResponse: [function (data) {
      return data
    }]
  })
}

global.requestToken()
  .then(res => console.log('result', res.data))
  .catch(err => console.log('error', err.response.data))