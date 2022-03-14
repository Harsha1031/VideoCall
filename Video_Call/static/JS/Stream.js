const APP_ID = '8b8dcbe9c93e49d7907216fba6b44a42';
const CHANNEL = "CousinsMasti";
const TOKEN = "0068b8dcbe9c93e49d7907216fba6b44a42IACp+YG+zN/JNwPUlErRuNLZEfa0PkDKcVYkYSs1nHMZqoM8orUAAAAAEACciVDW6wUvYgEAAQDxBS9i";
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
    if(len===1){
        for(i of Object.keys(remoteUsers)){
            console.log(`(userleft)user-container-${i}`);
        document.getElementById(`user-container-${i}`).style.flexBasis = "50%";
        document.getElementById(`user-container-${i}`).style.maxWidth= "100%";
        }
        document.getElementById(`user-container-${UID}`).style.maxWidth= "100%";
    }
    else if(len===0){
        document.getElementById(`user-container-${UID}`).style.maxWidth= "100%";
    }
    else{
        document.getElementById(`user-container-${UID}`).style.flexBasis = "48%";
        
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
    if(len===1){
        for(i of Object.keys(remoteUsers)){
        document.getElementById(`user-container-${i}`).style.maxWidth= "100%";
        }
        document.getElementById(`user-container-${UID}`).style.flexBasis = "50%";
        document.getElementById(`user-container-${UID}`).style.maxWidth= "100%";
    }
    else if(len===0){
        document.getElementById(`user-container-${UID}`).style.maxWidth= "100%";
    }
    else{
        for(i of Object.keys(remoteUsers)){
        document.getElementById(`user-container-${i}`).style.flexBasis = "48%";
        document.getElementById(`user-container-${i}`).style.maxWidth= "50%";
        }
        document.getElementById(`user-container-${UID}`).style.flexBasis = "48%";
        document.getElementById(`user-container-${UID}`).style.maxWidth= "50%";
    }
};

let leaveAndRemove = async () => {
    for(let i=0;i<localtracks.length;i++){
        localtracks[i].stop();
        localtracks[i].close();
    }

    await client.leave();
    window.open('www.google.com','_self');
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