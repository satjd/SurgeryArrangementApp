import request from '@/utils/request'

export function getStaff(params) {
  return request({
    url: '/staff',
    method: 'get',
    params
  })
}
