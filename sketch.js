let minSide;
let objs = [];
let colors = ['#ed3441', '#ffd630', '#329fe3', '#08AC7E', '#DED9DF', '#FE4D03'];
let mainCanvas; // 主畫布區域
let tkuText; // 淡江大學文字物件
let centerBox; // 中心方格物件

function setup() {
    // 建立全螢幕畫布
    let canvas = createCanvas(windowWidth, windowHeight);
    // 將畫布的 z-index 設為 -1，確保它在最底層
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    minSide = min(width, height); // 移除選單影響
    rectMode(CENTER);
    
    // 初始化淡江大學文字動畫
    tkuText = new TKUText();
    // 初始化中心方格
    centerBox = new CenterBox();
}

function draw() {
    background(0);
    
    // 主要動畫
    for (let i of objs) {
        i.run();
    }

    for (let i = 0; i < objs.length; i++) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }

    if (frameCount % (random([10, 60, 120])) == 0) {
        addObjs();
    }

    // 繪製方格與文字
    centerBox.display();
    tkuText.display();
}

// 已移除 drawMenu() 與相關互動

// 修改addObjs函數，確保物件在整個畫面內生成（不再考慮選單寬度）
function addObjs() {
    let x = random(-0.1, 1.1) * width;
    let y = random(-0.1, 1.1) * height;
    
    for (let i = 0; i < 20; i++) {
        objs.push(new Orb(x, y));
    }

    for (let i = 0; i < 50; i++) {
        objs.push(new Sparkle(x, y));
    }
    
    for (let i = 0; i < 2; i++) {
        objs.push(new Ripple(x, y));
    }

    for (let i = 0; i < 10; i++) {
        objs.push(new Shapes(x, y));
    }
}

function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

class Orb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = minSide * 0.03;
        this.rStep = random(1);
        this.maxCircleD = minSide * 0.005;
        this.circleD = minSide * 0.005;
        this.isDead = false;
        this.ang = random(10);
        this.angStep = random([-1, 1]) * random(0.3, 0.1);
        this.xStep = random([-1, 1]) * minSide * random(0.01) * random(random());
        this.yStep = random([-1, 1]) * minSide * random(0.01) * random(random());
        this.life = 0;
        this.lifeSpan = int(random(50, 180));
        this.col = random(colors);
        this.pos = [];
        this.pos.push(createVector(this.x, this.y));
        this.followers = 10;
    }

    show() {
        this.xx = this.x + this.radius * cos(this.ang);
        this.yy = this.y + this.radius * sin(this.ang);
        push();
        noStroke();
        noFill();
        stroke(this.col);
        strokeWeight(this.circleD);
        beginShape();
        for (let i = 0; i < this.pos.length; i++) {
            vertex(this.pos[i].x, this.pos[i].y);
        }
        endShape();
        pop();
    }

    move() {
        this.ang += this.angStep;
        this.x += this.xStep;
        this.y += this.yStep;
        this.radius += this.rStep;
        this.radius = constrain(this.radius, 0, this.maxRadius);
        this.life++
        if (this.life > this.lifeSpan) {
            this.isDead = true;
        }
        this.circleD = map(this.life, 0, this.lifeSpan, this.maxCircleD, 1);
        this.pos.push(createVector(this.xx, this.yy));
        if (this.pos.length > this.followers) {
            this.pos.splice(0, 1);
        }
    }
    run() {
        this.show();
        this.move();
    }
}

class Sparkle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = minSide * random(0.4);
        this.a = random(10);
        this.x0 = x;
        this.y0 = y;
        this.targetX = x + this.r * cos(this.a);
        this.targetY = y + this.r * sin(this.a);
        this.life = 0;
        this.lifeSpan = int(random(50, 280));
        this.col = random(colors);
        this.sw = minSide * random(0.01)
    }

    show() {
        noFill();
        strokeWeight(this.sw);
        stroke(this.col);
        if (random() < 0.5) {
            point(this.x, this.y);
        }
    }

    move() {
        let nrm = norm(this.life, 0, this.lifeSpan);
        this.x = lerp(this.x0, this.targetX, easeOutCirc(nrm));
        this.y = lerp(this.y0, this.targetY, easeOutCirc(nrm));
        this.life++
        if (this.life > this.lifeSpan) {
            this.isDead = true;
        }
    }

    run() {
        this.show();
        this.move();
    }
}


