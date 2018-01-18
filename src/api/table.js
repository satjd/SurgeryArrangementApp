import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

// Get month arrangements
export function getMonthList(params) {
  return request({
    url: '/list/month',
    method: 'get',
    params
  })
}

// Get week arrangements
export function getWeekList(params) {
  return request({
    url: '/list/week',
    method: 'get',
    params
  })
}
