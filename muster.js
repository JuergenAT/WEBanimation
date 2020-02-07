
// Mouse events treatment - Ball animation
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
  