import request from '@/utils/request'

const api_name = '/system/sysProject'

export default {

    getPageList(current, size, searchObj) {
        return request({
            url: `${api_name}/${current}/${size}`,
            method: 'get',
            params: searchObj // url查询字符串或表单键值对
        })
    },
    getById(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method: 'get'
        })
    },
    getByUserId(userId) {
        return request({
            url: `${api_name}/getByUserId/${userId}`,
            method: 'get'
        })
    },

    save(user) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: user
        })
    },

    updateById(user) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: user
        })
    },
    removeById(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'delete'
        })
    },
}