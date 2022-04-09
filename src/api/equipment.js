//新的
import {get, post } from '@/axios/request.js'

//1.获取设备列表
export async function equipmentList(data){
  return new Promise ((resolve,reject)=>{
    get('equipment/list',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//2.用于测试给设备发送信息
export async function sendMessage(data){
  return new Promise ((resolve,reject)=>{
    get('equipment/list',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}


//3.修改广告
export async function advertUpdate(data){
  return new Promise ((resolve,reject)=>{
    get('guanggao/updateCopy',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//4.广告投放设备列表
export async function advertEquipList(data){
  return new Promise ((resolve,reject)=>{
    get('advertisingList/equPutList',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}
//6.为一个设备某一天的排期
export async function equSchedule(data){
  return new Promise ((resolve,reject)=>{
    post('equSchedule/addOne',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//7.为一个设备某一天的排期
export async function equScheduleOne(data){
  return new Promise ((resolve,reject)=>{
    post('equSchedule/addOne',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}
//8.为一个设备某一天的排期
export async function equScheduleList(data){
  return new Promise ((resolve,reject)=>{
    post('equSchedule/addList',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//9.查询广告完善信息
export async function SearchAdvertDetail(data){
  return new Promise ((resolve,reject)=>{
    post('equSchedule/getOne',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//10.查询某设备的某广告在某一年月使用情况
export async function eqAdUse(data){
  return new Promise ((resolve,reject)=>{
    get('equSchedule/list',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}
//11.投放确认
export async function putConfirm(data){
  return new Promise ((resolve,reject)=>{
    get('equSchedule/putConfirm',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//12.设备对应的广告列表
export async function selectEquAdvertisingList(data){
  return new Promise ((resolve,reject)=>{
      get('equSchedule/selectEquAdvertisingList',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}
//13.获取区域树
export async function areaTreeList(data){
  return new Promise ((resolve,reject)=>{
    get('area/getTreeList',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}
//13.根据 期间段 和 设备ID集合 获取设备已占用的日期
export async function getTimeAndEquIds(data){
  return new Promise ((resolve,reject)=>{
    get('equSchedule/getTimeAndEquIdList',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//14.新投放保存
export async function insertLaunch(data){
  return new Promise ((resolve,reject)=>{
    post('guanggao/insertLaunch',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//15.设备广告管理--投放管理
export async function selectEquAdManagerList(data){
  return new Promise ((resolve,reject)=>{
    get('equipment/selectEquAdManagerList',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}
//16.设备广告管理--投放管理-删除
export async function advertisingListDelete(data){
  return new Promise ((resolve,reject)=>{
    post('advertisingList/updateById',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}

//17.设备广告管理--立即下发(投放广告指令)
export async function sentCommand(data){
  return new Promise ((resolve,reject)=>{
    get('guanggao/sentCommand',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}



