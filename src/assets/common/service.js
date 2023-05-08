import axios from 'axios'
import qs from 'qs'
import { dateFormat } from 'js-dateformat'
import router from '@/router'

// axios.defaults.baseURL = '/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 50000

let formLabelAlign = {
    username: "",
    mail: "",
    nickname: "",
    pwd: "",
}
// //七牛云配置文件
// const qiniu = require('qiniu')

// // 创建上传凭证（accessKey 和 secretKey在七牛云个人中心中有，lytton是七牛云刚才创建的空间名称）
// const accessKey = 'Jrq-xb1wZUz4muQF-LDh9GtvVwJS8Oh7TZ6KsKAZ' //你自己七牛的密钥
// const secretKey = 'fvkDp42Acr1L1SOgk2JNOaB1pERd2PiJp4p6Hnpd' //你自己七牛的密钥
// const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
// const options = {
//   scope: 'zhanqu1', //这是你创建存储空间的名字
//   // deadline: 1695523678 //这是七牛云生成token的有效期，单位时秒，不设置默认是3600S，一串数字是时间戳
// }
// const putPolicy = new qiniu.rs.PutPolicy(options)
// const uploadToken = putPolicy.uploadToken(mac)

// module.exports = {
//   uploadToken  //导出的是七牛云生成的token，很重要
// }

// const loginUrl = '/login'
// let _this = this

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前处理
    // console.log(config)
    // config.paramsSerializer = function(params) {
    //     return qs.stringify(params, { arrayFormat: 'repeat' })
    //   }
    if (localStorage.getItem('token')) {
        config.headers['token'] = localStorage.getItem('token')
        return config
    } else {
        if (config.url.indexOf('/api/user/login') === 0) {
            return config
        } else {
            // location.href = loginUrl
        }
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

// 响应拦截
axios.interceptors.response.use(function (response) {
    // 处理响应数据
    // console.log(response)
    if (response.data.code === 600) {
        localStorage.removeItem('token')
        router.replace('/login')
    }
    if (response.status === 200) {
        return Promise.resolve(response)
    } else {

        return Promise.reject(new Error())
    }
}, function (error) {
    // 处理响应失败
    return Promise.reject(error)
})

// 查询个人信息
export function getUserInfo() {
    this.get("/user/getSysUserInfo").then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        this.imageUrl = userInfo.avatar;
        this.id = userInfo.id;
        formLabelAlign.username = userInfo.name;
        formLabelAlign.mail = userInfo.email;
        formLabelAlign.nickname = userInfo.nickName;
    });
}
// 重写setItem事件，当使用setItem的时候，触发，window.dispatchEvent派发事件
export function dispatchEventStroage() {
    const signSetItem = localStorage.setItem
    localStorage.setItem = function(key, val) {
        let setEvent = new Event('setItemEvent')
        setEvent.key = key
        setEvent.newValue = val
        window.dispatchEvent(setEvent)
        signSetItem.apply(this, arguments)
    }
}

/* 时间格式化 */
export function dateTimeFormat(date) {
    if (date !== '' && date != null) {
        if (typeof date === 'string') {
            return dateFormat(new Date(date), 'yyyy-mm-dd HH:MM:ss')
        } else {
            return dateFormat(date, 'yyyy-mm-dd HH:MM:ss')
        }
    } else {
        return null
    }
}

/* 日期格式化 */
export function formatDate(date) {
    if (date !== '' && date != null) {
        if (typeof date === 'string') {
            return dateFormat(new Date(date), 'yyyy-mm-dd')
        } else {
            return dateFormat(date, 'yyyy-mm-dd')
        }
    } else {
        return null
    }
}
export function Format(d, fmt) {
    if (/^2/.test(d)) {
        return d
    } else {
        var o = {
            'M+': d.getMonth() + 1, // 月份
            'd+': d.getDate(), // 日
            'h+': d.getHours(), // 小时
            'm+': d.getMinutes(), // 分
            's+': d.getSeconds(), // 秒
            'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
            'S': d.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }
}
export function showSuccess() {
    this.$Message({
        message: '成功',
        type: 'success'
    });
}
export function showError(error) {
    this.$message.error(error);
}
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get('/api' + url, {
            params
        }).then(res => {
            if (res.data.code === '200') {
                res.data.success = true
            } else {
                res.data.success = false
            }
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

/* 对象深拷贝 */
export function copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(
            '/api' + url, qs.stringify(params)
        ).then(res => {
            if (res.data.code === '200') {
                res.data.success = true
            } else {
                res.data.success = false
            }
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function uploadFile(url, params) {
    let data = new FormData()
    for (let k in params) {
        data.append(k, params[k])
    }
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(res => {
            if (res.data.code === '000') {
                res.data.success = true
            } else {
                res.data.success = false
            }
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

export function uploadMoreFile(url, params) {
    let data = new FormData()
    for (let k in params) {
        data.append(k, params[k])
    }
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        processData: false,
        contentType: false,
        cache: false
    }
    return new Promise((resolve, reject) => {
        axios.post(url, data, config).then(res => {
            if (res.data.code === '000') {
                res.data.success = true
            } else {
                res.data.success = false
            }
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

// 下载excel文件
export function downloadExcel(url, params, filename) {
    this.$Spin.show()
    axios.get('/api' + url, {
        params: params,
        responseType: 'blob'
    }).then(res => {
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let objurl = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = objurl
        a.download = filename
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(objurl)
        this.$Spin.hide()
    })
}
// 上传文件预览（图片除外）
export function previewing(file, fileName) {
    let url = window.URL.createObjectURL(file)
    let a = document.createElement('a')
    a.download = fileName
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}
// 下载文件
export function downloadFile(url, params, fileName) {
    this.$Spin.show()
    axios.get('/api' + url, {
        params: params,
        responseType: 'blob'
    }).then(r => {
        let url = window.URL.createObjectURL(r.data)
        let a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }).finally(r => {
        this.$Spin.hide()
    })
}
export function downloadUrlPdf(url, params, filename) {
    axios.get('/api' + url, {
        params: params,
        responseType: 'blob'
    }).then(res => {
        let blob = new Blob([res.data], { type: 'application/pdf' })
        let objurl = URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = objurl
        a.download = filename
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
        window.URL.revokeObjectURL(blob)
    })
}

const permissions = { size: 0 }
// 保存系统权限
export function setPermission(menu) {
    storagePermission(menu)
    let t = []
    for (let k in permissions) {
        if (k !== 'size') {
            t.push(k)
        }
    }
    if (t.length > 0) {
        let key = localStorage.getItem(token)
        sessionStorage.setItem(key, t.join(';'))
    }
}
function storagePermission(perm) {
    for (let x of perm) {
        if (x.mType === 'b') {
            permissions[x.perm] = true
            permissions.size++
        }
        if (x.children && x.children.length > 0) {
            setPermission(x.children)
        }
    }
}

// 判断当前用户是否有操作权限
export function hasPerm(perm) {
    if (permissions.size === 0) {
        let tokenStoreKey = localStorage.getItem(token)
        if (sessionStorage.getItem(tokenStoreKey).indexOf(perm) > -1) {
            return true
        } else {
            return false
        }
    } else {
        if (permissions[perm]) {
            return true
        } else {
            return false
        }
    }
}
export default formLabelAlign
