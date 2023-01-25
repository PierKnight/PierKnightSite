const anilistQuery = `
query ($username: String) 
{
  MediaListCollection(type: ANIME userName: $username status: COMPLETED)
  {
    lists{
      entries{
        mediaId
      }
    }
  }
}
`;




const videoElement = document.getElementById("animeplayer");
const videoPlayerSource = document.querySelector("#animeplayer source");
const search = document.getElementById("search");

let searchTimeout;
search.addEventListener('input', (value) =>
{
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    console.log(search.value);

    $.get("https://api.animethemes.moe/anime?fields[anime]=id,name&page[size]=20&q=" + search.value, (result) => {
      broadcastMessage(result, 2000);
    }).fail(() => {
      broadcastMessage("Ricerca Fallita", 2000);
    });

  }, 500);
});

$('.basicAutoComplete').autoComplete({
  resolverSettings: {
      url: 'https://api.animethemes.moe/anime?fields[anime]=id,name&page[size]=20'
  },
  events: {
    searchPost: function (resultFromServer) {
        const animeNames = [];
        for(let indexAnime in resultFromServer.anime)
          animeNames.push(resultFromServer.anime[indexAnime].name);
        return animeNames;
    }
  }
});


videoElement.onloadedmetadata = (event) => {
  console.log(videoElement.duration);
  //videoElement.currentTime = videoElement.duration / 2;
};

console.log(videoPlayerSource);

function populateList(themesJson)
{
    const animeList = [];
    for(let indexAnime in themesJson.anime)
    {
      const animeName = themesJson.anime[indexAnime].name;
      const animeThemes = themesJson.anime[indexAnime].animethemes;

      const songsArray = [];
      for(let indexThemes in animeThemes)
      {
        const type = animeThemes[indexThemes].type;
      

        const entries = animeThemes[indexThemes].animethemeentries;
        for(let entriesIndex in entries)
        {
          const songEntry = entries[entriesIndex];
          const nsfw = songEntry.nsfw;
          const spoiler = songEntry.spoiler;
          const version = songEntry.version;


          const videos = entries[entriesIndex].videos;
          for(var videoIndex in videos)
          {
            const url = videos[videoIndex].link;
            const mimetype = videos[videoIndex].mimetype;
            
            songsArray.push({
              type: type,
              nsfw: nsfw,
              spoiler: spoiler,
              version: version,
              url: url,
              mimetype: mimetype
            });
          }
          
        }

      }

      animeList.push({
        animeName: animeName,
        songs: songsArray
      });
    }


    
    
    
    broadcastMessage("Ascolta: " + animeList[0].animeName, 2000);

    
    const song = animeList[0].songs[generateRandomNumber(animeList[0].songs.length)];
    videoPlayerSource.type = song.mimetype;
    videoPlayerSource.src = song.url;
    

    videoElement.load();
    
}

function loadAnimes(username)
{
    broadcastMessage("Cerco gli anime dato utente: " + username, 2000);
    $.post("https://graphql.anilist.co", {
        query: anilistQuery,
        variables: {username: username}
    }, (anilistJson) => {
    
        broadcastMessage("Trovato anime, ricerca della canzone..", 2000);
        var animeList = anilistJson.data.MediaListCollection.lists[0].entries;
    
        var animeString = "";
    
        for (var index in animeList)
            animeString += animeList[index].mediaId + ",";
        animeString = animeString.slice(0, -1);
        const animethemeQuery = "https://api.animethemes.moe/anime?sort=random&filter[has]=resources&include=animethemes.animethemeentries.videos&filter[site]=Anilist&page[size]=100&page[number]=1&filter[external_id]=" + animeString;
    
        $.get(animethemeQuery, (animethemeJson) => {

            populateList(animethemeJson);
        })
        .fail(() => {
            broadcastMessage("Non sono riuscito a prendere l'anime :C", 2000);
        });

    })
    .fail(() => {
        broadcastMessage("Non sono riuscito a prendere l'anime :C", 2000);
    });
}

