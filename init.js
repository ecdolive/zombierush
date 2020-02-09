$(function(){
  buildWorld();
  makePlayer();
  makeZombie();

  //game key codes
  // var KEYLEFT = 37;
  // var KEYUP = 38;
  // var KEYRIGHT = 39;
  // var KEYDOWN = 40;

  var map = {};
  onkeydown = onkeyup = function(e){
    e = e || event; // deal with IE
    map[e.keyCode] = e.type == 'keydown';

    if(map[40] || map[37] || map[39]){ // down || left || right
      event.preventDefault();
    }
    if(map[38] || map[32]){ // up || spacebar
      r.player.jump();
      event.preventDefault();
    }
    if(map[80]){ // p
      r.player.pause();
      event.preventDefault();
    }
  }
  $('touch').on('click', function(){
    r.player.jump();
  });
});
