
function getAngle(x1, y1, x2, y2) {
    // 直角的边长
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    // 斜边长
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    // 余弦
    // var cos = y / z;
    var cos = x / z;
    // 弧度
    var radina = Math.acos(cos);
    // 角度
    // var angle =  180 / (Math.PI / radina);
    return radina;
}

/**
 * 
 * @param  
 * startPoint       起点坐标 {x, y}
 * endPoint         终点坐标 {x, y}
 * endPoint1        曲线中点 {x, y}
 * delay            延时n毫秒才开始绘制
 * arriveTargetCb   回调
 */
function generatePath({startPoint, endPoint, point, delay = 0 ,arriveTargetCb }) {
    let path = {};
    let isArriveTarget, translate, angle,ratio, direction;
    path.startPoint = startPoint;
    path.endPoint = endPoint;
    path.point = point;
    path.delay = delay;
    path.arriveTargetCb = arriveTargetCb;

    // 如果x/y起始点与结束点相等，那么只判断x/y就能知道是否到达终点
    if (startPoint.x != endPoint.x && startPoint.y == endPoint.y) {
        //水平右向移动
        if(endPoint.x >= startPoint.x) {
            isArriveTarget =  (function (currentX, currentY) {
              return currentX >= this.endPoint.x;
          }).bind(path)
          angle = 0;
          ratio = 0;
          direction = 'right';
          translate = function (currentX, currentY, speed) {
            return {x: currentX + speed, y: currentY};
        }
        } else {
            //水平左向移动
            isArriveTarget = ( function (currentX, currentY) {
              return currentX < this.endPoint.x;
          }).bind(path)
          angle = Math.PI;
          ratio = 0;
          direction = 'left';
          translate = function (currentX, currentY, speed) {
            return {x: currentX - speed, y: currentY};
        }
        }
        
    } else if (startPoint.y != endPoint.y && startPoint.x == endPoint.x) {
        //垂直向下运动
        if(endPoint.y > startPoint.y) {
            isArriveTarget =  (function (currentX, currentY) {
              return currentY >= this.endPoint.y;
            }).bind(path)
            angle = Math.PI/2;
            ratio = 0;
            direction = 'down'
            translate = function (currentX, currentY, speed) {
                return {x: currentX , y: currentY + speed};
            }
        } else {
        //垂直向上运动
            isArriveTarget = ( function (currentX, currentY) {
              return currentY < this.endPoint.y;
          }).bind(path)
          angle = 3 * Math.PI/2;
          ratio = 0;
          direction = 'up'
          translate = function (currentX, currentY, speed) {
            return {x: currentX , y: currentY - speed};
          }
        }
        
    } else if (startPoint.y != endPoint.y && startPoint.x != endPoint.x){
        
        ratio = (endPoint.y- startPoint.y)/(endPoint.x - startPoint.x);
        angle = getAngle(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        //右上方
        if(endPoint.x > startPoint.x && endPoint.y < startPoint.y) {
          direction = 'right-up';
          isArriveTarget =  (function (currentX, currentY) {
              return currentX >= this.endPoint.x && currentY <= this.endPoint.y; 
          }).bind(path)
          translate = (function(currentX, currentY, speed) {
            let x = Math.sqrt(Math.pow(speed, 2) / (Math.pow(this.ratio,2) + 1)) + currentX;
            // let x = currentX + speed;
            let y = -Math.sqrt(Math.pow(speed, 2)/ (1/Math.pow(this.ratio, 2) + 1)) + currentY;
            return {x, y}
          }).bind(path);
        } else if (endPoint.x > startPoint.x && endPoint.y > startPoint.y)  {
            //右下方
            direction = 'right-down';
            isArriveTarget = ( function (currentX, currentY) {
             return currentX >= this.endPoint.x && currentY >= this.endPoint.y; 
          }).bind(path);
          translate = (function(currentX, currentY, speed) {
            let x = Math.sqrt(Math.pow(speed, 2) / (Math.pow(this.ratio,2) + 1)) + currentX;
            // let y = speed * this.ratio + currentY;
            let y = Math.sqrt(Math.pow(speed, 2)/ (1/Math.pow(this.ratio, 2) + 1)) +  currentY;
            return {x, y}
          }).bind(path);
        } else if(endPoint.x < startPoint.x && endPoint.y < startPoint.y) {
            //左上方
            direction = 'left-up';
            isArriveTarget = ( function (currentX, currentY) {
                return currentX <= this.endPoint.x && currentY <= this.endPoint.y; 
             }).bind(path);
             translate = (function(currentX, currentY, speed) {
                // let x = currentX - speed;
                let x = -Math.sqrt(Math.pow(speed, 2) / (Math.pow(this.ratio,2) + 1)) + currentX;
                // let y = currentY - speed * this.ratio;
                let y = -Math.sqrt(Math.pow(speed, 2)/ (1/Math.pow(this.ratio, 2) + 1)) + currentY;
                return {x, y}
              }).bind(path);
        } else if (endPoint.x < startPoint.x && endPoint.y > startPoint.y) {
            //左下方
            direction = 'left-down';
            isArriveTarget = ( function (currentX, currentY) {
                return currentX <= this.endPoint.x && currentY >= this.endPoint.y; 
             }).bind(path);
             translate = (function(currentX, currentY, speed) {
                let x = -Math.sqrt(Math.pow(speed, 2) / (Math.pow(this.ratio,2) + 1)) + currentX;
                // let x = currentX + speed * this.ratio;
                // let y = currentY - speed * this.ratio;
                let y = Math.sqrt(Math.pow(speed, 2)/ (1/Math.pow(this.ratio, 2) + 1)) + currentY;
                return {x, y}
              }).bind(path);
        }
       
    } else {
        //不动
        isArriveTarget = function(currentX, currentY) {return true};
        translate = function (currentX, currentY, speed) {
            return {x: currentX , y: currentY};
        }
        angle = 0;
        ratio = 0;
        direction = false;
    }
    path.isArriveTarget = isArriveTarget;
    path.translate = translate;
    path.angle = angle;
    path.ratio = ratio;
    path.direction = direction;
    return path;
}

class Line{
    constructor({paths, ctx}){
       this.paths = paths;
       this.ctx = ctx;
    }
    draw(){
        this.paths.forEach(ele => {
           this.ctx.beginPath(); //起始一条路径，或重置当前路径
           this.ctx.lineWidth = 1;
           this.ctx.moveTo(ele.startPoint.x, ele.startPoint.y) //移动的起点 //坐标以左上角为原点
           this.ctx.lineTo(ele.endPoint.x, ele.endPoint.y);
           var grd = this.ctx.createLinearGradient(ele.startPoint.x, ele.startPoint.y, ele.endPoint.x - 10, ele.endPoint.y - 10);
           grd.addColorStop(0, "#FFF");
           grd.addColorStop(1, "#CA5A63");
           this.ctx.strokeStyle = grd; //'#CA5A63';
           this.ctx.stroke();
        });
    }
}

/**
 * 1、划定线条
 * 2、创建光点
 * 3、光点依照线条轨迹移动
 */
class Star {
    constructor({paths, ctx, speed, infinite = true, radius = 4}) {
        this.ctx = ctx;
        this.paths = paths; //across的路径
        this.speed = speed; //across的速度
        this.currentPathIndex = 0;
        this.x = paths[0].startPoint.x;
        this.y = paths[0].startPoint.y;
        this.translate = paths[0].translate;
        this.isArriveTarget = paths[0].isArriveTarget;
        this.angle = paths[0].angle;
        this.ratio = paths[0].ratio;
        this.direction = paths[0].direction;
        this.infinite = infinite; //是否无限循环
        this.radius = radius;
        this.delay = paths[0].delay;
        this.arriveTargetCb = paths[0].arriveTargetCb;
        this.timeStamp = 0;
        this.stopDraw = false; //停止动画
        this.distance = 0;
        this.starLineLen = 20;
    }
    isAcrossEnd (){
        if (this.delay > 0  && this.timeStamp === 0) {
            this.timeStamp = new Date();
        }
        let path = this.paths[this.currentPathIndex];
        if (this.isArriveTarget(this.x , this.y)) {
                if (this.arriveTargetCb) {
                    let {stop} = this.arriveTargetCb(this.ctx);
                    this.stopDraw = !!stop;
                };
                this.currentPathIndex ++ ;
                if (this.currentPathIndex >= this.paths.length) {
                    if(this.infinite) {
                        this.currentPathIndex = 0;
                    } else {
                        return true;
                    }
                }
                let path = this.paths[this.currentPathIndex];
                // debugger;
                this.distance = 0;
                this.x = path.startPoint.x;
                this.y = path.startPoint.y;
                this.translate = path.translate;
                this.isArriveTarget = path.isArriveTarget;
                this.angle  = path.angle;
                this.ratio  = path.ratio;
                this.direction  = path.direction;
                this.delay  = path.delay;
                this.arriveTargetCb  = path.arriveTargetCb;
        }
        return false;
    }
    getStarEndLinePosAndArc(len) {
        let x ,y, startAngle, endAngle;
        if (!this.direction) {
            return {x: this.x , y: this.y};
        }
        switch(this.direction) {
            case 'up':
                x = this.x;
                y = this.y + len;
                startAngle = this.angle - Math.PI/2;
                endAngle = this.angle + Math.PI/2;
                break;
            case 'down':
                x = this.x;
                y = this.y - len;
                startAngle = this.angle - Math.PI/2;
                endAngle = this.angle + Math.PI/2;
                break;
            case 'left':
                x = this.x + len;
                y = this.y;
                startAngle = this.angle - Math.PI/2;
                endAngle = this.angle + Math.PI/2;
                break;
            case 'right':
                x = this.x - len;
                y = this.y;
                startAngle = this.angle - Math.PI/2;
                endAngle = this.angle + Math.PI/2;
                break;
            case 'right-up':
                x = -Math.sqrt(Math.pow(len, 2) / (Math.pow(this.ratio,2) + 1)) + this.x;
                y = Math.sqrt(Math.pow(len, 2)/ (1/Math.pow(this.ratio, 2) + 1)) + this.y;
                startAngle = -Math.PI/2 - this.angle;
                endAngle =  Math.PI/2 - this.angle;
                break;
            case 'right-down':
                x = -Math.sqrt(Math.pow(len, 2) / (Math.pow(this.ratio,2) + 1)) + this.x;
                y = -Math.sqrt(Math.pow(len, 2)/ (1/Math.pow(this.ratio, 2) + 1)) + this.y;
                startAngle = this.angle - Math.PI/2 ;
                endAngle =  Math.PI/2 + this.angle;
                break;
            case 'left-up':
                x = Math.sqrt(Math.pow(len, 2) / (Math.pow(this.ratio,2) + 1)) + this.x;
                y = Math.sqrt(Math.pow(len, 2)/ (1/Math.pow(this.ratio, 2) + 1)) + this.y;
                startAngle = Math.PI/2 + this.angle;
                endAngle = 3 * Math.PI /2 + this.angle;
                break;
            case 'left-down':
                x = Math.sqrt(Math.pow(len, 2) / (Math.pow(this.ratio,2) + 1)) + this.x;
                y = - Math.sqrt(Math.pow(len, 2)/ (1/Math.pow(this.ratio, 2) + 1)) + this.y;
                startAngle = Math.PI/2 - this.angle;
                endAngle =  3 * Math.PI /2 - this.angle ;
                break;
        }
        return {x, y, startAngle , endAngle}
    }
    //是否处于滞停中
    isDelaying(){
        if (this.delay > 0) {
            let now = new Date();
            if (((now - this.timeStamp) >= this.delay) && this.timeStamp !== 0 ) {
                this.delay = 0;
                this.timeStamp = 0;
                return false;
            }
            return true;
        }
        return false;
    }
    draw(){
        if (this.stopDraw) {
            return true;
        }
        if (this.isAcrossEnd()) {
            return true;
        };
        if( this.isDelaying()) {
            return false;
        }
        var starLineLen = this.distance >= this.starLineLen ? this.starLineLen : this.distance;
        let gra = this.ctx.createRadialGradient(
            this.x, this.y, 0,  this.x, this.y, 80);
        gra.addColorStop(0, '#F7DDE5');
        gra.addColorStop(1, '#D76C72');
        this.ctx.save();
        this.ctx.fillStyle = gra;
        this.ctx.beginPath();
        //流星头，二分之一圆
        let {x, y, startAngle, endAngle} = this.getStarEndLinePosAndArc(starLineLen);
        this.ctx.arc( this.x, this.y, this.radius, startAngle, endAngle);
        //绘制流星尾，三角形
        this.ctx.lineTo(x,y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        let pos = this.translate(this.x, this.y, this.speed);
        this.x = pos.x;
        this.y = pos.y;
        this.distance += this.speed;
        return false;
    }
}


class Curve{
    constructor({paths, ctx}){
       this.paths = paths;
       this.ctx = ctx;
    }
    draw(){
        this.paths.forEach(ele => {
            this.ctx.beginPath(); //起始一条路径，或重置当前路径
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(ele.startPoint.x, ele.startPoint.y) //移动的起点 //坐标以左上角为原点
            this.ctx.quadraticCurveTo(ele.point.x, ele.point.y, ele.endPoint.x, ele.endPoint.y);
            var grd = this.ctx.createLinearGradient(ele.point.x, ele.point.y, ele.endPoint.x, ele.endPoint.y);
            grd.addColorStop(0,"#CA5A63");
            grd.addColorStop(1,"#FFF");
            this.ctx.strokeStyle = grd; //'#CA5A63';
            this.ctx.stroke();
        });
    }
}

class MyStar {
    constructor({paths, ctx, speed, infinite = true, radius = 4}) {
        this.ctx = ctx;
        this.paths = paths; //across的路径
        this.speed = speed; //across的速度
        this.currentPathIndex = 0;
        this.x = paths[0].startPoint.x;
        this.y = paths[0].startPoint.y;
        this.translate = paths[0].translate;
        this.isArriveTarget = paths[0].isArriveTarget;
        this.angle = paths[0].angle;
        this.ratio = paths[0].ratio;
        this.direction = paths[0].direction;
        this.infinite = infinite; //是否无限循环
        this.radius = radius;
        this.delay = paths[0].delay;
        this.arriveTargetCb = paths[0].arriveTargetCb;
        this.timeStamp = 0;
        this.stopDraw = false; //停止动画
        this.distance = 0;
        this.starLineLen = 20;
        this.t = 0; // 贝塞尔变量
    }
    getStarEndLinePosAndArc(t) {
        let x ,y, startAngle, endAngle;

        t = t - 0.08;
        x = (1-t)*(1-t)*this.paths[0].startPoint.x + 2*t*(1-t)*this.paths[0].point.x + t*t*this.paths[0].endPoint.x;
        y = (1-t)*(1-t)*this.paths[0].startPoint.y + 2*t*(1-t)*this.paths[0].point.y + t*t*this.paths[0].endPoint.y;

        if (!this.direction) {
            return {x: this.x , y: this.y};
        }
        switch(this.direction) {
            case 'up':
                startAngle = this.angle - Math.PI/2;
                endAngle = this.angle + Math.PI/2;
                break;
            case 'down':
                startAngle = this.angle - Math.PI/2;
                endAngle = this.angle + Math.PI/2;
                break;
            case 'left':
                startAngle = this.angle - Math.PI/2;
                endAngle = this.angle + Math.PI/2;
                break;
            case 'right':
                startAngle = this.angle - Math.PI/2;
                endAngle = this.angle + Math.PI/2;
                break;
            case 'right-up':
                startAngle = -Math.PI/2 - this.angle;
                endAngle =  Math.PI/2 - this.angle;
                break;
            case 'right-down':
                startAngle = this.angle - Math.PI/2 ;
                endAngle =  Math.PI/2 + this.angle;
                break;
            case 'left-up':
                startAngle = Math.PI/2 + this.angle;
                endAngle = 3 * Math.PI /2 + this.angle;
                break;
            case 'left-down':
                startAngle = Math.PI/2 - this.angle;
                endAngle =  3 * Math.PI /2 - this.angle ;
                break;
        }
                
        return {x, y, startAngle , endAngle}
    }
    isAcrossEnd (){
        if (this.isArriveTarget(this.x , this.y)) {
            if (this.delay > 0  && this.timeStamp === 0) {
                this.timeStamp = new Date();
            }
            if (this.arriveTargetCb) {
                let {stop} = this.arriveTargetCb(this.ctx);
                this.stopDraw = !!stop;
            };
            this.currentPathIndex ++ ;
            if (this.currentPathIndex >= this.paths.length) {
                if(this.infinite) {
                    this.currentPathIndex = 0;
                } else {
                    return true;
                }
            }
            let path = this.paths[this.currentPathIndex];
            // debugger;
            this.t = 0;
            this.distance = 0;
            this.x = path.startPoint.x;
            this.y = path.startPoint.y;
            this.translate = path.translate;
            this.isArriveTarget = path.isArriveTarget;
            this.angle  = path.angle;
            this.ratio  = path.ratio;
            this.direction  = path.direction;
            this.delay  = path.delay;
            this.arriveTargetCb  = path.arriveTargetCb;
        }
        return false;
    }
    //是否处于滞停中
    isDelaying(){
        if (this.delay > 0 && this.timeStamp !== 0) {
            let now = new Date();
            if ((now - this.timeStamp) >= this.delay ) {
                this.delay = 0;
                this.timeStamp = 0;
                return false;
            }
            return true;
        }
        return false;
    }
    draw(){
        if (this.stopDraw) {
            return true;
        }
        if (this.isAcrossEnd()) {
            return true;
        };
        if( this.isDelaying()) {
            return false;
        }
        var starLineLen = this.distance >= this.starLineLen ? this.starLineLen : this.distance;
        let gra = this.ctx.createRadialGradient(
            this.x, this.y, 0,  this.x, this.y, 80);
        gra.addColorStop(0, '#F7DDE5');
        gra.addColorStop(1, '#D76C72');
        this.ctx.save();
        this.ctx.fillStyle = gra;
        this.ctx.beginPath();
        //流星头，二分之一圆
        //利用贝塞尔曲线公式计算出曲线上某点坐标
        let t = this.distance/1000;
        this.x = (1-t)*(1-t)*this.paths[0].startPoint.x + 2*t*(1-t)*this.paths[0].point.x + t*t*this.paths[0].endPoint.x;
        this.y = (1-t)*(1-t)*this.paths[0].startPoint.y + 2*t*(1-t)*this.paths[0].point.y + t*t*this.paths[0].endPoint.y;
        let {x, y, startAngle, endAngle} = this.getStarEndLinePosAndArc(t);
        this.ctx.arc( this.x, this.y, this.radius, startAngle, endAngle); // 旋转角度
        //绘制流星尾，三角形
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        let pos = this.translate(this.x, this.y, this.speed);
        this.x = pos.x;
        this.y = pos.y;
        this.distance += this.speed;
        return false;
    }
}

(function(){

    var canvas = document.getElementsByTagName('canvas')[0];
    // canvas.width = window.innerWidth;
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = "月.png";

    // 上方曲线
    let pu1 = generatePath({startPoint: {x: 412.14224, y: 642.24028}, endPoint: {x:260.61936000000003, y: 367.47878}, point: {x:141.27269, y: 564.98167}, delay: 5000});
    let pu10 = generatePath({startPoint: {x: 260.61936000000003, y: 367.47878}, endPoint: {x:374.7666, y: 178.58025}, delay: 13800});

    let pu2 = generatePath({startPoint: {x: 412.14224, y: 642.24028}, endPoint: {x:235.48414, y: 367.87796999999995}, point: {x:124.51929999999999, y: 581.97533}, delay: 5000});
    let pu20 = generatePath({startPoint: {x: 235.48414, y: 367.87796999999995}, endPoint: {x:381.02052, y: 87.077736}, delay: 13800});

    let pu3 = generatePath({startPoint: {x: 413.26226, y: 644.58278}, endPoint: {x:209.31202000000002, y: 369.87595999999996}, point: {x:103.30273000000005, y: 594.0496899999999}, delay: 5000});
    let pu30 = generatePath({startPoint: {x: 209.31202000000002, y: 369.87595999999996}, endPoint: {x:333.96955, y: 106.26754}, delay: 10800});

    let pu4 = generatePath({startPoint: {x: 413.26226, y: 644.58278}, endPoint: {x:186.43253, y: 371.36740000000003}, point: {x:84.20693599999998, y: 604.44789}, delay: 5000});
    let pu40 = generatePath({startPoint: {x: 186.43253, y: 371.36740000000003}, endPoint: {x:325.07425, y: 55.255958}, delay: 13800});

    let pu5 = generatePath({startPoint: {x: 413.26226, y: 644.58278}, endPoint: {x:156.49209000000002, y: 369.32775}, point: {x:60.88073800000001, y: 610.0251999999999}, delay: 5000});
    let pu50 = generatePath({startPoint: {x: 156.49209000000002, y: 369.32775}, endPoint: {x:278.44094, y: 62.326773}, delay: 8800});

    let pu6 = generatePath({startPoint: {x: 413.26226, y: 644.58278}, endPoint: {x:128.50462, y: 369.31362}, point: {x:39.826667999999984, y: 619.03274}, delay: 5000});
    let pu60 = generatePath({startPoint: {x: 128.50462, y: 369.31362}, endPoint: {x:255.45027, y: 11.831806}, delay: 13800});

    // 下方曲线
    let pd1 = generatePath({startPoint: {x: 271.51605, y: 352.94268}, endPoint: {x:423.03893, y: 627.70417}, point: {x:542.3856000000001, y: 430.20129}, delay: 5000});
    let pd10 = generatePath({startPoint: {x: 423.03893, y: 627.70417}, endPoint: {x:308.89169, y: 816.6027}, delay: 13800});
    
    let pd2 = generatePath({startPoint: {x: 271.51605, y: 352.94268}, endPoint: {x:450.12148, y: 628.72838}, point: {x:565.4653599999999, y: 416.95807}, delay: 5000});
    let pd20 = generatePath({startPoint: {x: 450.12148, y: 628.72838}, endPoint: {x:319.73739, y: 868.11236}, delay: 13800});

    let pd3 = generatePath({startPoint: {x: 271.51605, y: 352.94268}, endPoint: {x:470.23268, y: 626.7303899999999}, point: {x:577.72735, y: 403.26512}, delay: 5000});
    let pd30 = generatePath({startPoint: {x: 470.23268, y: 626.7303899999999}, endPoint: {x:327.39241, y: 923.67385}, delay: 10800});

    let pd4 = generatePath({startPoint: {x: 271.51605, y: 352.94268}, endPoint: {x:499.17309, y: 625.2389499999999}, point: {x:602.50893, y: 392.64856}, delay: 5000});
    let pd40 = generatePath({startPoint: {x: 499.17309, y: 625.2389499999999}, endPoint: {x:344.36893, y: 973.67528}, delay: 13800});

    let pd5 = generatePath({startPoint: {x: 271.51605, y: 352.94268}, endPoint: {x:529.76445, y: 623.7544}, point: {x:629.96407, y: 384.93055}, delay: 5000});
    let pd50 = generatePath({startPoint: {x: 529.76445, y: 623.7544}, endPoint: {x:357.30796, y: 1034.8011000000001}, delay: 8800});

    let pd6 = generatePath({startPoint: {x: 271.51605, y: 352.94268}, endPoint: {x:557.7519199999999, y: 623.76853}, point: {x:649.74322, y: 375.25089}, delay: 5000});
    let pd60 = generatePath({startPoint: {x: 557.7519199999999, y: 623.76853}, endPoint: {x:438.88748, y: 944.88485}, delay: 13800});
 
    let line = new Line({paths:[pu10, pu20, pu30, pu40, pu50, pu60, pd10, pd20, pd30, pd40, pd50, pd60], ctx});

    let curve = new Curve({paths:[pu1, pu2, pu3, pu4, pu5, pu6, pd1, pd2, pd3, pd4, pd5, pd6], ctx});
    
    function generateStars() {
        let stars = [];
        let start_p_u_1 =  new Star({paths:[pu10], ctx, speed:1, radius:2});
        let start_p_u_3 =  new Star({paths:[pu30], ctx, speed:1, radius:2});
        let start_p_u_5 =  new Star({paths:[pu50], ctx, speed:1, radius:2});
        let start_p_d_1 =  new Star({paths:[pd10], ctx, speed:1, radius:2});
        let start_p_d_3 =  new Star({paths:[pd30], ctx, speed:1, radius:2});
        let start_p_d_5 =  new Star({paths:[pd50], ctx, speed:1, radius:2});


        let bstart_p_u_1 =  new MyStar({paths:[pu1], ctx, speed:1.5, radius:2});
        let bstart_p_u_3 =  new MyStar({paths:[pu3], ctx, speed:2, radius:2});
        let bstart_p_u_5 =  new MyStar({paths:[pu5], ctx, speed:2.5, radius:2});
        let bstart_p_d_1 =  new MyStar({paths:[pd1], ctx, speed:1.5, radius:2});
        let bstart_p_d_3 =  new MyStar({paths:[pd3], ctx, speed:2, radius:2});
        let bstart_p_d_5 =  new MyStar({paths:[pd5], ctx, speed:2.5, radius:2});

        stars.push(start_p_u_1);
        stars.push(start_p_u_3);
        stars.push(start_p_u_5);
        stars.push(start_p_d_1);
        stars.push(start_p_d_3);
        stars.push(start_p_d_5);
        stars.push(bstart_p_u_1);
        stars.push(bstart_p_u_3);
        stars.push(bstart_p_u_5);
        stars.push(bstart_p_d_1);
        stars.push(bstart_p_d_3);
        stars.push(bstart_p_d_5);

        return stars;
    }

    let drawers = generateStars();
    function update() {
        // 清除画布
        ctx.clearRect(  0, 0, canvas.width, canvas.height);

        // 背景渐变
        var grad = ctx.createRadialGradient(350,500,10,350,500,300) //创建一个渐变色线性对象
        grad.addColorStop(0,"#0C0853");
        grad.addColorStop(0.2,"#110D31");                  //定义渐变色颜色
        grad.addColorStop(0.4,"#170E22");   //定义渐变线中间点的颜色
        grad.addColorStop(1,"#000");
        ctx.fillStyle=grad;                         //设置fillStyle为当前的渐变对象
        ctx.fillRect(0,0,800,800);                    //绘制渐变图形

        // 月
        ctx.drawImage(img, 295, 440);

        // 画线
        line.draw();
        // 绘制二次贝塞尔曲线
        curve.draw();

        drawers.forEach((star, index, arr) => {
            if (star.draw()) {
                arr.splice(index, 1);
            }
        })
        
        frameId = window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(update);
})();