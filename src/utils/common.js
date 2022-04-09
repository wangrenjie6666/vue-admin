import da from "element-ui/src/locale/lang/da";
// icon 图片
const getIconData=()=>{
    return [
        {icon:'el-icon-bell'},
        {icon:'el-icon-mobile-phone'},
        {icon:'el-icon-service'},
        {icon:'el-icon-view'},
        {icon:'el-icon-menu'},
        {icon:'el-icon-star-on'},
        {icon:'el-icon-star-off'},
        {icon:'el-icon-location'},
        {icon:'el-icon-location-outline'},
        {icon:'el-icon-phone'},
        {icon:'el-icon-edit-outline'},
        {icon:'el-icon-rank'},
        {icon:'el-icon-refresh'},
        {icon:'el-icon-setting'},
        {icon:'el-icon-upload'},
        {icon:'el-icon-download'},
    ]
}

//获取当前月的天数
const getMonthDays=(year,month)=>{
      let d = new Date(year,month,0);
      return d.getDate();
}
//获取当前年月
const getYearMonth=()=>{
  var myDate = new Date();
  var tYear = myDate.getFullYear();

  var tMonth = myDate.getMonth();
  var m = tMonth + 1;
  if (m.toString().length == 1) {
    m = "0" + m;
  }
  return tYear +'-'+ m;
}
//获取当前年季
const getYearQuarter=()=>{
  let myDate = new Date();
  let tYear = myDate.getFullYear();
  let tMonth = myDate.getMonth();
  let quarter = ((tMonth+1)/3);
  return tYear +''+ Math.ceil(quarter);
}
//获取每年季度的天数
const getQuarterDays=((year,quarter)=>{
  let allCount=0;
  for(let i=(quarter*3)-2;i<=(quarter*3);i++){
    allCount+=parseInt(getMonthDays(year,i))
  }
  return allCount;
})
//排除非占用季度的数据
const noEmployQuarterData=(year,key,list)=>{
  let days=0,ymd='',str='';
  let quarterList=[];
  let ymdnow=getYearMonthDay();
  for(let i=(key*3)-2;i<=key*3;i++){
     days=getMonthDays(year,i)
    for(let j=1;j<=days;j++){
      str=year;
      str+=i<10?'-0'+i:'-'+i;
      str+=j<10?'-0'+j:'-'+j;
      if(ymdnow <= dateSizeJudge(year,i,j)){
        quarterList.push(str);
      }
    }
  }

  for(let i=0;i<quarterList.length;i++){
    list.forEach((item,index)=>{
      if(item==quarterList[i]){
        quarterList.splice(i,1)
      }
    })
  }
  return quarterList;
}
//排除非占用月份的数据
const noEmployMonthData=(year,key,list)=>{
  let days=0,str='';
  let MonthList=[];
  let ymdnow=getYearMonthDay();
    days=getMonthDays(year,key)
    for(let j=1;j<=days;j++){
      str=year;
      str+='-'+key;
      str+=j<10?'-0'+j:'-'+j;
      if(ymdnow <= dateSizeJudge(year,key,j)){
        MonthList.push(str);
      }
    }
  for(let i=0;i<MonthList.length;i++){
    list.forEach((item,index)=>{
      if(item==MonthList[i]){
        MonthList.splice(i,1)
      }
    })
  }
  return MonthList;
}
//获取当前年月日
const getYearMonthDay=(type=1)=>{
  var myDate = new Date();
  var tYear = myDate.getFullYear();
  var tMonth = myDate.getMonth();
  var m = tMonth + 1;
  if (m.toString().length == 1) {
    m = "0" + m;
  }
  var day=parseInt(myDate .getDate());
  if(day<10){
    day='0' + day
  }
  if(type==1){
    return parseInt(tYear+'' + m+'' + day);
  }else{
    return tYear+'-'+m+'-'+day
  }

}
//处理投放周期数据
const cycleDataHandle=(data,type,days='',date)=>{
    if(data == null){
      data=[];
    }
    switch (type){
      case 1 :
       return  detailDayData(data,days,date)
      case 2:
       return  detailMonthData(data,date);
      case 3:
      return  detailQuarterData(data,date);

    }
}
//处理周期月份数据
const detailMonthData=(data,date)=>{
  let list=data.map((item,index)=>{
    item=item.split('-')[1];
    return item;
  })
  let ymarr=getYearMonth().split('-')
  let ymnow=parseInt(ymarr[0]+ymarr[1]);
  let yeardata=[];
  for(let i=1;i<=12;i++){
    let d=i;
    if(d<10){
      d='0'+d;
    }else{
      d+=''
    }
    yeardata.push({});
    yeardata[i-1].list=[];
    yeardata[i-1].type=1;
    yeardata[i-1].key=d;
    list.forEach((item,index)=>{
      if(item==d){
        yeardata[i-1].list.push(data[index]);
      }
    })
    if(parseInt(date + d)  < parseInt(ymnow)){
      yeardata[i-1].type=4;
    }else{
      let lengths = getMonthEmployAndInvalidDays(yeardata[i-1].list,date,yeardata[i-1].key);
      if(lengths===false){
        yeardata[i-1].type=4;
      }else if(lengths===0){
        yeardata[i-1].type=2;
      }
      yeardata[i-1].lengthday=lengths;
    }
  }
  // //判断个数
  // yeardata.forEach((item,index)=>{
  //   let lengths = getMonthEmployAndInvalidDays(item.list,date,item.key);
  //   let days=getMonthDays(date,index+1)
  //   if(lengths == days){
  //     item.type=2;
  //   }
  // })
  return yeardata;
}
//处理周期季节数据
const detailQuarterData=(data,date)=>{
  let quarterData=[];
  let quarternow=getYearQuarter();
  console.log(quarternow)
  let list=data.map((item,index)=>{
    item=parseInt(item.split('-')[1]);
    return item;
  })
  for (let i=1;i<=4;i++){
    quarterData.push({});
    quarterData[i-1].list=[];
    quarterData[i-1].type=1;
    quarterData[i-1].key=i;
    list.forEach((item,index)=>{
      if(item>=(i*3)-2 && item<=i*3){
        quarterData[i-1].list.push(data[index])
      }
    })
    if(parseInt(date + i)  < quarternow){
      quarterData[i-1].type=4;
    }else{
      let lengths = getQuarterEmployAndInvalidDays(quarterData[i-1].list,date,quarterData[i-1].key);
      if(lengths===false){
        quarterData[i-1].type=4;
      }else if(lengths===0){
        quarterData[i-1].type=2;
      }
      quarterData[i-1].lengthday=lengths;
    }
  }
  // quarterData.forEach((item,index)=>{
  //   let lengths = item.list.length;
  //   let allQuarterDays=getQuarterDays(date,index+1)
  //   if(lengths == allQuarterDays){
  //     item.type=2;
  //   }
  // })
  return quarterData;
}
//处理周期天数数据
const detailDayData=(data,days,date)=>{
  let daysarr = [];
  let ymdnow=getYearMonthDay();
  for (let i = 0; i < days; i++) {
    daysarr.push({day: i + 1, type: 1})
    let d=parseInt(i+1);
    if(d<10){
      d='0'+d;
    }

    let ymarr=date.split('-');
    let ymd=parseInt(ymarr[0]+ymarr[1]+d);
    if(ymdnow>ymd ){
      daysarr[i].type = 4;
    }
    if (data) {
      data.forEach(item1 =>{
        let item1arr=item1.split('-')
        if (parseInt(item1arr[2]) == i + 1){
          daysarr[i].type = 2;
        }
      })
    }
  }
  return daysarr;
}
//周期当前与往后月份占用与失效的天数
const getMonthEmployAndInvalidDays=(list,year,month)=>{
  let ymdnow=getYearMonthDay(2);
  let ymdnowarr=ymdnow.split('-');
  let ynow=parseInt(ymdnowarr[0]),mnow=parseInt(ymdnowarr[1]),dnow=parseInt(ymdnowarr[2]);
  let yearMonthDays=getMonthDays(year,month);
  let lengths=0;
    year=parseInt(year);
    month=parseInt(month);
    if(dateSizeJudge(year,month) < dateSizeJudge(ynow,mnow)){
      return false;
    }else if(dateSizeJudge(year,month)==dateSizeJudge(ynow,mnow)){
      lengths=yearMonthDays-dnow+1;
      for (let i=dnow;i<=yearMonthDays;i++){
        list.forEach((item,index)=>{
          let arr=item.split('-');
          if(dateSizeJudge(year,month,i)==arr[0]+arr[1]+arr[2]){
            lengths--;
          }
        })
      }
      return lengths
    }else{
      lengths=yearMonthDays;
      for (let i=1;i<=yearMonthDays;i++){
        list.forEach((item,index)=>{
          let arr=item.split('-');
          if(dateSizeJudge(year,month,i)==arr[0]+arr[1]+arr[2]){
            lengths--;
          }
        })
      }
      return lengths;
    }
}
//年月日数字大小比较精准转换
function dateSizeJudge(year,month,day=''){
  year=parseInt(year);
  month=parseInt(month);
  if(day !=''){
    day=parseInt(day)
    day=day<10?'0'+day:''+day;
  }
  month=month<10?'0'+month:''+month;
  return year+month+day;
}
//周期当前与往后季节占用与失效的天数
const getQuarterEmployAndInvalidDays=(list,year,quarter)=>{
  let quaterLength=0;
  let monthLength=0;
  let isJudgeInvalid=0;
  for (let i=(quarter*3)-2;i<=quarter*3;i++){
    monthLength=getMonthEmployAndInvalidDays(list,year,i);
    if(monthLength!==false){
      quaterLength+=monthLength
    }else{
      isJudgeInvalid++
    }
  }
  if(isJudgeInvalid==3){
    return  false
  }
  return quaterLength;
}

export {
    getIconData,
    getYearMonthDay,
    getMonthDays,
    getYearMonth,
    cycleDataHandle,
    getQuarterDays,
    noEmployQuarterData,
    noEmployMonthData
}
