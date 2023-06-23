/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/system/sysRole'

export default {

    // 获取所有角色
    findAll() {
        return request({
            url: `${api_name}/findAll`,
            method: 'get'
        })
    },

    /*
    获取角色分页列表(带搜索)
    */
    getPageList(current, size, searchObj) {
        return request({
            url: `${api_name}/${current}/${size}`,
            method: 'get',
            params: searchObj
        })
    },
    // 根据id删除
    removeById(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'delete'
        })
    },
    // 添加
    save(role) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: role
        })
    },
    // 根据id获取
    getById(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method: 'get'
        })
    },
    // 根据id更新
    updateById(role) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: role
        })
    },
    // 批量删除
    batchRemove(idList) {
        return request({
            url: `${api_name}/batchRemove`,
            method: `delete`,
            data: idList
        })
    },
}