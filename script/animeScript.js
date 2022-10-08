


const anilistQuery = `
query ($username: String) 
{ # Define which variables will be used in the query (id)
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

const anilistUrl = `https:graphql.anilist.co`;

async function getAnilistAnimes(username)
{
    const variables = {
        username: username
    }
    const options = 
    {
        method: `POST`,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: anilistQuery,
            variables: variables
        })  
    };

    const anilistResponse = await fetch(anilistUrl, options).catch((err) => console.log(err.message));
    const anilistJson = await anilistResponse.json();

    var animeList = anilistJson.data.MediaListCollection.lists[0].entries;

    var animeString = "";

    for (var index in animeList)
        animeString += animeList[index].mediaId + ",";
    animeString = animeString.slice(0, -1);
    return "https://staging.animethemes.moe/api/anime?sort=random&filter[has]=resources&include=animethemes.animethemeentries.videos&filter[site]=Anilist&page[size]=100&page[number]=1&filter[external_id]=" + animeString;
}

const animeDiv = document.querySelector(".animeContainer");

async function populateList(animeThemesUrl)
{
    const animeSongList = [];
    const themesResponse = await fetch(animeThemesUrl);
    const themesJson = await themesResponse.json();
    for(let indexAnime in themesJson.anime)
    {
      const animeName = themesJson.anime[indexAnime].name;
      const animeThemes = themesJson.anime[indexAnime].animethemes;
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
            
            animeSongList.push({
              animeName: animeName,
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
    }
    return animeSongList;
    
}




let eee = getAnilistAnimes("pierknight");


const audioPlayer = document.getElementById("audioElement");
const audioPlayerElement = audioPlayer.childNodes[1];
var animeIndex = -1;
var animeSongList = [];


function nextSong()
{
  animeIndex++;
  audioPlayerElement.src = animeSongList[animeIndex].url;
  audioPlayerElement.play();
}

audioPlayerElement.addEventListener("ended",(event) => 
{
  nextSong();
});

eee.then(ele => {
    populateList(ele).then(list =>
    { 
      animeSongList = list;
      nextSong();
    })
});

