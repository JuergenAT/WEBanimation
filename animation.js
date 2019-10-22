var canvas = new fabric.Canvas('canv');
fabric.Object.prototype.objectCaching = true;
var vid1Layer = new fabric.Canvas('vid1');
var BG_El = document.getElementById('BG');
var BallEl = document.getElementById('Ball');
var Eye_El = document.getElementById('Eye');

window.bSpr = {
  left : 300,
  top  : 300,
  movingLeft : 1
}



// var Video1clipPath = new fabric.Circle({ radius: 70, top: 10, left: 980 });
var Video1clipPath = new fabric.Rect({ 
  left: 955,   // 955
  top: 0,
  fill: 'black',
  width: 300,   //300
  height: 681,
  leftBoarder : 955 });


var video1El = document.getElementById('videoLisa');
var video1 = new fabric.Image(video1El, { left: 955,  top: 0  });
video1.scale(0.3);
vid1Layer.clipPath = Video1clipPath;
vid1Layer.add(video1); 



var BG = new fabric.Image(BG_El);
BG.scale(0.68);
canvas.backgroundImage = BG;

var Ball = new fabric.Image(BallEl);
Ball.scale(0.45).set('top', 486,57).set('left', 941,49);
Ball.objectCaching = false;
canvas.add(Ball);

var Eye = new fabric.Image(Eye_El);
Eye.scale(0.45).set('top', 556,36).set('left', 916,53).set('ceiling',500);
Eye.originX = Eye.originY = 'center';
Eye.movingLeft = 1;
Eye.movingBottom = 1;
canvas.add(Eye);



// animate Eye object
//

(function animateEye() {
  Eye.left += (Eye.movingLeft ? -10 : 10);
  // Eye.top += (Eye.movingBottom ? 0 : -0);
  Eye.top = Eye.ceiling;
    if (Eye.left > 1300) {  Eye.movingLeft = 1;  }  
    if (Eye.left < -5)   {  Eye.movingLeft = 0;  }  
    if (Eye.top > 580)   {  Eye.movingBottom = 0;}  
    if (Eye.top < -5)    {  Eye.movingBottom = 1;}  
  Eye.rotate(Eye.get('angle') + 2);
     
  if (Eye.left > 955 && Eye.top < 400 )
  {
    Video1clipPath.left = Eye.left;
    video1.getElement().pause();
  }
  else {Video1clipPath.left = Video1clipPath.leftBoarder;
    video1.getElement().play();
  }
  Eye.dirty = false;  



  canvas.renderAll();
  vid1Layer.renderAll();
  fabric.util.requestAnimFrame(animateEye);
})();






  // function supports_video() {
  //   return !!document.createElement('video').canPlayType;
  // };
  // function supports_h264_baseline_video() {
  //   if (!supports_video()) { return false; }
  //   var v = document.createElement("video");
  //   return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
  // };
  // console.log(supports_h264_baseline_video());



  // video element treatment
  //
  
  

  
  // video1.on('mouseover', function(){
  //   video1.getElement().pause();
  //   video1.getElement().currentTime = 0;  
  //   console.log('mouseover');
  //   video1.getElement().play();
  // });
  // video1.on('mouseout', function(){
  //   video1.getElement().pause();
  // });
  



// events treatment - Ball animation
//
  canvas.on('mouse:down', function(e){
  getMouseCoords(e);
    Ball.animate('top',"-=300",{ 
      onChange: canvas.renderAll.bind(canvas),
      duration: 2000,
      easing: fabric.util.ease.easeOutQuad,
      onComplete:  function () {
        Ball.animate('top',"+=300",{ 
          onChange: canvas.renderAll.bind(canvas),
          duration: 3000,
          easing: fabric.util.ease.easeInQuad,
          easing: fabric.util.ease.easeOutBounce
        });
        Ball.animate('left', '-=150', {
         duration: 3000,
         onChange: canvas.renderAll.bind(canvas),
         easing: function(t, b, c, d) { return c*t/d + b; }  // linear easiing
        });
      }
    });
    Ball.animate('left',"-=100",{ 
      onChange: canvas.renderAll.bind(canvas),
      duration: 2000,
      easing: function(t, b, c, d) { return c*t/d + b; }  // linear easiing
    });

    
  });





  // checking MIDI ability
  //
  // Variable which tell us what step of the game we're on. 
// We'll use this later when we parse noteOn/Off messages
var currentStep = 0;

// Request MIDI access
if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

} else {
    console.log('WebMIDI is not supported in this browser.');
}




// Function to run when requestMIDIAccess is successful
function onMIDISuccess(midiAccess) {
  var inputs = midiAccess.inputs;
  var outputs = midiAccess.outputs;
  console.log('000', midiAccess.inputs)

  // Attach MIDI event "listeners" to each input
  for (var input of midiAccess.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
      console.log('111', input.name)
  }
}

