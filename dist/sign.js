
const crypto = require('crypto')
const ruleStruct = require("./ruleStruct")

/** @thanks https://attacomsian.com/blog/nodejs-encrypt-decrypt-data */
// aes-128-ctr, aes-192-ctr, aes-256-ctr

class Sign {
    constructor() {
        this.algorithm = 'aes-256-ctr'; 
        this.secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
        this.iv = crypto.randomBytes(16); 
    }

    encrypt(text, secretKey = this.secretKey){
        const cipher = crypto.createCipheriv(this.algorithm, secretKey, this.iv); 
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        
        return {
            iv: this.iv.toString('hex'),
            content: encrypted.toString('hex')
        }
    }

    decrypt(hash, secretKey = this.secretKey) {
        const decipher = crypto.createDecipheriv(this.algorithm, secretKey, Buffer.from(hash.iv, 'hex')) //suspecting something here 
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])
        return decrpyted.toString(); 
    }

    makeZeroString (value)  {
        let s = '0' + value.toString();
        return s.substr(s.length - 2, 2);
    }

    getNow (locale = undefined) {
        const dayUTC = new Date();
        const dayUTCUnixtime = dayUTC.getTime() / 1000
        const dayKrUnixtime = dayUTCUnixtime + (locale == undefined ? localeTimes * 3600 : locale * 3600)
        const day = new Date(dayKrUnixtime * 1000)
      
        return {
            day     : day,
            year4   : day.getUTCFullYear().toString(),
            year2   : day.getUTCFullYear().toString().substr(2,2),
            month3  : ruleStruct.longEnabled
                        ? ruleStruct.longMonths[day.getUTCMonth()]
                        : ruleStruct.shortMonths[day.getUTCMonth()].toUpperCase(),
            month2  : this.makeZeroString((day.getUTCMonth() + 1)),
            week    : ruleStruct.longEnabled
                        ? ruleStruct.longWeeks[day.getUTCDay()]
                        : ruleStruct.shortWeeks[day.getUTCDay()].toUpperCase(),
            date    : this.makeZeroString(day.getUTCDate()),
            hour    : this.makeZeroString(day.getUTCHours()),
            minute  : this.makeZeroString(day.getUTCMinutes()),
        }
    }

    str2json(str) {
        var index = 0
        let len = str.length
        let json = []
        
        while(index < len){
            let code = str[index]
            switch(code){
                case ruleStruct.typeYear4.type:   json.push(ruleStruct.typeYear4);  index++;  break
                case ruleStruct.typeYear2.type:   json.push(ruleStruct.typeYear2);  index++;  break
                case ruleStruct.typeMonth3.type:  json.push(ruleStruct.typeMonth3); index++;  break
                case ruleStruct.typeMonth2.type:  json.push(ruleStruct.typeMonth2); index++;  break
                case ruleStruct.typeWeek.type:    json.push(ruleStruct.typeWeek);   index++;  break
                case ruleStruct.typeDate.type:    json.push(ruleStruct.typeDate);   index++;  break
                case ruleStruct.typeHour.type:    json.push(ruleStruct.typeHour);   index++;  break
                case ruleStruct.typeMinute.type:  json.push(ruleStruct.typeMinute); index++;  break
                case ruleStruct.typeFix.type:
                    let z = str.substr(index, len)
                    let n = z.indexOf(':')
                    let l = z.substr(2,n-2)
                    let s = z.substr(n+1, l)
                    index += (n + 2 + l*1)

                    json.push({
                        ...JSON.parse(JSON.stringify(ruleStruct.typeFix)),
                        format  : s,
                        length  : l * 1
                    })
                    break
                default: // fail
                    return []
            } // switch
        } // while

            return json
    }
}


module.exports = Sign