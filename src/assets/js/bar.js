export default function getData(data) {
  let xData = [], yData = []
  for(let item of data||[]){
    xData.push(item[0])
    yData.push(item[4])
  }
  return {
    animation:false,
    width:220,
    height:66,
    grid:{
      width:220,
      height:66,
      left:0,
      right:0,
      bottom:0
    },
    xAxis: [{
      show:false,
      type: 'category',
      boundaryGap: false,
      data: xData
    }],
    yAxis: [{
      show:false,
      min:'dataMin'
    }],
    series: [{
      name: 'lastPrice',
      type: 'line',
      smooth:true,
      color:['#315ac3'],
      symbol: "none",
      lineStyle:1,
      itemStyle: {normal: {areaStyle: {type: 'default', opacity:0.2}}},
      data: yData
    }]
  }
}