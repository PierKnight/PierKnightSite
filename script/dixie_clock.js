
const loopClockId = setInterval(updateClock,10);
const clockBulbs = document.querySelectorAll(".bulb");
var steinsGateMode = false;
var song = null;

var instableBulbs = 0;

for(const bulb of clockBulbs)
{
   
   bulb.addEventListener("click",(event) =>
   {
      instableBulbs += bulb.classList.toggle("instable") ? 1 : -1;
      steinsGateMode = instableBulbs >= 8;
      document.body.style.backgroundImage = steinsGateMode ? "url(media/background/gate.jpg)" : "";

      if(steinsGateMode)
      {
         if(!song)
         {
            song = new Audio("https://v.animethemes.moe/SteinsGate-OP1.webm");
            song.loop = true;
         }
         song.play();
      }
      else if(song)
         song.pause();
   });
}


updateClock();

//aggiorna orologio
function updateClock()
{
    const date = new Date();
    setTime(date.getSeconds(),0);
    setTime(date.getMinutes(),1);
    setTime(date.getHours(),2);
}

//imposta il numero per l'immagine singola
function setTime(time,type)
{
     const bulb_1 = clockBulbs[type * 3];
     const bulb_2 = clockBulbs[type * 3 + 1];

     var digit1 = time % 10;
     var digit2 = Math.floor(time / 10);

     
     if(steinsGateMode)
     {
        digit1 = generateRandomNumber(10);
        digit2 = generateRandomNumber(10);
     }
     
     bulb_1.src = "media/clock/bulb_" + digit1 +  ".png";
     bulb_2.src = "media/clock/bulb_" + digit2 +  ".png";
}

function stopClock()
{
   clearInterval(loopClockId);
}





