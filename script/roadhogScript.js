
// ------------------------AUDIO SETTING---------------------------
const audioButton = document.getElementById("audioButton");
var audioValue = localStorage.getItem("audioSetting");
const audioArray = [];

function isAudioOn()
{
    return audioValue === "on";
}

function setAudioEnabled(enabled)
{
    const enabledS = enabled ? "on" : "off";
    localStorage.setItem("audioSetting",enabledS);
    audioValue = enabledS;

    audioArray.forEach((a) => a.muted = !enabled);
}

if(!audioValue) //se è la prima volta default on
    setAudioEnabled(true);

if(isAudioOn())
    audioButton.classList.add("on");

audioButton.addEventListener("click",(event) =>
{
    audioButton.classList.toggle("on");
    setAudioEnabled(!isAudioOn());
});





function playAudio(audio)
{
    audio.muted = !isAudioOn();
    audio.play();
    audioArray.push(audio);
    audio.addEventListener("ended",(event) => audioArray.filter((a) => a == audio));
    return audio;
}


// -------------------------END----------------------------------------


function isHookable(element)
{
    return element != null && element != document.body && element != document.documentElement && !element.classList.contains("hookable");
}


//the roadhog image itself
const roadhogImage = document.getElementById("roadhogImage");
//the section with image and audio button
const roadhogSection = document.querySelector(".roadhogEntitySection");

//hook handler
document.addEventListener("mousedown",(event) =>
{
    if(event.target == roadhogImage)
        return;
    
    const hookAudio = new Audio(isHookable(event.target) ? 'media/hog/hook_throw_good.mp3' : 'media/hog/hook_throw.mp3');
    hookAudio.volume = 0.5;
    playAudio(hookAudio);

    const hook = document.createElement("div");
    hook.classList.add("hook");
    hook.classList.add("undraggable");

    const hookImage = document.createElement("img");
    hookImage.src = "media/hog/hook.png";
    hook.appendChild(hookImage);

    const chainImage = document.createElement("div");
    chainImage.classList.add("chain");
    hook.appendChild(chainImage);

    roadhogSection.appendChild(hook);

    
    const boxBoundingRect = hook.getBoundingClientRect();
    const boxCenter= {
        x: boxBoundingRect.left + boxBoundingRect.width/2, 
        y: boxBoundingRect.top + boxBoundingRect.height
    };
    const cos = event.clientX - boxCenter.x;
    const sin = - (event.clientY - boxCenter.y);
    const angle = Math.atan2(cos, sin );	   
    let distance = Math.sqrt(cos**2 + sin**2) - hookImage.height / 2;

    hook.style.setProperty("--angle",angle + "rad");
    chainImage.style.setProperty("--longness",distance + "px");

    let hitElement = null;

    const oldX = event.clientX;

    hook.addEventListener("animationiteration",(ev) => 
    {  
        let element = document.elementFromPoint(oldX,event.clientY);
            
        if(isHookable(element))
        {
            const copy = element.cloneNode(true);  
            const hitBox = element.getBoundingClientRect();

            copy.classList.add("hookedItem");     
            copy.style.width = hitBox.width + "px";
            copy.style.height = hitBox.height + "px";
            //copy.style.left = -(event.clientX - hitBox.x) + "px";
            //copy.style.top = -(event.clientY - hitBox.y) + "px";
            copy.style.left = -(hitBox.width / 2) + "px";
            copy.style.top = "0px";
            hook.appendChild(copy);
            element.style.visibility = "hidden";
            
            hitElement = element;
        }
        
    });

    hook.addEventListener("animationend",(ev) => 
    {    
        hook.parentNode.removeChild(hook);
        if(hitElement != null)
            hitElement.style.visibility = "";
    });
    
},false);


//roadhog talk hander
const roadhogDialog = document.getElementById("hogDialog");
   
document.addEventListener("mouseover",(event) =>
{
    const message = event.target.getAttribute("hogMessage");
    if(message)
    {

        roadhogDialog.innerHTML = message;
        roadhogDialog.style.opacity = "1";
        roadhogDialog.style.scale = "1";
        roadhogImage.classList.add("hogJumping");
        
    }
    else
    {
        roadhogDialog.style.opacity = "0";
        roadhogDialog.style.scale = "0";
        roadhogImage.classList.remove("hogJumping");
    }
    
},false);


//say random voice
roadhogImage.addEventListener("click",(event) =>
{
    
    roadhogImage.classList.remove("hogJumping");   
    roadhogImage.offsetLeft; //reflow the image
    roadhogImage.classList.add("hogJumping");     
    const audioType = generateRandomNumber(10);
    const audio = new Audio(`media/hog/shittalking/audio${audioType}.mp3`);
    audio.volume = 0.7;
    playAudio(audio);  //play audio audio :E    

});


