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

let selectedAnimeId = -1;
const animeList = [];
let animeIndex = -1;
let punteggio = 0;


videoElement.onloadedmetadata = (event) => {
  console.log(videoElement.duration);
};

function toggleCensor()
{
  $("#banner").toggleClass("hide");
}

function stopGame()
{
  broadcastMessage(`Hai fatto: ${punteggio} su ${animeIndex + 1}!`, 10000);
  punteggio = 0;
  animeIndex = -1;
  $("section#game").toggleClass("hide");
  $("section#hub").toggleClass("hide");
  videoElement.pause();
}

function playNextAnime()
{

  if(animeIndex >= 0)
  {
    console.log("SELECTED: " + selectedAnimeId);
    if(selectedAnimeId === animeList[animeIndex].id)
    {
      punteggio = punteggio + 1;
      broadcastMessage("BRAVO HAI AZZECCATO L'anime", 4000);
    }
    else
      broadcastMessage("NOPE", 4000);
  }

  animeIndex = animeIndex + 1;

  if(animeIndex >= animeList.length) return stopGame();

  const anime = animeList[animeIndex];
  const song = anime.songs[generateRandomNumber(anime.songs.length)];
  videoPlayerSource.type = "video/webm";#song.mimetype;
  videoPlayerSource.src = song.url;
  videoElement.load();  
  if(song.nsfw)
    broadcastMessage("Questa è spicy", 3000);
  if(song.spoiler)
    broadcastMessage("Questa contiene spoiler!", 3000);

}
    
videoElement.onended = (event) => {
  playNextAnime();
};

function populateList(themesJson)
{
  animeList.splice(0,animeList.length);
  selectedAnimeId = -1;
  for(let indexAnime in themesJson.anime)
  {
    const animeID = themesJson.anime[indexAnime].id;
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
      id: animeID,
      songs: songsArray
    });
  }
  $("#skipAnime").prop("disabled",false);
  playNextAnime();

}

function loadAnimes()
{

  const username = $("#anilistInput").first().val();

  if(username.length == 0)
  {
    broadcastMessage("Username vuoto", 2000);
    return;
  }

  broadcastMessage("Cerco gli anime dato utente: " + username);
  $.post("https://graphql.anilist.co", {
      query: anilistQuery,
      variables: {username: username}
  }, (anilistJson) => {
  
      broadcastMessage("Trovato anime, ricerca della canzone..");
      var animeList = anilistJson.data.MediaListCollection.lists[0].entries;
  
      var animeString = "";
  
      for (var index in animeList)
          animeString += animeList[index].mediaId + ",";
      animeString = animeString.slice(0, -1);
      const animethemeQuery = "https://api.animethemes.moe/anime?sort=random&filter[has]=resources&include=animethemes.animethemeentries.videos&filter[site]=Anilist&page[size]=100&page[number]=1&filter[external_id]=" + animeString;
  
      $.get(animethemeQuery, (animethemeJson) => {
        $("section#game").toggleClass("hide");
        $("section#hub").toggleClass("hide");
        broadcastMessage("Che la partita abbia inizio!", 3000);
        populateList(animethemeJson);
      })
      .fail(() => {
          broadcastMessage("Non sono riuscito a prendere l'anime", 2000);
      });

  })
  .fail(() => {
      broadcastMessage("Non ho trovato una lista anime per " + username, 2000);
  });
}

$('.basicAutoComplete').autoComplete({
  formatResult: function (item) {
    return {
      value: item.name,
      text: item.name,
      html: [ 
          item.name 
        ] 
    };
  },
  resolverSettings: {
      url: 'https://api.animethemes.moe/anime?fields[anime]=id,name&page[size]=20&include=animesynonyms'
  },
  events: {
    searchPost: function (resultFromServer) {
        const animeNames = [];
        for(let indexAnime in resultFromServer.anime)
        {
          const anime = resultFromServer.anime[indexAnime];
          animeNames.push({name: anime.name,id: anime.id});
          for(let animeSynIndex in anime.animesynonyms)
              animeNames.push({name: anime.animesynonyms[animeSynIndex].text, id: anime.id});
        }
        return animeNames;
    }
  }
});
$('.basicAutoComplete').on('autocomplete.select', function(evt, item) {
  console.log(item);
  
  selectedAnimeId = item.id;
  console.log("selected: " + selectedAnimeId);
});

