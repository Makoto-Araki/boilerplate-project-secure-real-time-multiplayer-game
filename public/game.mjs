// Module
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

// Object
const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

// Global Data
let ID;

// Receive 'join' message
socket.on('join', function(data) {
  ID = data[data.length - 1].ID;
  draw(data);
});

// Draw Game
const draw = function(data) {
  let img1 = new Image();
  let img2 = new Image();
  context.clearRect(0, 0, 640, 480);
  img1.onload = function() {
    for (let i = 0; i < data.length; i++) {
      if (data[i].ID === ID) {
        console.log('AAA');
        context.drawImage(img1, data[i].X, data[i].Y);
      }
    }
  };
  img2.onload = function() {
    for (let i = 0; i < data.length; i++) {
      if (data[i].ID !== ID) {
        console.log('BBB');
        context.drawImage(img2, data[i].X, data[i].Y);
      }
    }
  };
  img1.src = './dog.png';
  img2.src = './cat.png';
}
