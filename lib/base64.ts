// Base64 编码/解码实现
const BASE64_ARRAY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").map(c => c.charCodeAt(0))
const BASE64_ENCODE_TABLE = new Map(BASE64_ARRAY.map((ord, i) => [i, ord]))
const BASE64_DECODE_TABLE = new Map(BASE64_ARRAY.map((ord, i) => [ord, i]))

export function encode(buffer: ArrayBuffer | Uint8Array): Uint8Array {
    const buf = new Uint8Array(buffer).slice()
    const output = new Uint8Array(Math.ceil(Math.ceil(buf.length * 4 / 3) / 4) * 4)
    const continuous = Math.floor(buf.length / 3) * 3

    for (let i = 0; i < continuous; i+=3){
        const k = 4 * i / 3
        output[k] = BASE64_ENCODE_TABLE.get(buf[i] >> 2)!
        output[k+1] = BASE64_ENCODE_TABLE.get((buf[i] & 0x03) << 4 | buf[i+1] >> 4)!
        output[k+2] = BASE64_ENCODE_TABLE.get((buf[i+1] & 0x0F) << 2 | buf[i+2] >> 6)!
        output[k+3] = BASE64_ENCODE_TABLE.get(buf[i+2] & 0x3F)!
    }

    if (buf[continuous] !== undefined){
        const k = 4 * continuous / 3
        output[k] = BASE64_ENCODE_TABLE.get(buf[continuous] >> 2)!
        if (buf[continuous+1] === undefined){
            output[k+1] = BASE64_ENCODE_TABLE.get((buf[continuous] & 0x03) << 4)!
            output[k+2] = BASE64_ENCODE_TABLE.get(64)!
        } else {
            output[k+1] = BASE64_ENCODE_TABLE.get((buf[continuous] & 0x03) << 4 | buf[continuous+1] >> 4)!
            output[k+2] = BASE64_ENCODE_TABLE.get((buf[continuous+1] & 0x0F) << 2)!
        }
        output[k+3] = BASE64_ENCODE_TABLE.get(64)!
    }

    return output 
}

export function decode(buffer: ArrayBuffer | Uint8Array): Uint8Array {
    let buf = new Uint8Array(buffer).slice()
    buf = buf.map(v => BASE64_DECODE_TABLE.get(v)!)
    
    const p = buf.indexOf(64)
    buf = buf.subarray(0, p !== -1 ? p : buf.length)
    
    const output = new Uint8Array(3 * buf.length / 4) 
    const continuous = Math.floor(buf.length / 4) * 4 
    
    for (let i = 0; i < continuous; i+=4){
        const k = 3 * i / 4 
        output[k] = buf[i] << 2 | buf[i+1] >> 4
        output[k+1] = (buf[i+1] & 0x0F) << 4 | buf[i+2] >> 2
        output[k+2] = (buf[i+2] & 0x03) << 6 | buf[i+3] 
    }
    
    if (buf[continuous] !== undefined){
        const k = 3 * continuous / 4 
        output[k] = buf[continuous] << 2 | buf[continuous+1] >> 4
        if (buf[continuous+2] !== undefined){
            output[k+1] = (buf[continuous+1] & 0x0F) << 4 | buf[continuous+2] >> 2
        }
    }
    
    return output
}

