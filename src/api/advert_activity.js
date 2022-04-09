import { get, post } from '@/axios/request.js'

//1. 列表查询,移动端也可以用这个接口,但是电话号码要传递完整
export async function advertActivityList(data) {
    return new Promise((resolve, reject) => {
        get('clb/record/list', data).then(res => {
            resolve(res);
        }).catch(res => {
            reject(res);
        })
    })
}

//2. 添加记录
export async function advertActivityVerify(data) {
    return new Promise((resolve, reject) => {
        post('clb/record/updateById', data).then(res => {
            resolve(res);
        }).catch(res => {
            reject(res);
        })
    })
}
