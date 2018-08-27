var soundFile;
var fft;
var img;
var theta = 0;

// Serve http with refresh: http-server -c-1
// Sync browser: browser-sync start --server -f -w

var filter, filterFreq, filterRes;

function preload() {
  // soundFormats('aif');
  soundFormats('wav');

  // soundFile = loadSound('assets/chimes.wav');

  soundFile = loadSound('/assets/js/assets/Electric-Sheep-V1-1.wav');
  img = loadImage("/assets/js/assets/kong2.jpg");
}

function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);

  fill(255, 40, 255);

  // loop the sound file
  soundFile.loop();
  filter = new p5.LowPass();
  // Disconnect soundfile from master output.
  // Then, connect it to the filter, so that we only hear the filtered sound
  soundFile.disconnect();
  soundFile.connect(filter);

  fft = new p5.FFT();
}

function draw() {
  // put drawing code here
  background(0);

  // Map mouseX to a the cutoff frequency from the lowest
  // frequency (10Hz) to the highest (22050Hz) that humans can hear
  filterFreq = map (mouseX, 0, width, 500, 3000);

  // Map mouseY to resonance (volume boost) at the cutoff frequency
  filterRes = map(mouseY, 0, height, 15, 5);

  // set filter parameters
  filter.set(filterFreq, filterRes);


  var dirX = (mouseX / width - 0.5) * 2;
  var dirY = (mouseY / height - 0.5) * 2;

  directionalLight(500, 500, 400, -dirX, -dirY, 0.10);
  ambientMaterial(250);
  noStroke();
  // fill(50);
  texture(img);
  push();
  // translate(-275, 175);
  // rotateY(-1.2);
  // rotateX(0.9);
  // rotateZ(1);
  sphere(300);
  pop();


}
