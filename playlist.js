function getPlaylistEntries()
{
      let cacheListString = localStorage.playlists;
      let cacheList = [];
      if(cacheListString)
          cacheList = JSON.parse(cacheListString);
      return cacheList;
}

function saveNewPlaylistEntry(playlistData)
{
    let splitString = playlistData.split(':');
    let playlistName = splitString[0];
    let playlistID = splitString[1];

     let playlistEntries = getPlaylistEntries();
     playlistValue = {"name": playlistName, "id": playlistID};

     playlistEntries.push(playlistValue);
     localStorage.playlists = JSON.stringify(playlistEntries);
}

function removePlaylistEntry(index)
{
  let playlistEntries = getPlaylistEntries();
  playlistEntries.splice(index,1);
  localStorage.playlists = JSON.stringify(playlistEntries);
}

let entries = document.getElementById("playlistEntries");
let selectedEntry;

function clearSelection()
{
 let selected = entries.querySelectorAll('.selected');
 for(let elem of selected) {
       elem.classList.remove('selected');
 }
 selectedEntry = null;
}

function singleSelect(li) {

       clearSelection();
       li.classList.toggle('selected');
       selectedEntry = li;
}


entries.onclick = function clickPlaylistEntry(event)
{
  if (event.target.tagName != "LI") return;
       singleSelect(event.target);
}

body.addEventListener("keyup", ({key}) => {

        if(selectedEntry && key == "Delete")
        {
           removePlaylistEntry(selectedEntry.playlistIndex);
           updatePlaylistEntries();
           selectedEntry = null;
        }

})

function updatePlaylistEntries()
{

  while (entries.firstChild) {
      entries.removeChild(entries.firstChild);
  }

  let playlistEntries = getPlaylistEntries();
  for (let i = 0; i < playlistEntries.length; i++)
  {
    let node = document.createElement("LI");  // Create a <li> node
    node.title = playlistEntries[i].id;
    node.playlistIndex = i;
    let textnode = document.createTextNode(playlistEntries[i].name); // Create a text node
    node.appendChild(textnode);
    entries.appendChild(node); ///append Item
  }
}



const playlistInput = document.getElementById("playlistInput");
const playlistIcon = document.getElementById("playlistIcon");

playlistInput.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
       if(playlistInput.value)
       {
        saveNewPlaylistEntry(playlistInput.value);
        playlistInput.value = "";
        updatePlaylistEntries();
        }

    }
})

playlistIcon.addEventListener("click", () => {

     if(selectedEntry)
     {
           player.stopVideo();
           cuePlaylist(selectedEntry.title);
           clearSelection();
     }
     else
     {
        closeVideoPlayer()
     }


});



