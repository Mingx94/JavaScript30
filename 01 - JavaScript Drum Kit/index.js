function Player(keys, audios) {
  this.keys = keys;
  this.audios = audios;
  this.timeline = 0;
  this.timer = null;
  this.soundtrack = [];
  this.noteStep = 0;
  this.isPause = true;

  var _this = this;
  window.addEventListener('keydown', function (e) {
    Player.playSound(_this.keys[e.keyCode], _this.audios[e.keyCode]);
    if (_this.timeline) {
      _this.soundtrack.push({ key: e.keyCode, time: _this.timeline });
    }
  });
}
Player.prototype.startRecord = function () {
  if (this.timeline) return;
  var _this = this;
  this.timer = setInterval(function () {
    _this.timeline += 1;
  }, 1);
};
Player.prototype.stopRecord = function () {
  clearInterval(this.timer);
  this.timer = null;
  this.timeline = 0;
}

Player.prototype.play = function () {
  this.isPause = false;
  if (this.timeline) return;
  var _this = this;
  this.timer = setInterval(function () {
    var note = _this.soundtrack[_this.noteStep];
    if (!note) {
      _this.stop();
      return;
    }
    if (_this.timeline >= note.time) {
      Player.playSound(_this.keys[note.key], _this.audios[note.key]);
      _this.noteStep += 1;
    }
    if (!_this.isPause) {
      _this.timeline += 1;
    }
  }, 1);
}
Player.prototype.pause = function () {
  this.isPause = true;
}
Player.prototype.stop = function () {
  this.isPause = true;
  clearInterval(this.timer);
  this.timer = null;
  this.timeline = 0;
  this.noteStep = 0;
}
Player.prototype.clear = function () {
  this.stop();
  this.soundtrack = [];
}
Player.playSound = function (key, audio) {
  if (!key || !audio) return;
  key.addEventListener('transitionend', function removeClass(e) {
    if (e.propertyName !== 'transform') return;
    key.classList.remove('playing');
    key.removeEventListener('transitionend', removeClass);
  });
  key.classList.add('playing');
  audio.currentTime = 0;
  audio.play();
}


var app = new Player(
  [].slice.call(document.querySelectorAll('.key'))
    .reduce(function (map, el) {
      map[el.dataset.key] = el;
      return map;
    }, {}),
  [].slice.call(document.querySelectorAll('.audio'))
    .reduce(function (map, el) {
      map[el.dataset.key] = el;
      return map;
    }, {})
);

var btnRecord = document.getElementById('record');
var btnStopRecord = document.getElementById('record-stop');
var btnPlay = document.getElementById('play');
var btnPause = document.getElementById('pause');
var btnStop = document.getElementById('stop');
var btnClear = document.getElementById('clear');
btnRecord.addEventListener('click', app.startRecord.bind(app));
btnStopRecord.addEventListener('click', app.stopRecord.bind(app));
btnPlay.addEventListener('click', app.play.bind(app));
btnStop.addEventListener('click', app.stop.bind(app));
btnPause.addEventListener('click', app.pause.bind(app));
btnClear.addEventListener('click', app.clear.bind(app));
