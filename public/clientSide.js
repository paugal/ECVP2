
var server = null;
var location_server = "ws://localhost:3000";


const socket = new WebSocket(location_server);

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('Connected to WS Server')
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ');
    reciveMSG(event.data);
});

const sendMessage = () => {
    socket.send('Hello From Client1!');
}

function reciveMSG(msg){
    var data = JSON.parse(msg);
    if(data.type == 'init'){
        setMyId(data.info);
    }
    else if(data.type == 'allUsersData'){
        console.log('reciveAllUsers')
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

    console.log(data)
    const response = await fetch('/test', options);
    const json = await response.json();
    console.log(json);
}