class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 0;
        this.lifeSpan = int(random(50, 150));
        this.col = random(colors);
        this.maxSw = minSide * 0.005;
        this.sw = minSide * 0.005;
        this.d = 0;
        this.maxD = minSide * random(0.1, 0.5);
    }

    show() {
        noFill();
        stroke(this.col);
        strokeWeight(this.sw);
        circle(this.x, this.y, this.d);
    }

    move() {
        this.life++
        if (this.life > this.lifeSpan) {
            this.isDead = true;
        }
        let nrm = norm(this.life, 0, this.lifeSpan);
        this.sw = lerp(this.maxSw, 0.1, easeOutCirc(nrm));
        this.d = lerp(0, this.maxD, easeOutCirc(nrm));
    }

    run() {
        this.show();
        this.move();
    }
}

class Shapes {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 0;
        this.lifeSpan = int(random(50, 222));
        this.col = random(colors);
        this.sw = minSide * 0.005;
        this.maxSw = minSide * 0.005;
        this.w = minSide * random(0.05);
        this.ang = random(10);
        this.angStep = random([-1, 1]) * random(0.05);
        this.shapeType = int(random(3));
        this.r = minSide * random(0.4);
        this.a = random(10);
        this.x0 = x;
        this.y0 = y;
        this.targetX = x + this.r * cos(this.a);
        this.targetY = y + this.r * sin(this.a);
    }

    show() {
        push();
        translate(this.x, this.y);
        rotate(this.ang);
        noFill();
        strokeWeight(this.sw);
        stroke(this.col);
        if (this.shapeType == 0) {
            square(0, 0, this.w);
        } else if (this.shapeType == 1) {
            circle(0, 0, this.w);
        } else if (this.shapeType == 2) {
            line(0, this.w / 2, 0, -this.w / 2);
            line(this.w / 2, 0, -this.w / 2, 0);
        }
        pop();

    }

    move() {
        this.life++
        if (this.life > this.lifeSpan) {
            this.isDead = true;
        }
        let nrm = norm(this.life, 0, this.lifeSpan);
        this.x = lerp(this.x0, this.targetX, easeOutCirc(nrm));
        this.y = lerp(this.y0, this.targetY, easeOutCirc(nrm));
        this.sw = lerp(this.maxSw, 0.1, easeOutCirc(nrm));
        this.ang += this.angStep;
    }

    run() {
        this.show();
        this.move();
    }
}

class CenterBox {
    constructor() {
        this.x = width/2;
        this.y = height/2;
        this.size = min(width, height) * 0.15; // 不再考慮選單寬度
    }
    
    display() {
        push();
        fill(128, 128, 128, 127);
        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y, this.size, this.size);
        pop();
    }
}

class TKUText {
    constructor() {
        this.y = height + 100;
        this.targetY = height/2;
        this.x = width/2;
        this.isAnimating = true;
        // 初始化光暈顏色相關屬性
        this.glowColor = color(255); // 目前顏色
        this.targetGlowColor = color(random(colors)); // 目標顏色
    }
    
    display() {
        if(this.isAnimating) {
            this.y = lerp(this.y, this.targetY, 0.05);
            if(abs(this.y - this.targetY) < 1) {
                this.isAnimating = false;
            }
        }
        
        push();
        // 發光閃爍動畫
        let glowValue = sin(frameCount * 0.1) * 0.5 + 0.5; // 產生 0 到 1 之間的平滑震盪值
        let blurAmount = 16 + glowValue * 32; // 光暈模糊範圍在 16 到 48 之間變化
        let alphaAmount = 150 + glowValue * 100; // 光暈透明度在 150 到 250 之間變化
        
        // 顏色過渡
        this.glowColor = lerpColor(this.glowColor, this.targetGlowColor, 0.02);
        if (frameCount % 120 === 0) { // 每 120 幀（約 2 秒）更換一次目標顏色
            this.targetGlowColor = color(random(colors));
        }
        drawingContext.shadowBlur = blurAmount;
        drawingContext.shadowColor = color(red(this.glowColor), green(this.glowColor), blue(this.glowColor), alphaAmount);

        fill(255);
        noStroke();
        textSize(50);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        // 移除原本的陰影效果，改為使用光暈
        // fill(0, 100);
        // text('淡江大學', this.x + 2, this.y + 2);
        fill(255);
        text('淡江大學', this.x, this.y);
        pop();
    }
}

// 更新視窗大小時重新調整畫布
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    minSide = min(width, height);
    
    // 更新物件位置
    if(tkuText) {
        tkuText.x = width/2;
        tkuText.targetY = height/2;
    }
    if(centerBox) {
        centerBox.x = width/2;
        centerBox.y = height/2;
        centerBox.size = min(width, height) * 0.15;
    }
    // 已移除選單位置重置
}