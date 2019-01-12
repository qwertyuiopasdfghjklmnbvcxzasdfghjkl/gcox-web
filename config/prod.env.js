var merge = require('webpack-merge')
let defaultConfig = {
  NODE_ENV: '"production"'
}
let envConfig = {}
for (let i in defaultConfig) {
  envConfig[i] = defaultConfig[i]
}
let queryArr = JSON.parse(process.env.npm_config_argv).remain
for (let i = 0; i < queryArr.length; i++) {
  let split = queryArr[i].split('=')
  let pro = split[0]
  let value = split[1]
  if (!pro || !value) {
    continue
  }
  if (!envConfig[pro]) {
    envConfig[pro] = value
  }
}
console.log(envConfig)
module.exports = envConfig
