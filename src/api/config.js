//新的
import {get, post } from '@/axios/request.js'


//1.业务接入分页
export async function businessList(data){
  return new Promise ((resolve,reject)=>{
    get('advertisingList/list',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//2.业务接入新增
export async function businessInsert(data){
  return new Promise ((resolve,reject)=>{
    post('advertisingList/insert',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//3.业务接入修改
export async function businessUpdate(data){
  return new Promise ((resolve,reject)=>{
    post('advertisingList/update',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}


//4.业务接入启用
export async function businessEnable(data){
  return new Promise ((resolve,reject)=>{
    get('advertisingList/enable',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//5.业务接入禁用
export async function businessDisable(data){
  return new Promise ((resolve,reject)=>{
    get('advertisingList/disable',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//6.业务接入详情
export async function businessDetail(data){
  return new Promise ((resolve,reject)=>{
    get('advertisingList/list',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}


//7.业务接入无分页有效列表
export async function businessSearch(data){
  return new Promise ((resolve,reject)=>{
    get('advertisingList/search',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//8.投放周期分页列表
export async function LaunchList(data){
  return new Promise ((resolve,reject)=>{
    get('launchCycle/list',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}
//9.投放周期新增
export async function LaunchInsert(data){
  return new Promise ((resolve,reject)=>{
    post('launchCycle/insert',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}


//10.投放周期保存
export async function LaunchUpdate(data){
  return new Promise ((resolve,reject)=>{
    post('launchCycle/update',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//11.投放周期启用
export async function LaunchEnable(data){
  return new Promise ((resolve,reject)=>{
    get('launchCycle/enable',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//12.投放周期禁用
export async function LaunchDisable(data){
  return new Promise ((resolve,reject)=>{
    get('launchCycle/disable',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//13.投放周期详情
export async function LaunchDetail(data){
  return new Promise ((resolve,reject)=>{
    get('launchCycle/detail',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}






