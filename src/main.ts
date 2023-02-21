import * as https from "https";
import * as querystring from "querystring";
const sha256 = require("sha256")
import {appId,appKey} from './privite'

type requestData = {
    errorCode:string,
    query:string,
    translation:string[],
    basic: {explains:string[]},
}
export const translate = (word:string) => {
/*
        const pattern = new RegExp("[\u4E00-\u9FA5]+");
        if(pattern.test(word)){
            word = encodeURIComponent(word)
        }
*/
    const salt = (new Date).getTime()
    const curtime = Math.round(new Date().getTime() / 1000)
    const sign = sha256(appId+encodeURIComponent(word)+salt+curtime + appKey)
    const postData = querystring.stringify({
        q: word,
        from: 'auto',
        to: 'auto',
        appKey: appId,
        salt,
        sign: sign,
        signType: 'v3',
        curtime,
    })

    const options = {
        hostname:'openapi.youdao.com',
        path: '/api',
        method: 'POST',
        port: '443',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    }
    const request = https.request(options, (response) => {
        let chunks:Buffer[] = []
        response.on('data', (chunk: Buffer) => {
            chunks.push(chunk)
        })
        response.on('end', () => {
           const string = Buffer.concat(chunks).toString()
            const object:requestData = JSON.parse(string)
            if(object.errorCode !== '0'){
                console.error('出错了')
                process.exit(2)
            }else {
                console.log(object.translation.join(','));
                console.log(object.basic.explains.join(','));
                process.exit(0)
            }
        })
    })
    request.on('error', (err) => {
        console.log(err);
    })
    request.write(postData)
    request.end()
}
