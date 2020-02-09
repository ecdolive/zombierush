var options = {
  'width': 500,
  'height': 500,
  'speed': 1,
  'max_length': 20,
  'start_y': 1,
  'end_y': 500,
  'color': {
    'background': '#C1D7E0',
    'endpoint': '#E2FFFF',
    'try': 'rgba(96,159,255,0.3)',
    'line': '#DEFFFF'
  }
}

var d = new Date();
var sTime = d.getTime();

var start = new function(){
  this.x = options.start_x || Math.floor(Math.random() * options.width) + 1;
  this.y = options.start_y || Math.floor(Math.random() * options.height) + 1;
  this.point = this.x + ',' + this.y;
}
var end = new function(){
  this.x = options.end_x || Math.floor(Math.random() * options.width) + 1;
  this.y = options.end_y || Math.floor(Math.random() * options.height) + 1;
  this.point = this.x + ',' + this.y;
}
var current = new function(){
  this.x = start.x;
  this.y = start.y;
  this.point = start.point;
  this.distance = Math.hypot(this.x - end.x, this.y - end.y);
}

var total_distance = current.distance;
var endpoint_color = options.color.endpoint || '#FF0000';
var try_color = options.color.try || 'rgba(0,0,0,0.25)';
var line_color = options.color.line || '#000000';

Number.prototype.toDeg = function(){
  return this * 180 / Math.PI;
}
Number.prototype.toRad = function(){
  return this * Math.PI / 180;
}

function stage(){
  // $('body').css({'background-color': background_color});
  var svg = $('#svg');
  svg
    .attr({'viewBox': '0 0 ' + options.width + ' ' + options.height})
    .append('<circle id="start" fill="' + line_color + '" stroke="none" stroke-width="0" cx="' + start.x + '" cy="' + start.y + '" r="2" />')
    // .append('<circle id="end" fill="#FF0000" stroke="none" stroke-width="0" cx="' + end.x + '" cy="' + end.y + '" r="2" />')
    .append('<circle fill="none" stroke="' + endpoint_color + '" stroke-width="1" cx="' + end.x + '" cy="' + end.y + '" r="3" />')
    .html(svg.html());
}

function tryAgain(){
  if(options.speed){
    setTimeout(function(){
      crawl();
    }, options.speed);
  }
  else {
    crawl();
  }
}

function crawl(){
  var svg = $('#svg');

  var _try = new function(){
    var angle = Math.floor(Math.random() * 360) + 1;
    var length = Math.floor(Math.random() * options.max_length) + 1;
    this.x = current.x + Math.round(Math.cos(angle.toRad()) * length);
    this.y = current.y + Math.round(Math.sin(angle.toRad()) * length);
    this.point = this.x + ',' + this.y;
    this.length = Math.hypot(current.x - this.x, current.y - this.y);
    this.distance = Math.hypot(this.x - end.x, this.y - end.y);
  }

  // console.log('current.point: ' + current.point);
  // console.log('_try.point: ' + _try.point + ', _try.length: ' + _try.length + ', _try.distance: ' + _try.distance);

  svg
    .append('<polyline fill="none" stroke="' + try_color + '" stroke-width="1" points="' + current.point + ' ' + _try.point + '"></polyline>')
    .append('<circle fill="' + try_color + '" stroke="none" stroke-width="0" cx="' + _try.x + '" cy="' + _try.y + '" r="1" />')
    .html(svg.html());

  if(_try.distance < current.distance){
    // console.log('ink line');
    svg
      .append('<polyline fill="none" stroke="' + line_color + '" stroke-width="1" points="' + current.point + ' ' + _try.point + '"></polyline>')
      .append('<circle fill="' + line_color + '" stroke="none" stroke-width="0" cx="' + _try.x + '" cy="' + _try.y + '" r="1.5" />')
      .html(svg.html());
    current.x = _try.x;
    current.y = _try.y;
    current.point = _try.point;
    current.distance = _try.distance;
    if(current.distance <= options.max_length){
      svg
        .append('<polyline fill="none" stroke="' + line_color + '" stroke-width="1" points="' + current.point + ' ' + end.point + '"></polyline>')
        .append('<circle fill="' + line_color + '" stroke="none" stroke-width="0" cx="' + end.x + '" cy="' + end.y + '" r="1.5" />')
        .html(svg.html());
      var dd = new Date();
      var eTime = dd.getTime();
      var loadTime = Math.round(eTime - sTime) / 1000;
      console.log('Load time: ' + loadTime + ' seconds (' + (loadTime / total_distance) + '/unit)');
      location.reload();
    }
    else {
      tryAgain();
    }
  }
  else {
    tryAgain();
  }
}

$(function(){
  $('body').css({'background-color': options.color.background });
  stage();
  crawl();
});
