import request from '@/utils/request'

const api_name = '/system/sysTeacher'

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
    }
}