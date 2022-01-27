//fondos https://craftpix.net/freebies/free-pixel-art-street-2d-backgrounds/


  
function init() { window.requestAnimationFrame(draw); }
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
var myId = 0;

userInfo = {
    type: 'userInfo',
    id: null,
    position: { posx: 0, posy: 0 },
    target: { tarx: null, tary: null }
}

activeUsers = null;

usersDisplayInfo = [];

function setMyId(id){
    myId = id;
    userInfo.id = id;
}

function setActiveUsers(dataUsers){
    activeUsers = dataUsers;
    displayUsersInfo();
}

function loadActiveUsers(data){
    
}

function displayUsersInfo(){
    //activeUsers.content.
}

function draw() {
    var canvas = document.getElementById('canvas');
    var parent = canvas.parentNode;
	var rect = parent.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
    
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width, canvas.height);
    userInfo.position.posx = lerp(userInfo.position.posx, userInfo.target.tarx, vel);
    userInfo.position.posy = lerp(userInfo.position.posy, userInfo.target.tary, vel);
    var square = new Path2D();
    square.rect(userInfo.position.posx, userInfo.position.posy, 10, 10);
    ctx.stroke(square);
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
        userInfo.target.tarx = canvasx;
        userInfo.target.tary = canvasy;
        sendMsg(userInfo);
        
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