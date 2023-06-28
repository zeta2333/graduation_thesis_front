/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/system/sysGrade'

export default {

    // 获取所有角色
    findAll() {
        return request({
            url: `${api_name}/findAll`,
            method: 'get'
        })
    },
}