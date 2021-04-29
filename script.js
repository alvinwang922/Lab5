// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');
const newFile = document.getElementById('image-input');
const text = document.getElementById('generate-meme');
const clear = document.getElementById('button-group').querySelectorAll('button')[0];
const readText = document.getElementById('button-group').querySelectorAll('button')[1];
const submit = text.querySelectorAll('button')[0];
const volumeGroup = document.getElementById('volume-group');
const voiceSelection = document.getElementById('voice-selection');
const volumeSlider = volumeGroup.querySelectorAll('input')[0];
const volume = volumeGroup.querySelectorAll('img')[0];
const synth = window.speechSynthesis;

volumeGroup.addEventListener('input', () => {
  if (volumeSlider.value <= 100 && volumeSlider.value >= 67) {
    volume.src = 'icons/volume-level-3.svg';
    volume.alt = 'Level 3';
  }
  else if (volumeSlider.value <= 66 && volumeSlider.value >= 34) {
    volume.src = 'icons/volume-level-2.svg';
    volume.alt = 'Level 2';
  }
  else if (volumeSlider.value <= 33 && volumeSlider.value >= 1) {
    volume.src = 'icons/volume-level-1.svg';
    volume.alt = 'Level 1';
  }
  else if (volumeSlider.value == 0) {
    volume.src = 'icons/volume-level-0.svg';
    volume.alt = 'Level 0';
  }
});

function populateVoiceList() {
  voices = synth.getVoices();

  for (var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if (voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelection.appendChild(option);
  }
}

var voices = [];

readText.addEventListener('click', () => {
  var top = new SpeechSynthesisUtterance(document.getElementById('text-top').value);
  var bottom = new SpeechSynthesisUtterance(document.getElementById('text-bottom').value);
  var selectedOption = voiceSelection.selectedOptions[0].getAttribute('data-name');
  for (var i = 0; i < voices.length ; i++) {
    if (voices[i].name === selectedOption) {
      top.voice = voices[i];
      bottom.voice = voices[i];
    }
  }
  top.volume = volumeSlider.value / 100;
  bottom.volume = volumeSlider.value / 100;
  synth.speak(top);
  synth.speak(bottom);
})

clear.addEventListener('click', () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  text.reset();
  submit.disabled = false;
  clear.disabled = true;
  readText.disabled = true;
});

text.addEventListener('submit', (event) => {
  var top = document.getElementById('text-top').value;
  var bottom = document.getElementById('text-bottom').value;
  context.textAlign = 'center';
  context.font = '50px Impact';
  context.fillStyle = 'white';
  context.fillText(top, canvas.width / 2, canvas.height / 8);
  context.fillText(bottom, canvas.width / 2, canvas.height * 93 / 100);
  submit.disabled = true;
  clear.disabled = false;
  readText.disabled = false;
  voiceSelection.disabled = false;
  populateVoiceList();
  event.preventDefault();
});

newFile.addEventListener('change', files);
function files() {
  let file = newFile.files[0];
  img.src = URL.createObjectURL(file);
  img.alt = file.name;
};

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  text.reset();
  const d = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.drawImage(img, d.startX, d.startY, d.width, d.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
