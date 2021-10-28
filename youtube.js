
let body = document.getElementsByTagName("BODY")[0];


let player;
let isPlayerReady = false;
let isCuing = true;

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
  hogCharacter.style.bottom = "-10px";
  console.log("Stop");
}


function onPlayerReady(event) {
    isPlayerReady = true;
    updatePlaylistEntries();
}

function onError(event) {

  console.log(event.data);
  if(event.data == 150)
      player.nextVideo();
}


function onPlayerStateChange(event) {

   if(event.data == YT.PlayerState.PLAYING)
   {
      event.target.setSize(300,200);
      hogImage.src = hogStyle.getPropertyValue("--music-hog");
      hogCharacter.style.bottom = "-35px";
      event.target.setLoop(true);
      //event.target.setShuffle(true);
      isCuing = false;
   }
   else if(isCuing && event.data == YT.PlayerState.CUED)
   {
       player.playVideo();
   }
}


function cuePlaylist(playlistID)
{
  player.cuePlaylist({ listType: "playlist",list: playlistID});
  isCuing = true;
}





