function setup() {
  var canvas = createCanvas(100, 100);

  // Move the canvas so it’s inside our <div id="sketch-holder">.
   canvas.parent('p5-overlay');

  colorMode(HSB);

}
var c;


function draw(){

  if (c >= 255)  c=0;  else  c++;
  background(c, 255, 255);

}
