//fondos https://craftpix.net/freebies/free-pixel-art-street-2d-backgrounds/

var mouse_pos = [0,0];
var vel = 0.1;
const size = 10;
var myId = 0;
var voiceRange = 100;
var userInfo = null;
activeUsers = null;
usersDisplayInfo = [];
distFromMe = [];
var server = null;
var canvas = null;

var server = new ClientSide();

window.onbeforeunload = ClientSide.leaveChat(myId);

function updatePosition(){
    lastPos = [userInfo.position.posx, userInfo.position.posy]
    userInfo.position.posx = Math.round(lerp(userInfo.position.posx, userInfo.target.tarx, vel));
    userInfo.position.posy = Math.round(lerp(userInfo.position.posy, userInfo.target.tary, vel));
    sendMsg(userInfo);
}

function calDistance(){

    if(activeUsers != null){
        for(let i = 0; i < activeUsers.length; i++){
            var dist = twoPointsDist(activeUsers[i].position.posx, activeUsers[i].position.posy, userInfo.position.posx, userInfo.position.posy);
            const index = distFromMe.findIndex(x => x.id === activeUsers[i].id)
            if(index > -1){ distFromMe.splice(index, 1); }
            if(activeUsers[i].id != null){ distFromMe.push({id: activeUsers[i].id, dist: dist}); }
        }
    }
}

function twoPointsDist(x1, y1, x2, y2){
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt( a*a + b*b );
}

function draw() {
    var parent = canvas.parentNode;
	var rect = parent.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
    
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    usersDisplayInfo.forEach(function(o) {
        ctx.fillStyle = o[4];
        ctx.fillRect(o[0], o[1], o[2], o[3]);
    });
}

function loop(timestamp){
    var progress = timestamp - lastRender
    if (userInfo != null){
        updatePosition(progress);
        calDistance();
        draw()
    }
    
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);

function setMyUser(data){
    console.log(data)
    myId = data.info;
    userInfo = {
        type: 'userInfo',
        id: data.info,
        position: { posx: 0, posy: 0 },
        target: { tarx: 0, tary: 0 },
        dist: 0
    }
    setActiveUsers(data.usersInfo);
    
}

function setActiveUsers(dataUsers){
    activeUsers = dataUsers;
    loadActiveUsers(dataUsers);
}

function loadActiveUsers(data){
    usersDisplayInfo = [];
    var color = 'black';
    
    for(let i = 0; i < data.length; i++){
        var index = distFromMe.findIndex(x => x.id === data[i].id);
        if(index != -1){  
            if(distFromMe[index].dist < voiceRange){
                color = 'red';
            }else{
                color = 'black';
            }
        }
        var aux = [data[i].position.posx, data[i].position.posy, size, size, color];
        usersDisplayInfo.push(aux);
    }
    
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
        if(canvasx > 0 && canvasx < Math.round(rect.width) && canvasy > 0 && canvasy < Math.round(rect.height)){
            userInfo.target.tarx = canvasx;
            userInfo.target.tary = canvasy;
        }
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
window.onload = function(){
    const canvasBox = document.getElementById('canvasBox');
    canvas = canvasBox;
    canvasBox.addEventListener("mousemove", onMouse );
    canvasBox.addEventListener("mousedown", onMouse );
    canvasBox.addEventListener("mouseup", onMouse );
}


