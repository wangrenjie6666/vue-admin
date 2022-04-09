//新的
import {get, post } from '@/axios/request.js'

//1.用户登录
export async function login(data){
    return new Promise ((resolve,reject)=>{
        post('auth',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject();
        })
    })
}

//22.获取生成验证码所需信息
export async function getVerificationCode(data){
  return new Promise ((resolve,reject)=>{
    get('getVerificationCode',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject();
    })
  })
}


//用户测试
// export async function test(){
//     return new Promise ((resolve,reject)=>{
//         get('test/getUserStatus').then(res=>{
//             resolve(res);
//         }).catch(res=>{
//             reject(res);
//         })
//     })
// }

//2.获取角色成员列表
export async function roleList(data){
    return new Promise ((resolve,reject)=>{
        get('roles/search',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}


//3.角色新增
export async function roleInsert(data){
    return new Promise ((resolve,reject)=>{
        post('roles/insert',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}


//4.角色编辑保存
export async function roleUpdate(data){
    return new Promise ((resolve,reject)=>{
        post('roles/update',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//5.角色删除
export async function roleDelete(data){
    return new Promise ((resolve,reject)=>{
        get('roles/delete',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//6.角色详情
export async function roleDetail(data){
    return new Promise ((resolve,reject)=>{
        post('roles/detail',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//7.角色权限分配保存
export async function roleResources(data){
    return new Promise ((resolve,reject)=>{
        post('roles/saveRoleResources',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//8.用戶列表
export async function userList(data){
    return new Promise ((resolve,reject)=>{
        get('users/search',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//9.用戶新增
export async function userInsert(data){
    return new Promise ((resolve,reject)=>{
        post('users/insert',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//10.用户保存
export async function userUpdate(data){
    return new Promise ((resolve,reject)=>{
        post('users/update',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//11.删除保存
export async function userDelete(data){
    return new Promise ((resolve,reject)=>{
        get('users/delete',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//12.重置密码
export async function userResetPassword(data){
    return new Promise ((resolve,reject)=>{
        get('users/resetPassword',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//12.用户详情
export async function userDetail(data){
    return new Promise ((resolve,reject)=>{
        get('users/detail',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//12.获取所有角色列表
export async function allRoleList(data){
    return new Promise ((resolve,reject)=>{
        get('roles/searchAll',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}


//13.获取整个权限树
export async function ModuleList(data){
    return new Promise ((resolve,reject)=>{
        get('resources/getTreeList',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//13.获取整个菜单
export async function ModuleNodes(data){
    return new Promise ((resolve,reject)=>{
        get('resources/loadMenu',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//14.修改菜单
export async function ModuleEdit(data){
    return new Promise ((resolve,reject)=>{
        post('resources/update',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//15.添加菜单或者按钮
export async function ModuleAdd(data){
    return new Promise ((resolve,reject)=>{
        post('resources/add',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//16.删除菜单
export async function ModuleDelete(data){
    return new Promise ((resolve,reject)=>{
        get('resources/delete',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//17.获取菜单子节点数据
export async function getCheckedKeysData(data){
    return new Promise ((resolve,reject)=>{
        get('resources/getTreeListChild',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            reject(res);
        })
    })
}

//17.角色资源列表
export async function getTreeUserResources(data){
  return new Promise ((resolve,reject)=>{
    get('resources/getTreeUserResources',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//18.退出登录接口
export async function loginout(){
  return new Promise ((resolve,reject)=>{
    get('exit').then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//19.修改密码
export async function updatePassword(data){
  return new Promise ((resolve,reject)=>{
    post('users/updatePassword',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//20.用户详情
export async function usersDetail(data){
  return new Promise ((resolve,reject)=>{
    get('users/detail',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}

//21.操作日志
export async function userLog(data){
  return new Promise ((resolve,reject)=>{
    get('log/list',data).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    })
  })
}










// export async function userFlashCache(data){
//     return new Promise ((resolve,reject)=>{
//         post('oauth',data,res=>{
//             resolve(res);
//         })
//     })
// }

// export async function userExpireToken(data){
//     return new Promise ((resolve,reject)=>{
//         post('oauth',data,res=>{
//             resolve(res);
//         })
//     })
// }
