import { get, post } from '@/axios/request.js'
import da from "element-ui/src/locale/lang/da";

//1.投放广告_上传广告
export async function advertUpload(data) {
  return new Promise((resolve, reject) => {
    post('guanggao/upload', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//2.广告库_上传广告
export async function advertUpload2(data) {
  return new Promise((resolve, reject) => {
    post('guanggao/upload2', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//3.投放广告记录列表
export async function advertList(data) {
  return new Promise((resolve, reject) => {
    get('advertisingList/recordList', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}


//4.广告库列表
export async function advertList2(data) {
  return new Promise((resolve, reject) => {
    get('advertising/copy/list', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//5.新增广告实体 http://localhost:9466/guanggao/insert
export async function advertInsert(data) {
  return new Promise((resolve, reject) => {
    post('guanggao/insert', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}
//6.广告设备列表(无分页)
export async function advertDetail(data) {
  return new Promise((resolve, reject) => {
    get('advertisingList/selectById', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}
//7.广告库修改保存
export async function advertSave(data) {
  return new Promise((resolve, reject) => {
    post('advertising/copy/update', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//8.广告库新增保存
export async function advertInsert1(data) {
  return new Promise((resolve, reject) => {
    post('advertising/copy/insert', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//9.广告库删除
export async function advertDelete(data) {
  return new Promise((resolve, reject) => {
    get('advertising/copy/delete', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//10.获取设备(已经投放广告)列表
export async function getEquList(data) {
  return new Promise((resolve, reject) => {
    get('equipment/getEquList', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//11.默认广告管理-列表查询
export async function adDefaulitLst(data) {
  return new Promise((resolve, reject) => {
    get('adDefault/list', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//12.默认广告管理-增加
export async function adDefaulitAdd(data) {
  return new Promise((resolve, reject) => {
    post('adDefault/add', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//13.默认广告管理-修改
export async function adDefaulitUpdate(data) {
  return new Promise((resolve, reject) => {
    post('adDefault/update', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//14.默认广告管理-删除
export async function adDefaulitDelete(data) {
  return new Promise((resolve, reject) => {
    get('adDefault/deleteById', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}
//15.广告记录删除(包括设备)-状态更改
export async function advertUpdate(data) {
  return new Promise((resolve, reject) => {
    get('guanggao/updateById', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject();
    })
  })
}

//16.软件_查询排期列表
export async function getAllAdSpaceByRpc(data) {
  return new Promise((resolve, reject) => {
    get('/adScheduling/getAllAdSpaceByRpc', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//17.软件_查询排期列表
export async function adSchedulingList(data) {
  return new Promise((resolve, reject) => {
    get('/adScheduling/getList', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//18.新增软件广告
export async function adSchedulingAddSad(data) {
  return new Promise((resolve, reject) => {
    post('/adScheduling/addSad', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//19.查看排期列表
export async function adSchedulingTimeList(data) {
  return new Promise((resolve, reject) => {
    get('/adScheduling/selectByDate', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//20.查看排期列表
export async function adSchedulingDisable(data) {
  return new Promise((resolve, reject) => {
    get('adScheduling/deleteById', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//21.查看广告详情
export async function adSchedulingSelectByNo(data) {
  return new Promise((resolve, reject) => {
    get('/adScheduling/selectByNo', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}
//22.查看广告详情
export async function advertChartData(data) {
  return new Promise((resolve, reject) => {
    get('adScheduling/selectDetailByNo', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//23.广告禁用或启用
export async function advertChangeStatus(data) {
  return new Promise((resolve, reject) => {
    get('adScheduling/disableAndEnableOfId', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//24.广告编辑
export async function adSchedulingUpdateSad(data) {
  return new Promise((resolve, reject) => {
    post('/adScheduling/updateSad', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//25.获取标签列表
export async function getLabelList(data) {
  return new Promise((resolve, reject) => {
    get('label/searchLabel', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}
//26.添加（新增）标签
export async function addLabel(data) {
  return new Promise((resolve, reject) => {
    post('label/addLabel', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//27.编辑标签
export async function editLabel(data) {
  return new Promise((resolve, reject) => {
    post('label/editLabel', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//28.删除标签
export async function delLabel(data) {
  return new Promise((resolve, reject) => {
    get('label/delLabel', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//29.查询广告库数据
export async function searchAdLibrary(data) {
  return new Promise((resolve, reject) => {
    get('adLibrary/searchAdLibrary', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}
//30.新增广告库广告
export async function addAdLibraryAd(data) {
  return new Promise((resolve, reject) => {
    post('adLibrary/addAdLibraryAd', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}
//31.编辑广告库广告
export async function editLibraryAd(data) {
  return new Promise((resolve, reject) => {
    post('adLibrary/updateAdLibraryAd', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//32.删除广告库广告
export async function deleteAdLibraryAd(data) {
  return new Promise((resolve, reject) => {
    get('adLibrary/deleteAdLibraryAd', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//33.批量设置广告标签
export async function editAdLabel(data) {
  return new Promise((resolve, reject) => {
    post('adLibrary/editAdLabel', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}


//34.删除广告标签
export async function delAdLabel(data) {
  return new Promise((resolve, reject) => {
    get('adLibrary/delAdLabel', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//35.获取区域树
export async function sprAreaList(data) {
  return new Promise((resolve, reject) => {
    get('sprArea/list2', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//36.新增轮播图广告
export async function addRotationChartAd(data) {
  return new Promise((resolve, reject) => {
    post('adScheduling/addRotationChartAd', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}
//37.编辑轮播图广告
export async function editRotationChartAd(data) {
  return new Promise((resolve, reject) => {
    post('adScheduling/editRotationChartAd', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}

//38.编辑轮播图广告
export async function getAdScheduleList(data) {
  return new Promise((resolve, reject) => {
    get('adExtension/getAdScheduleList', data).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    })
  })
}