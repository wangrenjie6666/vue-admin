import { get, post } from '@/axios/request.js'

/**
 * 
 * @param {*} data 
 * @returns
 * 
 */
//1.模板查询列表
export async function adTemplateList(data) {
  return new Promise((resolve, reject) => {
    get('ad/template/list', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//2.广告模板新增
export async function adTemplateAdd(data) {
  return new Promise((resolve, reject) => {
    post('ad/template/add', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}
//3.广告模板修改
export async function adTemplateUpdate(data) {
  return new Promise((resolve, reject) => {
    post('ad/template/update', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//4.删除模板和规格,传递id集合
export async function adTemplateDeleteByIds(data) {
  return new Promise((resolve, reject) => {
    post('ad/template/deleteByIds', data.ids).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//5.模板禁用启用
export async function adTemplateDisabled(data) {
  return new Promise((resolve, reject) => {
    get('ad/template/disableAndEnableOfId', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//6.推广-新增广告（第一步）
export async function adExtensionAddSad(data) {
  return new Promise((resolve, reject) => {
    post('adExtension/addSad', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//7.获取（推广）广告列表
export async function adExtensionGetList(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/getList', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//8.查询（推广广告）此时段排期
export async function getAdScheduleList(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/getAdScheduleList', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//9.修改（编辑）广告
export async function adExtensionUpdate(data) {
  return new Promise((resolve, reject) => {
    post('adExtension/updateSad', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//10.获取版位列表（默认获取所有）
export async function getAdPositionList(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/getAdPositionList', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//11.通过主键id（删除广告）
export async function adExtensionDelete(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/deleteById', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//12.通过主键id（删除广告）
export async function adExtensionDisabled(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/updateSadStatus', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//13.获取广告创意列表
export async function getAdOriginalityList(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/getAdOriginalityList', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//14.新增广告创意
export async function addAdOriginality(data) {
  return new Promise((resolve, reject) => {
    post('adExtension/addAdOriginality', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//15.修改（编辑）创意
export async function updateAdOriginality(data) {
  return new Promise((resolve, reject) => {
    post('adExtension/updateAdOriginality', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//16.删除创意
export async function deleteOriginalityById(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/deleteOriginalityById', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//17.启用/禁用 广告创意
export async function updateAdOriginalityStatus(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/updateAdOriginalityStatus', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//17.启用/禁用 广告创意
export async function getAllAdData(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/getAllAdData', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}