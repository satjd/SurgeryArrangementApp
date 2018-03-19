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

// sync month arrangement with server
export function syncMonthList(params, data) {
  return request({
    url: '/list/month',
    method: 'post',
    params,
    data
  })
}

// Update month arrangements
export function updateMonthList(params, data) {
  return request({
    url: '/list/month',
    method: 'put',
    params,
    data
  })
}

// Delete a month arrangement
export function deleteMonthArrangement(params, data) {
  return request({
    url: '/list/month',
    method: 'delete',
    params,
    data
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

// sync week arrangement with server
export function syncWeekList(params, data) {
  return request({
    url: '/list/week',
    method: 'post',
    params,
    data
  })
}

// Update week arrangements
export function updateWeekList(params, data) {
  return request({
    url: '/list/week',
    method: 'put',
    params,
    data
  })
}

// Delete a week arrangement
export function deleteWeekArrangement(params, data) {
  return request({
    url: '/list/week',
    method: 'delete',
    params,
    data
  })
}

// Get surgery arrangements
export function getSurgeryList(params) {
  return request({
    url: '/list/surgery',
    method: 'get',
    params
  })
}

// sync surgery arrangement
export function syncSurgeryList(params, data) {
  return request({
    url: '/list/surgery',
    method: 'post',
    params,
    data
  })
}

// Update surgery arrangement
export function updateSurgeryList(params, data) {
  return request({
    url: '/list/surgery',
    method: 'put',
    params,
    data
  })
}

// Delete a surgery arrangement
export function deleteSurgery(params, data) {
  return request({
    url: '/list/surgery',
    method: 'delete',
    params,
    data
  })
}
