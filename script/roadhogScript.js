
const SoundType = {
    Hook: 0,
    Roadhog: 1,
    Other: 2
}

// ------------------------AUDIO SETTING---------------------------
let volumes = [];
for(let s in SoundType)
{
    volumes[SoundType[s]] = getOrDefaultStorage("volume" + SoundType[s], 0.7);
    $("#volume" + SoundType[s]).val(volumes[SoundType[s]]);
}
const audioArray = [];


function setSoundVolume(volume, soundType)
{
    volume = parseFloat(volume);
    console.log(volume);
    localStorage.setItem("volume" + soundType, volume);
    volumes[soundType] = volume;
    audioArray.forEach((a) => {if(a.soundType === soundType) a.volume = volume});
}

function playAudio(audio, soundType)
{
    audio.volume = volumes[soundType];
    audio.soundType = soundType;
    audio.play();
    audioArray.push(audio);
    audio.addEventListener("ended",() => audioArray.filter((a) => a == audio));
    return audio;
}


// -------------------------END----------------------------------------


function isHookable(element)
{
    return element != null && element != document.body && element != document.documentElement && element.getAttribute("hookable");
}




//the roadhog image itself
let roadhogImage;
//the section with image and audio button
let roadhogSection;
//roadhog talk hander
let roadhogDialog;

$.get("https://raw.githubusercontent.com/PierKnight/pierknight.github.io/newSite/roadhog.html", (roadhogHtml) => {
    let roadhogElement = document.createElement("section");
    roadhogElement.innerHTML = roadhogHtml;

    document.body.appendChild(roadhogElement);
    roadhogImage = document.getElementById("roadhogImage");
    roadhogSection = document.querySelector(".roadhogEntitySection");
    roadhogDialog = document.getElementById("hogDialog");
    console.log(roadhogSection);


    //say random voice
    roadhogImage.addEventListener("click",(event) =>
    {
        jump(); 
        const audioType = generateRandomNumber(10);
        const audio = new Audio(`media/hog/shittalking/audio${audioType}.mp3`);
        playAudio(audio, SoundType.Roadhog);  //play audio audio :E    

    });
});

//hook handler
document.addEventListener("mousedown",(event) =>
{
    if(event.target == roadhogImage)
        return;

    const hookAudio = new Audio(isHookable(event.target) ? 'media/hog/hook_throw_good.mp3' : 'media/hog/hook_throw.mp3');
    playAudio(hookAudio, SoundType.Hook);

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




function jump()
{
    if(roadhogImage === undefined) return;
    roadhogImage.classList.remove("hogJumping");   
    roadhogImage.offsetLeft;
    roadhogImage.classList.add("hogJumping");
}


let oldMessageInterval;   
function broadcastMessage(message, time)
{
    if(!roadhogDialog) return;

    clearTimeout(oldMessageInterval);
    jump();
    console.log(message);
    roadhogDialog.innerHTML = message;
    roadhogDialog.style.opacity = "1";
    roadhogDialog.style.scale = "1";

    if(time === undefined)
        return;
    
    oldMessageInterval = setTimeout(() => {
        stopMessage();
    }, time);
}

function stopMessage()
{
    roadhogDialog.style.opacity = "0";
    roadhogDialog.style.scale = "0";
    roadhogImage.classList.remove("hogJumping");
    oldMessageInterval = undefined;
}

broadcastMessage("Benvenuto nella pagina Principale!", 2000);



document.addEventListener("mouseover",(event) =>
{
    const closestMessage = event.target.closest("*[hogMessage]");

    if(closestMessage !== null)
    {
        const message = closestMessage.getAttribute("hogMessage");
        broadcastMessage(message);
    }
    else
        stopMessage();
    
},false);


window.oncontextmenu = function(event) {

    const closestMessage = event.target.closest("*[hogMessage]");
    if(closestMessage !== null)
    {
        const message = closestMessage.getAttribute("hogMessage");
        if(message)
            broadcastMessage(message, 1000);
    }
    
    return true;
};




