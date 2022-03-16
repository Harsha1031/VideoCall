// Risky app


const APP_ID = 'b96b681221da412288f446dddf96d66a';
const CHANNEL = "CousinsMasti";
const TOKEN = "006b96b681221da412288f446dddf96d66aIABpnVHIxJTllAHpaUpKn7Gubf9/0/43Tbm8M2TOqBYv64M8orUAAAAAEADnfDPKFTwzYgEAAQASPDNi";
let UID = null; 

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'});
 
let localtracks = []; // FOR AUDIO VIDEO TRACKS
let remoteUsers = {};

let joinCall = async () => {
    client.on('user-published', handleUserJoin);
    client.on('user-left', handleUserLeft);

    UID = await client.join(APP_ID, CHANNEL, TOKEN, null); // CREATES USER ID

    localtracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let videoplayer=`<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}" >
                        </div> 
                    </div> `;
    console.log(`user-${UID}`);
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',videoplayer);
    localtracks[1].play(`user-${UID}`);
    await client.publish([localtracks[0],localtracks[1]]);
};

let = handleUserLeft = async (user) =>{
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
    let len = (Object.keys(remoteUsers)).length;   
    if(screen.width<=768){
        document.getElementById(`user-container-${user.uid}`).style.maxWidth= "100%";
    }
};

let handleUserJoin = async (user,mediaType) => {
    remoteUsers[user.uid]=user.uid;
    await client.subscribe(user,mediaType);
    let len = (Object.keys(remoteUsers)).length;   
    if(mediaType === 'video'){
        let player=document.getElementById(`user-container-${user.uid}`);
        if(player!=null)
            player.remove();
        
        let videoplayer=`<div class="video-container" id="user-container-${user.uid}">
                            <div class="video-player" id="user-${user.uid}" >
                            </div> 
                        </div> `;
        document.getElementById('video-streams').insertAdjacentHTML('beforeend',videoplayer);
        user.videoTrack.play(`user-${user.uid}`);
    }
    if(mediaType === 'audio'){
        user.audioTrack.play();
    }
    if(screen.width<=768){
        document.getElementById(`user-container-${user.uid}`).style.maxWidth= "100%";
    }
};

let leaveAndRemove = async () => {
    for(let i=0;i<localtracks.length;i++){
        localtracks[i].stop();
        localtracks[i].close();
    }

    await client.leave();
    window.open('/','_self');
};

let toggleCamera = async (e) => {
    if(localtracks[1].muted){
        await localtracks[1].setMuted(false);
        e.target.style.backgroundColor = 'rgb(149, 149, 240)';
    }
    else{
        await localtracks[1].setMuted(true);
        e.target.style.backgroundColor = 'rgba(255,80,80,1)';
    }
}

let toggleMic = async (e) => {
    console.log(remoteUsers)

    if(localtracks[0].muted){
        await localtracks[0].setMuted(false);
        e.target.style.backgroundColor = 'rgb(149, 149, 240)';
    }
    else{
        await localtracks[0].setMuted(true);
        e.target.style.backgroundColor = 'rgba(255,80,80,1)';
    }
}

document.getElementById('leave-btn').addEventListener('click',leaveAndRemove);
document.getElementById('camera-btn').addEventListener('click',toggleCamera);
document.getElementById('mic-btn').addEventListener('click',toggleMic);    

joinCall();