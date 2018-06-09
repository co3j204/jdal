//Set up
var canvas = document.getElementById('canvas');
var image = document.createElement('canvas');

var ctx = canvas.getContext('2d');

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
}

//Components
var x = 0;
var swing = 0.5; 
var acceleration = [-swing];
var velocity = [0];
var position = [0];
var integral = [0];
var gameOver = false;
var active = false;

var family = [];
var level = 3;
for(var i=0;i<level;i++) {
  family.push([0]);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

var baseResolution = 1;
var resolution = 1;
var scale = 1;
var targetScale = 1;
var max = 0; 
var extrema = [];
function update(delta) {
  x+=delta*resolution;
  if(family.length > 1) {
    family[0].push(active ? swing : -swing);
    for(var i=1;i<family.length;i++) {
      var newVal = family[i][family[i].length - 1] + family[i-1][family[i-1].length - 1];
      if(Math.abs(newVal) < 0.25 && i === family.length - 2) {
        console.log(newVal);
        extrema.push(family[i].length);
      }
      family[i].push(newVal);
    }
  }
  var last = family[family.length-1]; 
  max = Math.abs(last[last.length - 1]);
  for(var i=extrema.length-1;i>0&&i>extrema.length-6;i--) {
    if(Math.abs(last[extrema[i]]) > max) {
      max = Math.abs(last[extrema[i]]);
    }
  }
  targetScale = (canvas.height/3)/max;
  if(targetScale > 10) {
    targetScale = 10;
  }

  scale += (targetScale - scale)/20;

  resolution = baseResolution * scale;

}

function render() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(-family[0].length * resolution + canvas.width/2,canvas.height/2);
  //Draw center line
  ctx.beginPath();
  ctx.moveTo(family[0].length * resolution - canvas.width/2,0);
  ctx.lineTo(family[0].length * resolution + canvas.width/2,0);
  ctx.strokeStyle = "#0f0"; 
  ctx.stroke();
  for(var i=0;i<family.length;i++) {
    ctx.beginPath();
    for(var j=1;j<family[i].length&&j<canvas.width/2/resolution;j++) {
      ctx.lineTo((family[i].length-j)*resolution,-family[i][family[i].length - j]*scale);
    }
    ctx.strokeStyle = "rgba(255,255,255," + (i+1)/(family.length) + ")";
    ctx.lineWidth = (i+1)/(family.length )*3;
    ctx.stroke();
  }
  ctx.restore();
}
var now = 0;
var then = 0;
var lastUpdate = 0;
var frames = 0;
var fps = 0;
var step = 0;
var targetStep = 1000/60;
function loop() {
  then = now;
  now = Date.now();
  frames++;
  if(now - lastUpdate > 1000) {
    lastUpdate = now;
    fps = frames;
    frames = 0;
  }
  update((now - then)/targetStep);
  if (!gameOver) {
    render();
  } else {
    delay();
  }
  window.requestAnimationFrame(loop);
};
loop();

//Controls of all kinds
function controlDown() {
  active = true;
}
function controlUp() {
  active = false;
}
window.addEventListener('mousedown', controlDown);
window.addEventListener('mouseup', controlUp);
window.addEventListener('keydown',function(e) {
  if(e.which === 32) {
    controlDown();
  }
});
window.addEventListener('keyup',controlUp  );
window.addEventListener('touchstart',controlDown);
window.addEventListener('touchend',controlUp);