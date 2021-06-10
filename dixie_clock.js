let loopClockId = setInterval(updateClock,1,0)


let clock = document.getElementById("clock");

clock.addEventListener("mouseup",resetClock);
clock.addEventListener("mousedown",mouseDownClock);
clock.addEventListener("mouseleave",resetClock);

let steinsGateMode = false;

//aggiorna orologio
function updateClock()
{
    let date = new Date();


    setTime("second",date.getSeconds(),2);
    setTime("minute",date.getMinutes(),1);
    setTime("hour",date.getHours(),0);
}




//imposta il numero per l'immagine singola
function setTime(name,time, index)
{
     let bulb_1 = document.getElementById('bulb_dot_' + name  + 1);
     let bulb_2 = document.getElementById('bulb_dot_' + name + 2);


     let digit1 = time % 10;
     let digit2 = Math.floor(time / 10);

     if(steinsGateMode)
     {
        digit1 = Math.floor(Math.random() * 10);
        digit2 = Math.floor(Math.random() * 10);
     }

     bulb_1.src = "media/clock/bulb_" + digit1 +  ".png"
     bulb_2.src = "media/clock/bulb_" + digit2 +  ".png"
}



//chicca per cambiare background e far partire il player youtube
function switchSteinsGateMode()
{

  steinsGateMode = !steinsGateMode;

  let style = getComputedStyle(body);
  let song = ["oJKXKL41EVI"];
  if(steinsGateMode)
  {
     body.style.backgroundImage = style.getPropertyValue("--gate_background");
     player.loadPlaylist(song);
  }
  else
  {
     body.style.backgroundImage = style.getPropertyValue("--default_background");
     closeVideoPlayer();
  }
}

let holdIntervalID;

function mouseDownClock(event)
{

   if(steinsGateMode)
         switchSteinsGateMode();
   if(!holdIntervalID)
   {
     holdIntervalID = setTimeout(function() {
         switchSteinsGateMode();
     }, 3000);
   }
}

function resetClock(event)
{
   clearInterval(holdIntervalID);
   holdIntervalID = null;
}





