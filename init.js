$(function(){
  buildWorld();
  makePlayer();
  makeZombie();

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
