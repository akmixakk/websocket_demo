const clientId = 'mqttjs_' + Math.random().toString(16).substring(2, 8);
const host = 'wss://broker.emqx.io:8084/mqtt';

//variables to access HTML element
const user_name=document.querySelector("#username");
const connect_button=document.querySelector("#connect");
const chat_area=document.querySelector("#chat");
const chat_box=document.querySelector("#message");
const send_button=document.querySelector("#send");

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
}

console.log('Connecting mqtt client');
const client = mqtt.connect(host, options);

client.on('error', (err) => {
  console.log('Connection error: ', err);
  client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})
client.on('connect', () => {
    console.log('Client connected:' + clientId)
    // Subscribe
    client.subscribe('ankit', { qos: 0 });

  })
  
client.on('close', () => {
  console.log(clientId + ' disconnected')
})

client.on("message", (topic, message, packet) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
    const msg_received = document.createElement("li");
    msg_received.innerHTML = message;
    chat_area.append(msg_received);
});
connect_button.addEventListener("click",()=>{
  if(user_name.value==="")
  return;
  const user=user_name.value;
  const display_connection=document.createElement("li");
  display_connection.innerText=user+ " connected!";
  chat_area.append(display_connection);
  send_button.addEventListener("click",()=>{
    // Publish
    if(chat_box.value==="")
    return;
    const user_message=user_name.value+":-"+chat_box.value;
    client.publish('ankit',user_message , { qos: 0, retain: false })
    chat_box.value="";
  })
})
