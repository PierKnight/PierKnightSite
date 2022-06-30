
//pixel per second
const SPEED = 800;


function isHookable(element)
{
    return element != null && element != document.body && element != document.documentElement && !element.classList.contains("notHookable");
}


const roadhogImage = document.getElementById("roadhogImage");

//hook handler
document.addEventListener("mousedown",(event) =>
{
    if(event.target == roadhogImage)
        return;
    
    const hookAudio = new Audio(isHookable(event.target) ? 'media/hog/hook_throw_good.mp3' : 'media/hog/hook_throw.mp3');
    hookAudio.volume = 0.5;
    hookAudio.play();


    

    const roadhog = document.getElementById("roadhog");
    

    const hook = document.createElement("div");
    hook.classList.add("hook");
    hook.classList.add("undraggable");

    let hookImage = document.createElement("img");
    hookImage.src = "media/hog/hook.png";
    hook.appendChild(hookImage);
    roadhog.appendChild(hook);

    
    const boxBoundingRect = hook.getBoundingClientRect();
    const boxCenter= {
        x: boxBoundingRect.left + boxBoundingRect.width/2, 
        y: boxBoundingRect.top + boxBoundingRect.height
    };
    const cos = event.clientX - boxCenter.x;
    const sin = - (event.clientY - boxCenter.y);
    const angle = Math.atan2(cos, sin )*(180 / Math.PI);	   
    let distance = Math.sqrt(cos**2 + sin**2);
    hook.style.setProperty("--angle",angle + "deg");
    hook.style.setProperty("--longness",distance + "px");

    console.log(boxBoundingRect.width)

    //140 is the original image width
    //54 is the original image height
    const totalChains = Math.floor(distance / (54 * (boxBoundingRect.width / 140.0)));
    for (var i = 0; i < totalChains; i++) 
    {
        const chain = document.createElement("img");
        chain.src = "media/hog/chain.png";
        hook.appendChild(chain);
    }

    let hitElement = null;

    const oldX = event.clientX;

    hook.addEventListener("animationiteration",(ev) => 
    {  
        let element = document.elementFromPoint(oldX,event.clientY);
            
        if(isHookable(element))
        {
            const copy = element.cloneNode(true);
            copy.classList.add("hookedItem");
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
        console.log("enter");
        
    }
    else
    {
        roadhogDialog.style.opacity = "0";
        roadhogDialog.style.scale = "0";
        roadhogImage.classList.remove("hogJumping");
        console.log("leave");
    }
    
},false);


roadhogImage.addEventListener("click",(event) =>
{
    roadhogImage.classList.add("hogJumping");     
    const audioType = generateRandomNumber(10);
    const audio = new Audio(`media/hog/shittalking/audio${audioType}.mp3`);
    audio.volume = 0.7;
    audio.play();      
    setTimeout(() => {roadhogImage.classList.remove("hogJumping");},560);   
});



