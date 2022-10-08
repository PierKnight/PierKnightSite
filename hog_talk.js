
let overwatchUrl = 'https://ow-api.com/v1/stats/pc/us/OverPier-2472/complete';


//let search = encodeURIComponent("come fare cose da wikipedia?");
//window.location.assign("https://www.google.com/search?q=" + search);

async function postData(url = '') {
  const response = await fetch(url);
  return response.json();
}

function getHighestRank(ranks)
{
      let maxRankLevel = 0;
      let rank;

      for(let i = 0;i < 3;i++)
      {
         let rankLevel = ranks[i].level;
         if(rankLevel > maxRankLevel)
         {
               maxRankLevel = rankLevel;
               rank = ranks[i];
         }
      }
      return rank;
}



let currentIndex = 0;

const hogOwMessages = [
  "Al momento il tuo ruolo più alto è {0} con {1} sr!",
  "Hai Agganciato un totale di {0} persone",
  "Hai giocato ad overwatch per un totale di {0} O.O"
];

//aggiungi il listener a tutte le classi hogTalk

let elements = document.getElementsByClassName("hogTalk");

for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('mouseenter', mouseEnter, false);
    elements[i].addEventListener('mouseleave', mouseLeave, false);
}

const hogText = document.getElementById("hogText");
const hogImage = document.getElementById("hogImage");
const hogCharacter = document.getElementById("hogCharacter");
const hogContent = document.getElementById("hog_content");

let hogStyle = getComputedStyle(hogImage);

hogImage.src = hogStyle.getPropertyValue("--normal-hog");

const owInfo = postData(overwatchUrl);




function mouseEnter(event)
{

 let target = event.target;


 //show textbox
 hogText.style.opacity = 1;
 hogText.style.fontSize = "150%";

 //start hog jump
 hogImage.classList.add('hogHopping');

 if(target.id == "hogCharacter")
 {

    let randomHogMessage = hogOwMessages[currentIndex];

    hogText.innerHTML = ".....";

     owInfo.then(data => {

       let heroes = data.competitiveStats.topHeroes;

       if(currentIndex == 0)
       {
         let rank = data.ratings[0]//getHighestRank(data.ratings);
         let role = rank.role;
         let sr = rank.level;
         hogText.innerHTML = randomHogMessage.replace("{0}",role).replace("{1}",sr);
       }
       else if(currentIndex == 1)
       {
          let totalHooks = data.quickPlayStats.careerStats.roadhog.heroSpecific.enemiesHooked + data.competitiveStats.careerStats.roadhog.heroSpecific.enemiesHooked;
          hogText.innerHTML = randomHogMessage.replace("{0}",totalHooks);
       }
       else
       {
           let timePlayed = data.quickPlayStats.careerStats.allHeroes.game.timePlayed;
           hogText.innerHTML = randomHogMessage.replace("{0}",timePlayed);
       }
       currentIndex++;
            if(currentIndex >= 3)
               currentIndex = 0;
     });

    }
    else
    {
       let message = "Aggiungi --hog-message nel css per poter dare un messaggio!"
       let text = getComputedStyle(target).getPropertyValue("--hog-message");
       if(text)
           message = text;

        hogText.innerHTML = message;
    }

}

function mouseLeave(event)
{
     //hide textbox
     hogText.style.opacity = 0;
     hogText.style.fontSize = "0%";

     //stop hog jump
     hogImage.classList.remove('hogHopping');
}


let divElement = document.createElement("Div");

let hook = document.createElement("img");


hook.alt = "ee";
hook.src = "https://demiart.ru/apple-touch-icon.png";
divElement.appendChild(hook);
divElement.style.position = "fixed";
divElement.id = "hook";
document.getElementsByTagName("body")[0].appendChild(divElement);

document.addEventListener("mousedown",event =>
{
   
   
   divElement.style.display = "inline-block";

   



   let angle = Math.atan2(event.pageX,event.pageY);
   

   

  // divElement.setAttribute("style", "transform: rotate(" + (-angle / Math.PI * 180) + "deg)");

  

   
   
   setTimeout(function(x,y) {
      divElement.setAttribute("style", "transform: translate(" + x + "px," + y + "px)");
      console.log(x);
   
    }, 0,event.pageX,event.pageY);

    setTimeout(function() {
      divElement.setAttribute("style", "transform: translate(0px,0px)");
    }, 200);

   setTimeout(function() {    
      divElement.style.display = "none";
   }, 400);
   

   

});