// Function to run when requestMIDIAccess fails
function onMIDIFailure() {
  console.log('Error: Could not access MIDI devices.');
}

// Function to parse the MIDI messages we receive
// For this app, we're only concerned with the actual note value,
// but we can parse for other information, as well
function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

  switch (command) {
      case 144: // note on
          if (velocity > 0) {
              noteOn(note);
          } else {
              // noteOff(note);
          }
          break;
      case 128: // note off
          // noteOffCallback(note);
          break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}

// Function to handle noteOn messages (ie. key is pressed)
// Think of this like an 'onkeydown' event
function noteOn(note) {
  console.log('note =', note);

if (note < 48 ) { Eye.ceiling = 500}
else if (note < 60)  {Eye.ceiling = 400}
else if (note < 72)  {Eye.ceiling = 300}
else if (note < 84)  {Eye.ceiling = 200}
else {Eye.ceiling = 100}


  switch(note) {
    case 36: 
          
    break;
  }
}


// Function to handle noteOff messages (ie. key is released)
// Think of this like an 'onkeyup' event
function noteOff(note) {
  //...
}









//  serving function
//
  function getMouseCoords(event)
{
  var pointer = canvas.getPointer(event.e);
  var posX = pointer.x;
  var posY = pointer.y;
  console.log(posX+", "+posY);    // Log to console
}





//  Sprite treatment
//
// (function() {
  
//   fabric.Sprite.fromURL('./assets/Spr-Horse.png', createSprite(0,0));
 
//   function createSprite() {
//     return function(sprite) {
//       sprite.scale(0.65).set({
//         left:  955,
//         top:  309
//               });
//       canvas.add(sprite);
      
//       sprite.on('mouseover', function() {
//         sprite.play();
//       });  
//       sprite.on('mouseout', function() {
//         sprite.stop();
//       }); 

//     };
//   }
//   (function render() {
//     canvas.renderAll();
//     fabric.util.requestAnimFrame(render);
//   })();
// })();



//
//
//  BethSprite treatment --------------------------------------->
//
// (function() {
  
  fabric.BSprite.fromURL('./assets/SpriteBethGehtL.png', createSpriteL());
  fabric.BSprite.fromURL('./assets/SpriteBethGehtR.png', createSpriteR());

  function createSpriteL() {
    return function(BSpriteL) {
    
      BSpriteL.scale(0.65).set({
        left:  window.bSpr.left,
        top:  window.bSpr.top
              });
      BSpriteL.objectCaching = true;
      window.bSpr.Ltrigger = 1;
      BSpriteL.play();
      
      (function render() { 
        window.bSpr.left += (window.bSpr.movingLeft ? -2 : 2);
        if (window.bSpr.left > 1100) {  window.bSpr.movingLeft = 1; }  
        if (window.bSpr.left < -5)   {  window.bSpr.movingLeft = 0; }  
        BSpriteL.left = window.bSpr.left;
        console.log('Ltrigger=', window.bSpr.Ltrigger);
        if (window.bSpr.movingLeft == 1) {
          if (window.bSpr.Ltrigger == 1) {
            window.bSpr.Ltrigger = 0;
            canvas.add(BSpriteL);
          }
        }
        else { 
          if (window.bSpr.Ltrigger == 0){
          window.bSpr.Ltrigger = 1;
          canvas.remove(BSpriteL);
          }
        };
        canvas.renderAll();
        fabric.util.requestAnimFrame(render);
        
      })();

    };
  }

  function createSpriteR() {
    return function(BSpriteR) {
    
      BSpriteR.scale(0.65).set({
        left:  window.bSpr.left,
        top:  window.bSpr.top
              });
      BSpriteR.objectCaching = true;
      window.bSpr.Rtrigger = 0;
      window.bSpr.left = 355;
      BSpriteR.play();
      
      (function render() { 
        window.bSpr.left += (window.bSpr.movingLeft ? -2 : 2);
        if (window.bSpr.left > 1300) {  window.bSpr.movingLeft = 1; }  
        if (window.bSpr.left < -5)   {  window.bSpr.movingLeft = 0; }  
        BSpriteR.left = window.bSpr.left;
        if (window.bSpr.movingLeft == 0) {
          if (window.bSpr.Rtrigger == 0){
            window.bSpr.Rtrigger = 1;
            canvas.add(BSpriteR);
          }
        }
        else {
          if (window.bSpr.Rtrigger == 1){
            window.bSpr.Rtrigger = 0;
            canvas.remove(BSpriteR);
          }
        };
        canvas.renderAll();
        fabric.util.requestAnimFrame(render);
        
      })();

    };
  }

  

  
// })();