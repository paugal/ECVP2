
this.server = null;
this.location_server = "ws://localhost:3000";
this.socket = new WebSocket(this.location_server);



// Connection opened
this.socket.addEventListener('open', function (event) {
    console.log('Connected to WS Server')
});

// Listen for messages
this.socket.addEventListener('message', function (event) {
    console.log('Message from server ');
    //console.log(event.data);
    reciveMSG(event.data);
});

const sendMessage = () => {
    this.socket.send('Hello From Client1!');
}

function reciveMSG(msg){
    var data = JSON.parse(msg);
    if(data.type == 'init'){
        setMyUser(data);
    }
    else if(data.type == 'allUsersData'){
        //console.log('reciveAllUsers')
        setActiveUsers(data.content);
    }

}

async function sendMsg(data){

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    //console.log(data)
    const response = await fetch('/test', options);
    const json = await response.json();
    //console.log(json);
    reciveMSG(JSON.stringify(json));
}


function leaveChat(){

    var leaveMsg = JSON.stringify({type: 'leave', id: userInfo.id});
    socket.send(leaveMSG);
}


//window.onbeforeunload(leaveChat());