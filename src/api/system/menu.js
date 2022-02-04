import axios from 'axios'

/**
   * 查询菜单树
   *
   * @returns Promise
   */
export function queryMenuTree () {
  return new Promise((resolve, reject) => {
    axios.get('/system/menus/')
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 添加菜单
 * @param {Object} addMenuForm 菜单项
 * @returns 菜单ID
 */
export function addMenu (addMenuForm) {
  return new Promise((resolve, reject) => {
    axios.post('/system/menu/', addMenuForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 编辑菜单
 * @param {Object} editMenuForm 菜单项
 * @param {Integer} menuId 菜单ID
 * @returns Promise
 */
export function editMenu (editMenuForm) {
  return new Promise((resolve, reject) => {
    axios.put('/system/menu/' + editMenuForm.id, editMenuForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 拖动菜单
 * @param {Object} editMenuForm 菜单项
 * @param {Integer} menuId 菜单ID
 * @returns Promise
 */
export function dragMenu (editMenuForm) {
  return new Promise((resolve, reject) => {
    axios.put('/system/menu/' + editMenuForm.id, editMenuForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 删除菜单
 * @param {Integer} menuId 菜单ID
 * @returns Promise
 */
export function deleteMenuById (menuId) {
  return new Promise((resolve, reject) => {
    axios.delete('/system/menu/' + menuId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 查询菜单详情
 * @param {Integer} menuId 菜单ID
 * @returns Promise
 */
export function queryMenuById (menuId) {
  return new Promise((resolve, reject) => {
    axios.get('/system/menu/' + menuId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
