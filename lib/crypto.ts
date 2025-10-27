import { ModeOfOperation as aes } from 'aes-js'
import * as base64 from './base64'

const cSharpHeader = [0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0]
const aesKey = stringToBytes('UKu52ePUBwetZ9wNX88o54dnfKRu0T1l')
const ecb = new aes.ecb(aesKey)

function stringToBytes(string: string): Uint8Array {
    return new TextEncoder().encode(string) 
}

function bytesToString(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes)
}

// AES 解密并移除 PKCS7 填充 
function aesDecrypt(bytes: Uint8Array): Uint8Array {
    const data = ecb.decrypt(bytes)
    return data.subarray(0, -data[data.length-1]) 
}

// PKCS7 填充并加密 
function aesEncrypt(bytes: Uint8Array): Uint8Array {
    const padValue = 16 - bytes.length % 16
    const padded = new Uint8Array(bytes.length + padValue)
    padded.fill(padValue)
    padded.set(bytes)
    return new Uint8Array(ecb.encrypt(padded))
}

// LengthPrefixedString https://msdn.microsoft.com/en-us/library/cc236844.aspx
function generateLengthPrefixedString(length: number): number[] {
    let len = Math.min(0x7FFFFFFF, length)
    const bytes: number[] = [] 
    
    for (let i=0; i<4; i++){
        if (len >> 7 !== 0){
            bytes.push(len & 0x7F | 0x80)
            len >>= 7 
        } else {
            bytes.push(len & 0x7F)
            len >>= 7
            break 
        }
    } 
    
    if (len !== 0){
        bytes.push(len)
    }

    return bytes 
}

function addHeader(bytes: Uint8Array): Uint8Array {
    const lengthData = generateLengthPrefixedString(bytes.length)
    const newBytes = new Uint8Array(bytes.length + cSharpHeader.length + lengthData.length + 1)
    newBytes.set(cSharpHeader)
    newBytes.subarray(cSharpHeader.length).set(lengthData)
    newBytes.subarray(cSharpHeader.length + lengthData.length).set(bytes)
    newBytes.subarray(cSharpHeader.length + lengthData.length + bytes.length).set([11])
    return newBytes
}

function removeHeader(bytes: Uint8Array): Uint8Array {
    let buf = bytes.subarray(cSharpHeader.length, bytes.length - 1) 
    
    let lengthCount = 0 
    for (let i = 0; i < 5; i++){
        lengthCount++
        if ((buf[i] & 0x80) === 0){ 
            break  
        }
    }
    buf = buf.subarray(lengthCount)

    return buf 
}

export function decode(bytes: Uint8Array): string {
    let buf: Uint8Array = bytes.slice() 
    buf = removeHeader(buf) as Uint8Array
    buf = base64.decode(buf) as Uint8Array
    buf = aesDecrypt(buf) as Uint8Array
    return bytesToString(buf)
}

export function encode(jsonString: string): Uint8Array {
    let bytes = stringToBytes(jsonString)
    bytes = aesEncrypt(bytes)
    bytes = base64.encode(bytes)
    return addHeader(bytes)
}

export function hash(string: string): number {
    return string.split("").reduce((a, b) => {
        return ((a << 5) - a) + b.charCodeAt(0)   
    }, 0)
}

export function humanTime(date: Date): string {
    const minutes = (new Date().getTime() - date.getTime()) / 1000 / 60
    const hours = minutes / 60  
    const days = hours / 24
    const weeks = days / 7
    const months = weeks / 4 
    const years = months / 12 

    const round = (value: number, precision: number) => {
        const multi = Math.pow(10, precision)
        return Math.round(value * multi) / multi
    }

    if (minutes < 1){
        return "just now"
    } else if (minutes < 120){
        return `about ${round(minutes, 0)} minutes ago`
    } else if (hours < 48){
        return `about ${round(hours, 0)} hours ago`
    } else if (days < 14){
        return `about ${round(days, 0)} days ago`
    } else if (weeks < 8){
        return `about ${round(weeks, 0)} weeks ago`
    } else if (months < 24){
        return `about ${round(months, 1)} months ago`
    } 

    return `about ${round(years, 1)} years ago`
}

export function downloadData(data: Uint8Array | string, fileName: string): void {
    const a = document.createElement("a")
    const blobData = data instanceof Uint8Array ? new Uint8Array(data) : data
    a.setAttribute("href", window.URL.createObjectURL(new Blob([blobData], {type: "octet/stream"})))
    a.setAttribute('download', fileName)
    a.setAttribute('style', 'position: fixed; opacity: 0; left: 0; top: 0;')
    document.body.append(a)
    a.click()
    document.body.removeChild(a)
}

