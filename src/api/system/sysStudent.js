import request from '@/utils/request'

const api_name = '/system/sysStudent'

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

    updateById(student) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: student
        })
    },
    updateAssessGrade(id,grade) {
        return request({
            url: `${api_name}/assessGrade/${id}/${grade}`,
            method: 'post',
        })
    },
    removeById(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'delete'
        })
    },
    upload(data,headers) {
        return request({
            url: `${api_name}/uploadPaper`,
            method: 'post',
            headers: headers,
            data: data
        })
    },
    listByTeacherUserId(userId) {
        return request({
            url: `${api_name}/listByTeacherUserId/${userId}`,
            method: 'get'
        })
    },
    selectProject(userId,projectId) {
        return request({
            url: `${api_name}/selectProject/${userId}/${projectId}`,
            method: 'post',
        })
    }
}