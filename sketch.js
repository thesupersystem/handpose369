let handpose;
let video;
let predictions = [];
let openHandSound;
let mySound;

function preload() {
    soundFormats('ogg', 'mp3');
      openHandSound = loadSound('techno.mp3');
    }

function setup() {
  createCanvas(1280, 768);
  openHandSound.setVolume(0.2);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
    
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  checkOpenHand();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

function checkOpenHand() {
      if (predictions.length > 0) {
        const openHand = isHandOpen(predictions[0]);
        if (openHand) {
          openHandSound.play();
        }
        else{
          openHandSound.stop();
        }
      }
    }

function isHandOpen(prediction) {
      // Check if the hand is open based on your desired criteria
      // For example, you can check the distance between certain keypoints
      // or use a specific hand pose estimation library
      // For simplicity, let's assume the hand is open if the index and middle fingers are extended
      const indexTip = prediction.landmarks[8];
      const middleTip = prediction.landmarks[12];
      const distance = dist(indexTip[0], indexTip[1], middleTip[0], middleTip[1]);
      return distance > 50; // Adjust the threshold as needed
    }
