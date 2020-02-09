var options = {
  'width': 40,
  'height': 40,
  'lines': 1600,
  'speed': 2
}

var start = {
  'x': Math.floor(Math.random() * options.width) + 1,
  'y': Math.floor(Math.random() * options.height) + 1
}
var finish = {
  'x': Math.floor(Math.random() * options.width) + 1,
  'y': Math.floor(Math.random() * options.height) + 1
}
var startPoint = start.x + ',' + start.y;
var finishPoint = finish.x + ',' + finish.y;
var lastPoint = startPoint;

var points = {
  'fullLine': startPoint,
  'lastLine': startPoint,
  'newLine': startPoint
}

function stage(){
  var svg = $('#svg');
  svg.attr({'viewBox': '0 0 ' + options.width + ' ' + options.height});
  svg
    .append('<polyline id="fullline" fill="none" stroke="#EEEEEE" stroke-width="1" points="' + startPoint + '"></polyline>')
    .append('<polyline id="lastline" fill="none" stroke="#CCBCBC" stroke-width="0.25" points="' + startPoint + '"></polyline>')
    .append('<circle id="start" fill="#000000" stroke="none" stroke-width="0" cx="' + start.x + '" cy="' + start.y + '" r="2" />')
    .append('<circle id="finish" fill="#FF0000" stroke="none" stroke-width="0" cx="' + finish.x + '" cy="' + finish.y + '" r="2" />')
    .append('<circle fill="none" stroke="#FF0000" stroke-width="1" cx="' + finish.x + '" cy="' + finish.y + '" r="4" />')
    .append('<polyline id="newline" fill="none" stroke="#330000" stroke-width="0.25" points="' + startPoint + '"></polyline>')
    .html(svg.html());
}
var x = 0;
function crawl(){
  var svg = $('#svg');
  var newLine = $('#newline');
  var lastLine = $('#lastline');
  var fullLine = $('#fullline');

  setTimeout(function(){
    var newX = Math.floor(Math.random() * options.width) + 1;
    var newY = Math.floor(Math.random() * options.height) + 1;
    var newPoint = ' ' + newX + ',' + newY;
    // console.log('newpoint: ' + newPoint);

    points.lastLine = points.newLine;
    points.newLine = lastPoint + newPoint;
    points.fullLine = fullLine.attr('points');
    svg.append('<circle fill="rgba(0,0,0,0.1)" stroke="none" stroke-width="0" cx="' + newX + '" cy="' + newY + '" r="0.5" />');

    newLine.attr({'points': points.newLine});
    lastLine.attr({'points': points.lastLine});
    fullLine.attr({'points': points.fullLine + newPoint});
    // console.log('New line: ' + lastPoint + newPoint + '; Full line: ' + points + newPoint);
    x++;
    svg.html(svg.html());
    if(x < options.lines){
      console.log('new point: ' + newPoint + ', finishPoint: ' + finishPoint);
      if(newPoint == ' ' + finishPoint){
        setTimeout(function(){
          alert('jackpot!')
        },options.speed + 100);
      }
      else{
        lastPoint = newPoint;
        crawl();
      }
    }
    else {
      svg.append('<circle fill="#330000" stroke="none" stroke-width="0" cx="' + newX + '" cy="' + newY + '" r="2" />');
      svg.html(svg.html());
    }
  }, options.speed);
}

$(function(){
  stage();
  crawl();
});
