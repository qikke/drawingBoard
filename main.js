
//初始化canvas
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

//初始化画笔状态
var penActive = false
//初始化画笔类型
var penType = {
  pen: { state: true, color: 'red', width: 6 },
  eraser: { state: false, color: 'white', width: 15 },
  penColor: ["red", "blue", "yellow", "black", "green"]
}

//初始化起点
var start = { x: undefined, y: undefined }

//获取节点
var eraser = document.getElementById('eraser')
var pen = document.getElementById('pen')
var red = document.getElementById("red")
var blue = document.getElementById("blue")
var yellow = document.getElementById("yellow")
var download = document.getElementById("download")

//自适应画板大小
resizeCanvas()

//监听事件
listenToMouse()

//创建颜色盘
createColor()

//绑定事件
function listenToMouse() {
  window.onresize = function () {
    resizeCanvas()
  }
  if (document.body.ontouchstart !== undefined) {
    canvas.ontouchstart = function () {
      //改变画笔状态
      penActive = true
      //改变起点状态
      start['x'] = event.x
      start['y'] = event.y
    }
    canvas.ontouchmove = function (event) {
      //如果画笔状态为true
      if (penActive) {
        var end = { x: event['targetTouches'][0].clientX, y: event['targetTouches'][0].clientY }
        if (penType['pen']['state']) {
          //画一条线
          drawLine(start, end, penType['pen']['color'], penType['pen']['width'])
        } else if (penType['eraser']['state']) {
          //擦一条线
          drawLine(start, end, penType['eraser']['color'], penType['eraser']['width'])
        }
        start = end
      }
    }
    canvas.ontouchend = function () {
      penActive = false
    }
  } else {
    document.onmousedown = function (event) {
      //改变画笔状态
      penActive = true
      //改变起点状态
      start['x'] = event.x
      start['y'] = event.y
    }
    document.onmousemove = function (event) {
      //如果画笔状态为true
      if (penActive) {
        var end = { x: event.x, y: event.y }
        if (penType['pen']['state']) {
          //画一条线
          drawLine(start, end, penType['pen']['color'], penType['pen']['width'])
        } else if (penType['eraser']['state']) {
          //擦一条线
          drawLine(start, end, penType['eraser']['color'], penType['eraser']['width'])
        }
        start = end
      }
    }
    document.onmouseup = function (event) {
      penActive = false
    }
  }
  eraser.onclick = function () {
    penType['eraser']['state'] ? changeState('pen') : changeState('eraser')
    pen.classList.remove("active")
    eraser.classList.add("active")
  }
  pen.onclick = function () {
    changeState('pen')
    eraser.classList.remove("active")
    pen.classList.add("active")
  }
  clear.onclick = function () {
    clearCanvas()
    changeState('pen')
    eraser.classList.remove("active")
    pen.classList.add("active")
  }
  download.onclick = function(){
    var url = canvas.toDataURL("image/png")
    var a = document.createElement("a")
    document.body.appendChild(a)
    a.href = url
    a.download = "我的画"
    a.target = '_blank'
    a.click()
  }
}

//根据起点和终点画一条线
function drawLine(start, end, color, width) {
  context.strokeStyle = color
  context.lineWidth = width
  context.beginPath()
  context.moveTo(start['x'], start['y'])
  context.lineTo(end['x'], end['y'])
  context.stroke()
}

//改变画笔状态
function changeState(type) {
  for (var i in penType) {
    if (i == type) {
      penType[i]['state'] = true
    } else {
      penType[i]['state'] = false
    }
  }
}

//画板宽高自适应
function resizeCanvas() {
  var pageWidth = document.documentElement.clientWidth
  var pageHeight = document.documentElement.clientHeight
  canvas.width = pageWidth
  canvas.height = pageHeight
}

//清空画布
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

//自动生成颜色盘
function createColor() {
  for (var i = 0, arr = penType['penColor']; i < arr.length; i++) {
    var li = document.createElement("li")
    i == 0 && li.classList.add("active")
    li.id = arr[i]
    li.index = i
    li.style.background = arr[i]
    li.onclick = function () {
      penType['pen']['color'] = arr[this.index]
      changeColorActive(this.index)
    }
    color.appendChild(li)
  }
}

//修改颜色盘的active样式
function changeColorActive(index) {
  var lis = document.getElementById("color").getElementsByTagName("li")
  for (var i = 0, arr = penType['penColor']; i < arr.length; i++) {
    lis[i].className = ""
  }
  lis[index].className = "active"
}