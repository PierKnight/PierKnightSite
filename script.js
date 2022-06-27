
//pixel per second
const SPEED = 800;

document.addEventListener("click",(event) =>
{
    const hook = document.createElement("div");
    hook.classList.add("hook");
    hook.classList.add("undraggable");
    document.body.appendChild(hook);


    let hookImage = document.createElement("img");
    hookImage.src = "hook.png";

    hook.appendChild(hookImage);

    const boxBoundingRect = hook.getBoundingClientRect();
    const boxCenter= {
        x: boxBoundingRect.left + boxBoundingRect.width/2, 
        y: document.documentElement.clientHeight - 30
    };
    const cos = event.clientX - boxCenter.x;
    const sin = - (event.clientY - boxCenter.y);
    const angle = Math.atan2(cos, sin )*(180 / Math.PI);	   
    let distance = Math.sqrt(cos**2 + sin**2);
    hook.style.setProperty("--angle",angle + "deg");
    hook.style.setProperty("--longness",distance + "px");


    for (var i = 0; i < Math.floor(distance / (54 * (40.0 / 140.0))); i++) 
    {
        const chain = document.createElement("img");
        chain.src = "chain.png";
        hook.appendChild(chain);
    }

    const audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
    //audio.play();


    let hitElement;

    const oldX = event.clientX;

    hook.addEventListener("animationiteration",(ev) => 
    {  
        hitElement = document.elementFromPoint(oldX,event.clientY);
            
        if(hitElement != document.body && hitElement != document.documentElement)
        {
            const copy = hitElement.cloneNode(true);
            copy.classList.add("hookedItem");
            hook.appendChild(copy);
            hitElement.style.visibility = "hidden";
            audio.pause();
        }
        
    });

    hook.addEventListener("animationend",(ev) => 
    {
        ev.target.parentNode.removeChild(hook);
        hitElement.style.visibility = "";
    });


    
    
    
    
    
},false);



