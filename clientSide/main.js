//fondos https://craftpix.net/freebies/free-pixel-art-street-2d-backgrounds/

function init() {
    window.requestAnimationFrame(draw);
}

init();

var last = performance.now();

function loop()
{
   drawScene();


   //to compute seconds since last loop
   var now = performance.now();
   //compute difference and convert to seconds
   var elapsed_time = (now - last) / 1000; 
   //store current time into last time
   last = now;

   //now we can execute our update method
   updateScene( elapsed_time );

   //request to call loop() again before next frame
   requestAnimationFrame( loop );
}
var mouse_pos = [0,0];
var target = [0, 0];
var position = [0, 0];
var vel = 0.1;


function draw() {
    var canvas = document.getElementById('canvas');
    //Canvas Resize
    var parent = canvas.parentNode;
	var rect = parent.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
    
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width, canvas.height);
    position[0] = lerp(position[0], target[0], vel);
    position[1] = lerp(position[1], target[1], vel);
    var square = new Path2D();
    square.rect(position[0], position[1], 10, 10);
    ctx.stroke(square);

    

    //draw an image
    //ctx.drawImage( img, 100, 100);
        /*
    var background = new Image();
    background.src = "https://i.ibb.co/svpyZXM/City4.png";
    ctx.drawImage(background,0,0, 1000, 300);   
    */
    window.requestAnimationFrame(draw);
}


//maps a value from one domain to another
function map_range( value, low1, high1, low2, high2) {
	var range1 = high1 - low1;
	var range2 = high2 - low2;
    return low2 + range2 * (value - low1) / range1;
}



//ANIMATE THE MOVEMENT

//linear interpolation between two values
function lerp(a,b,f)
{
	return a * (1-f) + b * f;
}

//in your loop
//user.pos[0] = lerp( user.pos[0], user.target_pos[0], 0.01 );


//LOCAL MOUSE


function onMouse( event ) { 

    var rect = canvas.getBoundingClientRect();
    var canvasx = mouse_pos[0] = event.clientX - rect.left;
    var canvasy = mouse_pos[1] = event.clientY - rect.top;

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    //Clamp de values, to fit inside de canvas
    canvasx = Math.round(clamp(canvasx, 0, rect.width));
    canvasy = Math.round(clamp(canvasy, 0, rect.height));

    if(event.type == "mousedown")
    {
        target = [canvasx, canvasy];
        console.log('target set in:', canvasx, ',' , canvasy);
        console.log(rect);
        
    }
    else if(event.type == "mousemove")
    {
        //console.log('Moving in:', canvasx, ',', canvasy);
        document.getElementById('coordenadas').innerHTML = 
        'X: '+canvasx + ', Y: ' + canvasy;
    }
    else //mouseup
    {
    }
};

document.addEventListener("mousemove", onMouse );
document.addEventListener("mousedown", onMouse );
document.addEventListener("mouseup", onMouse );