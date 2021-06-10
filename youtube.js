

let player;

let isPlayerReady = false;

function onYouTubeIframeAPIReady() {
          player = new YT.Player('player', {
          height: 0,
          width: 0,

          playerVars : {
             loop: 1,
             controls: 1,
             showinfo: 1,
             rel: 0
          },

          events: {
                      'onReady': onPlayerReady,
                      'onStateChange': onPlayerStateChange,
                      'onError': onError
                }
        });
        player.setSize(0,0);
}

function closeVideoPlayer()
{
  player.setSize(0,0);
  player.stopVideo();
  hogImage.src = hogStyle.getPropertyValue("--normal-hog");
   console.log("Stop");
}


function onPlayerReady(event) {
    isPlayerReady = true;
}

function onError(event) {

  console.log(event.data)
  //if(event.data == 150)
  //     player.nextVideo();
}

function onPlayerStateChange(event) {

   if(event.data == YT.PlayerState.PLAYING)
   {
      event.target.setSize(300,300);
      hogImage.src = hogStyle.getPropertyValue("--music-hog");
      event.target.setLoop(true);
   }
   else
   {


   }
}



const playlistInput = document.getElementById("playlistInput");
const playlistIcon = document.getElementById("playlistIcon");

playlistInput.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        localStorage.playlistID = playlistInput.value;
        playlistInput.value = "";
        playlistInput.blur();
    }
})


playlistIcon.addEventListener("click", () => {

   if(isPlayerReady)
   {
   if(player.getPlayerState() != YT.PlayerState.PLAYING)
   {
       player.setShuffle({shufflePlaylist : true});
       player.loadPlaylist({ listType: "playlist",list: localStorage.playlistID});
       setTimeout(setShuffleFunction, 1000);
       console.log("Start");
   }
   else
   {
       closeVideoPlayer()
   }
   }

});


function setShuffleFunction(){
   player.setShuffle(true);
}






