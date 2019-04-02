let domain = process.env.NODE_ENV === 'development' ? 'dev.koall.io' : location.host.split(':')[0]
if (process.env.SERVER_DOMAIN) {
  domain = process.env.SERVER_DOMAIN
}
const https = process.env.HTTPS === true
const protocol = window.location.protocol === 'https:' || https ? 'wss://': 'ws://'
const http = window.location.protocol === 'https:' || https ? 'https://' : 'http://'
const app = process.env.APP === true
const config = {
  domain: domain,
  imageType: /\.(jpg|png|jpeg|bmp)/i,
  http: http,
  url: `${http}${domain}`,
  app: app,
  protocol: protocol,
  brand: 'cdcc',
  mySymbol: 'CDCC',
  version:'1.0.9'
}

export default config
