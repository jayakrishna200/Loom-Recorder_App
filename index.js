// query selector is used to select the html elements
let video=document.querySelector("video");
let recordBtnCont=document.querySelector(".record-btn-cont");
let recordBtn=document.querySelector(".record-btn")
let captureBtnCont=document.querySelector(".capture-btn-cont");
let captureBtn=document.querySelector(".capture-btn");
let transparentColor

let recordFlag=false; 

let recorder; // stores undefined values
let chunks=[]; // media data is stored in chunks
let constraints={
    video:true,
    audio:true
};
// navigator is a global object where this gives info about browser
// The MediaDevices interface of the Media Capture and Streams API provides access to connected media input devices like cameras and microphones, as well as screen sharing. In essence, it lets you obtain access to any hardware source of media data.
navigator.mediaDevices.getUserMedia(constraints)
 .then((stream)=>{
    console.log(stream);
    // srcObject is a property of HTMLMediaElement which sets or gets the media stream associated with the element.
    video.srcObject=stream;

    recorder=new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{ 
        //convert the media chunks data to video
        let blob=new Blob(chunks,{type:"video/mp4"});
        let videoURL=URL.createObjectURL(blob);
        let a=document.createElement("a");
        a.href=videoURL;
        a.download="stream.mp4";
        a.click();
    })
    recordBtnCont.addEventListener("click",(e)=>{
        if(!recorder) return ;

        recordFlag=!recordFlag;
        if(recordFlag){ // start
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();
        }else{ // stop
            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer()
        }
    });
}); 

captureBtnCont.addEventListener("click",(e)=>{
captureBtnCont.classList.add("scale-capture");
let canvas=document.createElement("canvas");
canvas.width=video.videoWidth;
canvas.height=video.videoHeight;
let imageURL=canvas.toDataURL("image/jpeg");

let tool=canvas.getContext("2d");
tool.drawImage(video,0,0,canvas.width,canvas.height);
//filtering
tool.fillStyle=transparentColor;
tool.fillRect(0,0,canvas.width,canvas.height);

let a=document.createElement("a");
a.href=imageURL;
a.download="image.jpeg";
a.click();


//remove the animations
setTimeout(()=>{
    captureBtn.classList.remove("scale-capture");
},500)
})

// filtering logic
let filter=document.querySelector(".filter-layer");
let allFilter=document.querySelectorAll(".filter");
allFilter.forEach((filter)=>{
filterElem.addEventListener("click",(e)=>{
    // get style
    transparentColor=getComputedStyle(filterElem).getPropertyValue("background-color");
    filter.style.backgroundColor=transparentColor;
})
})


let timerID;
let counter=0; //Represents the number of seconds
let timer=document.querySelector(".timer");
function startTimer(){
    timer.style.display="block";
    function displayTimer(){
        /* How to calculate the time is that 
        1) Initial the variable  that actually stores no.of seconds
        2)when ever this function displayTimer is called then we need to increment the 
        counter variable, as each call of this function is considered as 1sec in regular time. Why? because we need to get
        actual time when this thing needs counted.
        How to count Hours, Minutes & Seconds?
        counter=3725
        we know 1hr=3600 seconds, to count 1hr using counter variable value, we use 

        */
       let totalSeconds=counter;
       let hours=Number.parseInt(totalSeconds / 3600);
       totalSeconds=totalSeconds % 3600;
       let minutes=Number.parseInt(totalSeconds / 60);
       totalSeconds=totalSeconds % 60;
       let seconds=totalSeconds;

       hours=(hours<10)?`0${hours}`:hours;
       minutes=(minutes<10)?`0${minutes}`:minutes;
       seconds=(seconds<10)?`0${seconds}`:seconds;
       console.log(hours,minutes,seconds);

       timer.innerText=`${hours}:${minutes}:${seconds}`;

       counter++;
    }
    timerID=setInterval(displayTimer,1000); // We are calling this function display timer for every one second
} 
function stopTimer(){
    clearInterval(timerID);
    timer.innerText="00:00:00";
    timer.style.display="none";
}
