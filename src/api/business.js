import {get, post } from '@/axios/request.js'

//1.业务平台列表查询,多条件查询
export async function businessPlatformList(data){
    return new Promise ((resolve,reject)=>{
      get('businessPlatform/getList',data).then(res=>{
        resolve(res);
      }).catch(res=>{
        reject(res);
      })
    })
  }

//2.增加业务平台的接口
export async function businessPlatformAdd(data){
    return new Promise ((resolve,reject)=>{
      post('businessPlatform/add',data).then(res=>{
        resolve(res);
      }).catch(res=>{
        reject(res);
      })
    })
  }

//3.增加业务平台的接口
export async function businessPlatformUpdate(data){
    return new Promise ((resolve,reject)=>{
      post('businessPlatform/updateById',data).then(res=>{
        resolve(res);
      }).catch(res=>{
        reject(res);
      })
    })
}

//4.业务平台列表
export async function businessPageList(data){
    return new Promise ((resolve,reject)=>{
      get('/bpdList/getList',data).then(res=>{
        resolve(res);
      }).catch(res=>{
        reject(res);
      })
    })
  }

 //5.删除业务平台
export async function businessPlatformDelete(data){
  return new Promise ((resolve,reject)=>{
    get('/businessPlatform/deleteById',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

 //6.删除业务平台详情实体(删除广告位)
 export async function businessPageDelete(data){
  return new Promise ((resolve,reject)=>{
    get('/bpdList/deleteById',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

 //7.状态开关（禁用启用按钮状态开关）
 export async function businessPageUpdateState(data){
  return new Promise ((resolve,reject)=>{
    get('/bpdList/updateStatusById',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//8.获取所有业务平台列表数据
export async function getAllAdSpaceByRpc(data){
  return new Promise ((resolve,reject)=>{
    get('/adScheduling/getAllAdSpaceByRpc',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
}

//9.获取业务以及所在页面
export async function BusinessAndPageList(data){
  return new Promise ((resolve,reject)=>{
    get('/adScheduling/getAllSearchCriteriaOfBusiness',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
}

//10.頁面列表启用禁用
export async function BusinessDisableAndEnable(data){
  return new Promise ((resolve,reject)=>{
    get('/businessPlatform/disableAndEnable',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
} 


//11.根据业务编码查询广告位的信息
export async function selectGgwByBusiness(data){
  return new Promise ((resolve,reject)=>{
    get('/adSpaceManager/selectGgwByBusiness',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
} 

//12.禁用或启用广告位
export async function pageDisableAndEnable(data){
  return new Promise ((resolve,reject)=>{
    get('/adSpaceManager/disableAndEnable',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
}

//13.删除广告位
export async function pageListDelete(data){
  return new Promise ((resolve,reject)=>{
    get('/adSpaceManager/deleteAdSpace',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
} 

//14.搜索查询（业务平台）页面列表
export async function getAdPageList(data){
  return new Promise ((resolve,reject)=>{
    get('/advertisingPage/getAdPageList',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
} 



//15.删除（指定平台下的）广告页面 
export async function deleteAdPageById(data){
  return new Promise ((resolve,reject)=>{
    get('/advertisingPage/deleteAdPage',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
} 

//16.修改广告页面状态
export async function updateAdPageStatus(data){
  return new Promise ((resolve,reject)=>{
    post('/advertisingPage/updateAdPageStatus',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })  
} 
