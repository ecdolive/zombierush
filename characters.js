var r = {
  'ground': {},
  'player': {},
  'view': {},
  'zombie': {}
};

var speed = 4000;
var hasCollided = false;
var coins = 0;

function buildWorld(){
  r.view.w = $(window).width(); // 1200
  r.view.h = $(window).height(); // 900
  r.ground.w = r.view.w; // 1200
  r.ground.surface = r.view.h/3; // 300
  $('world').css({
    'height': r.view.h, // 900
    'width': r.view.w // 1200
  });
  $('ground').css({
    'height': r.ground.surface // 300
  });
  console.log('view: ' + r.view.w + 'x' + r.view.h);
}

function makePlayer(){
  var nativePlayerW = 136;
  var nativePlayerH = 280;

  r.player.h = Math.round(r.view.h * .14418); // 140
  r.player.w = Math.round((r.player.h/nativePlayerH) * nativePlayerW); // 68
  r.player.x = r.view.w/3; // 400
  r.player.y = r.ground.surface; // 300
  r.player.isJumping = false;

  $('player').css({
    'bottom': r.player.y,
    'height': r.player.h,
    'left': r.player.x,
    'width': r.player.w
  });

  $('#data-playerX').html(Math.round(r.player.x));
  $('#data-playerAir').html('0');

  // ACTIONS
  r.player.jump = function(){
    if(r.player.isJumping == false){
      console.log('jump!');
      var ground_position = r.player.y; // ground position
      var peak_position = ground_position + (r.player.h * 2); // ground position + jump height
      var ascend_time = 360; // time to reach peak jump
      var hang_time = 40; // delay = hangtime
      var descend_time = 360; // time to reach ground
      // console.log('up!');
      r.player.isJumping = true;
      $('player').animate({
        'bottom': peak_position
      }, ascend_time, function(){
        // console.log('down!');
        $('player').delay(hang_time).animate({
          'bottom': ground_position
        }, descend_time, function(){
          r.player.isJumping = false;
        });
      });
      function trackPlayer(){
        // console.log('tracking player...');
        $('#data-playerAir').html(r.player.getAirPosition);
        if(r.player.isJumping){
          $.wait(20).then(trackPlayer);
        }
      }
      trackPlayer();
    }
  }
  r.player.getPositionX = function(){
    return Math.round($('player').position().left);
  }
  r.player.getAirPosition = function(){
    return Math.round(0 - ($('player').height() + $('player').position().top));
  }
}

function makeZombie(){
  var nativeZombieW = 192;
  var nativeZombieH = 280;

  r.zombie.h = Math.round(r.view.h * .14418);
  r.zombie.w = Math.round((r.zombie.h/nativeZombieH) * nativeZombieW);
  r.zombie.x = r.view.w;
  r.zombie.y = r.ground.surface;
  r.zombie.isRunning = false;

  var zombie = $('<zombie></zombie>').css({
    'bottom': r.zombie.y,
    'height': r.zombie.h,
    'left': r.zombie.x,
    'width': r.zombie.w
  });
  $('ground').append(zombie);

  // ACTIONS
  // r.zombie.pause = function(){
  //   r.zombie.isRunning = false;
  // }
  var hasPassed = false;
  function trackZombie(){
    if(hasPassed == false){
      // console.log('tracking player...');
      var zombieX = r.zombie.getPositionX();
      var playerX = r.player.getPositionX();
      if(zombieX > playerX - (r.player.w/2) && zombieX < playerX + (r.player.w/2)){
        if(r.player.getAirPosition() < r.zombie.h){
          console.log('collision!');
          collision();
        }
        else {
          hasPassed = true;
          var coins_earned = Math.ceil(Math.random() * 4);
          coins += coins_earned;
          console.log('collision avoided, +' + coins_earned + ' coins');
          showCoins(coins_earned);
          if(speed > 1000){
            speed -= 20;
          }
        }
      }
      $('#data-zombieX').html(r.zombie.getPositionX);
      $('#data-zombieSpeed').html(speed);
      $('#data-coins').html(coins);
      $('go-coins').html('Total coins: ' + coins);
      if(r.zombie.isRunning){
        $.wait(20).then(trackZombie);
      }
    }
  }
  function showCoins(n){
    console.log('show coins!');
    $('coins')
      .html('+' + n)
      .css({
        'background-color': 'rgba(255,255,0,1)',
        'border': '1px solid rgba(200,170,0,1)',
        'border-radius': 16,
        'color': 'rgba(200,160,0,1)',
        'font-weight': 900,
        'height': 32,
        'left': r.player.x,
        'letter-spacing': '.15em',
        'line-height': '32px',
        'opacity': 1,
        'position': 'absolute',
        'text-align': 'center',
        'top': r.player.y - 20,
        'width': 28
      })
      .animate({
        'top': r.player.y - 40,
        'opacity': 0
      }, 1500, 'linear');
  }
  r.zombie.run = function(){
    r.zombie.isRunning = true;
    zombie.animate({
      'left': 0 - zombie.width()
    }, speed, 'linear', function(){
      // after animate
      r.zombie.isRunning = false;
      zombie.remove();
      makeZombie();
    });

    trackZombie();
  }
  r.zombie.getPositionX = function(){
    return Math.round($('zombie').position().left);
  }
  r.zombie.run();
}

$.wait = function(ms) {
    var defer = $.Deferred();
    setTimeout(function() { defer.resolve(); }, ms);
    return defer;
};

function collision(){
  if(hasCollided == false){
    hasCollided = true;
    console.log('infected!');
    $('gameover').css({
      'animation': '6s cubic-bezier(0.455, 0.03, 0.515, 0.955) 1 redden', // easeInOutQuad
      'display': 'flex',
      'height': r.view.h,
      'width': r.view.w
    });
    $('gameover > div > div > go-message').css({
      'animation': '6s cubic-bezier(0.165, 0.84, 0.44, 1) 1 zoom' // easeOutQuart
    });
  }
  setTimeout(function(){
    window.location = "index.html";
  }, 6000);
}
