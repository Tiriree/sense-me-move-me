/*
Mimi Yin NYU-ITP
Drawing skeleton joints
Showing selected joint
 */

// Declare kinectron
var kinectron = null;

// Sound files
var yo, zing, buddha, marimba, rain, thunder;
// Volume of buddha file
var buddhaVol = 0;
// Image of buddha
var buddhaImg;

// Keep track of previous locations for 3 joints
var pHead = null;
var pSpineBase = null;
var pHandLeft = null;

function preload(){
  // Load sound files
  yo = loadSound("data/yo.wav");
  zing = loadSound("data/zing.mp3");
  buddha = loadSound("data/buddha.wav");
  marimba = loadSound("data/marimba.mp3");
  rain = loadSound("data/rain.mp3");
  thunder = loadSound("data/thunder.mp3");

  // Load image of buddha
  buddhaImg = loadImage("data/buddha.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Define and create an instance of kinectron
  //kinectron = new Kinectron("172.16.228.147");
  kinectron = new Kinectron("192.168.0.117");

  // CONNECT TO MIRCROSTUDIO
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect with application over peer
  kinectron.makeConnection();

  // Request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);

  // Cue sounds
  marimba.loop();
  rain.loop();
  buddha.setVolume(buddhaVol);
  buddha.loop();

  imageMode(CENTER);
  background(0);
}

function draw() {
  //background(0);
}

function bodyTracked(body) {
	background(0);

  // Draw all the joints
  kinectron.getJoints(drawJoint);

  // Get all the joints off the tracked body and do something with them

  // Mid-line
  var head = getPos(body.joints[kinectron.HEAD]);
  var neck = getPos(body.joints[kinectron.NECK]);
  var spineShoulder = getPos(body.joints[kinectron.SPINESHOULDER]);
  var spineMid = getPos(body.joints[kinectron.SPINEMID]);
  var spineBase = getPos(body.joints[kinectron.SPINEBASE]);

  // Right Arm
  var shoulderRight = getPos(body.joints[kinectron.SHOULDERRIGHT]);
  var elbowRight = getPos(body.joints[kinectron.ELBOWRIGHT]);
  var wristRight = getPos(body.joints[kinectron.WRISTRIGHT]);
  var handRight = getPos(body.joints[kinectron.HANDRIGHT]);
  var handTipRight = getPos(body.joints[kinectron.HANDTIPRIGHT]);
  var thumbRight = getPos(body.joints[kinectron.THUMBRIGHT]);

  // Left Arm
  var shoulderLeft = getPos(body.joints[kinectron.SHOULDERLEFT]);
  var elbowLeft = getPos(body.joints[kinectron.ELBOWLEFT]);
  var wristLeft = getPos(body.joints[kinectron.WRISTLEFT]);
  var handLeft = getPos(body.joints[kinectron.HANDLEFT]);
  var handTipLeft = getPos(body.joints[kinectron.HANDTIPLEFT]);
  var thumbLeft = getPos(body.joints[kinectron.THUMBLEFT]);

  // Right Leg
  var hipRight = getPos(body.joints[kinectron.HIPRIGHT]);
  var kneeRight = getPos(body.joints[kinectron.KNEERIGHT]);
  var ankleRight = getPos(body.joints[kinectron.ANKLERIGHT]);
  var footRight = getPos(body.joints[kinectron.FOOTRIGHT]);

  // Left Leg
  var hipLeft = getPos(body.joints[kinectron.HIPLEFT]);
  var kneeLeft = getPos(body.joints[kinectron.KNEELEFT]);
  var ankleLeft = getPos(body.joints[kinectron.ANKLELEFT]);
  var footLeft = getPos(body.joints[kinectron.FOOTLEFT]);

  stroke(255);
  fill(255);

  // As the hands get closer, the marimba quiets down
  var d = p5.Vector.dist(handLeft, handRight);
  marimba.setVolume(d/100);
  // strokeWeight(d/10);
  // line(handLeft.x, handLeft.y, handRight.x, handRight.y);

  // As the left hand gets closer to the head, the rain gets louder, non-linearly
  var d = p5.Vector.dist(handLeft, head);
  rain.setVolume(10/d);
  // strokeWeight(10000/d);
  // line(handLeft.x, handLeft.y, head.x, head.y);

  if(pHead != null) {
    var d = p5.Vector.dist(pHead, head);

    // Speed of head sets off thunder
    if(d > 50) {
      thunder.jump(0);
      thunder.play();
    }

    // Constantly moving head, makes buddha talk
    if(d > 10) {
      buddhaVol++;
    }
    // But Buddha is always fading
    buddhaVol -= 0.1;
    buddha.setVolume(buddhaVol);

    // Scale the size of the buddha image to the speed of the head
    var sz = 0.2; //d/100;
    // Scale the alpha of the buddha image to the volume of the sound
    var a = buddhaVol;
    tint(255, a);
    // Show image of buddha
    image(buddhaImg, head.x, head.y, buddhaImg.width*sz, buddhaImg.height*sz);

    // Speed of spineBase sets off zing
    var d = p5.Vector.dist(pSpineBase, spineBase);
    if(d > 50) {
      zing.jump(0);
      zing.play();
    }
    // Scale textsize to speed of spine base
    noStroke();
    textSize(d);
    text("Zing", spineBase.x, spineBase.y);

    // Speed of left hand sets off yo
    var d = p5.Vector.dist(pHandLeft, handLeft);
    if(d > 50) {
      yo.jump(0);
      yo.play();
    }

    // Scale textsize to speed of left hand
    textSize(d);
    text("Yo", handLeft.x-50, handLeft.y);
  }

  // Remember positions for next frame
  pHead = head;
  pSpineBase = spineBase;
  pHandLeft = handLeft;
}

// Scale the data to fit the screen
// Return it as a vector
function getPos(joint) {
  return createVector(joint.cameraX * width/2 + width/2, -joint.cameraY * width/2 + height/2, joint.cameraZ * width/2);
}

// Draw skeleton
function drawJoint(joint) {

  //console.log("JOINT OBJECT", joint);
  var pos = getPos(joint);

  //Kinect location data needs to be normalized to canvas size
  stroke(255);
  strokeWeight(5);
  point(pos.x, pos.y);
}


