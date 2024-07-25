let playpose1 = document.getElementById("play");
let playpose2 = document.getElementById("pause");
//play pause function
function playaudio() {
  nowplayingsong.play();
  playpose1.classList.toggle("hidden");
  playpose2.classList.toggle("hidden");
}
function pauseaudio() {
  nowplayingsong.pause();
  playpose1.classList.toggle("hidden");
  playpose2.classList.toggle("hidden");
}
document.title = "Spotify - Web Player: Music for everyone"
let sol;
let list = [];
var audio;
let final;
let final_length;
let nowplayingsong = new Audio();
let currfolder;

async function getsongs(folder) {
  currfolder = folder;


  list = [];
  let a = await fetch(`http://127.0.0.1:3000/spotify/${currfolder}`);
  let response = await a.text();
  let data = document.createElement("div");
  data.innerHTML = response;
  sol = data.getElementsByTagName("a");
  for (let index = 0; index < sol.length; index++) {
    const element = sol[index];
    if (element.href.endsWith(".mp3")) {
      list.push(element.href.split(`/songs/${folder}/`)[0]);
    }
  }
  final = list;
  final_length = final.length;

  nowplayingsong.src = final[0];
  let final2nd = final[0].split("/").slice(-1);
  document.querySelector(".songinformation").innerHTML = final2nd[0].replaceAll("%20", " ").replace(".mp3", "").replace("_", " ");
  let songslist = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songslist.innerHTML = "";
  for (let i = 0; i < final.length; i++) {
    let song = final[i].split("/").slice(-1)[0];
    let songdata = song.replaceAll("%20", " ").replace(".mp3", ".");
    songslist.innerHTML = songslist.innerHTML + ` <li> <div Class="flex gap"><img src="spotify/img/music.svg" Class="invert" alt="">
    <div class="songinfo flex "><div class="songname">${songdata.split("_")[0]}</div><div class="artist">${songdata.split("_")[1]}</div></div></div>
<img src="spotify/img/playnow.png" class="invert nowplaying" style="width: 25px; height: 25px;" alt=""></li> `;
  }
  //attach an event listener to each song;
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      current_song = (e.getElementsByTagName("div")[1].firstElementChild.innerHTML + "_" + e.getElementsByTagName("div")[1].getElementsByTagName("div")[1].innerHTML);
      let songname = current_song.replaceAll(" ", "%20").replace(".", ".mp3");
      playmusic(songname);
      playpose1.classList.add("hidden");
      playpose2.classList.remove("hidden");
    }
    )
  }
  )
}

const playmusic = (sname) => {
    nowplayingsong.src = `/spotify${currfolder}` + `/${sname}`;
  
  playpose1.classList.toggle("hidden");
  playpose2.classList.toggle("hidden");
  document.querySelector(".songinformation").innerHTML = sname.replaceAll("%20", " ").replace(".mp3", "").replace("_", " ");
  nowplayingsong.play();
}
async function load() {
  let cardcontainer = document.querySelector(".card-container");
  let a = await fetch(`http://127.0.0.1:3000/spotify/songs/`);
  let response = await a.text();
  let data = document.createElement("div");
  data.innerHTML = response;


  let anchor = data.getElementsByTagName("a");
  let array = Array.from(anchor);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("http://127.0.0.1:3000/spotify/songs/") && !e.href.includes(".htaccess")) {
      let folderdata = e.href.split("/").slice(-2)[0];
      let a = await fetch(`http://127.0.0.1:3000/spotify/songs/${folderdata}/info.json`);
      let response = await a.json();
      cardcontainer.innerHTML = cardcontainer.innerHTML + `<div  class="card-body ">
   <div data-folder="${folderdata}" class="card p1">
       <div class="play flex align-center justify-center"><img src="spotify/img/play.svg"></div>
       <img src="http://127.0.0.1:3000/spotify/songs/${folderdata}/cover.jpeg" alt="">
       <h3>${response.title}</h3>
       <p>${response.description}</p>
   </div>
</div>`;
    }
    //adding folder
    let listfolder = document.getElementsByClassName("card");
    for (let e1 = 0; e1 < listfolder.length; e1++) {
      const element = listfolder[e1];
      element.addEventListener("click", async (item) => {
        final = await getsongs(`/songs/${element.dataset.folder}`);
      }
      )
    }


  }

}

async function main() {
  nowplayingsong.addEventListener("timeupdate", () => {
    let currenttime_min = Math.floor(nowplayingsong.currentTime / 60);
    let currenttime_sec = Math.floor(nowplayingsong.currentTime % 60);

    let totaltime_min = Math.floor(nowplayingsong.duration / 60);
    let totaltime_sec = Math.floor(nowplayingsong.duration % 60);

    document.querySelector(".songtime").innerHTML = `${currenttime_min}:${currenttime_sec}/${totaltime_min}:${totaltime_sec}`;

    let progressPercentage = (nowplayingsong.currentTime / nowplayingsong.duration) * 100;
    document.querySelector(".circle").style.left = progressPercentage + "%";
  });
  // let current_song;
  await getsongs(`songs/Nimrat/`);
  playpose1.addEventListener("click", () => {
    playaudio();
  }
  )
  playpose2.addEventListener("click", () => {
    pauseaudio();
  }
  )
  //loading albums
  load();
  //making seekbar functional
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    nowplayingsong.currentTime = nowplayingsong.duration * ((e.offsetX / e.target.getBoundingClientRect().width));
  }
  )

  let hamburger = (document.getElementById("hamburgerimg"));
  let cross = document.getElementById("cross");

  hamburger.addEventListener("click", () => {
    (document.getElementById("left").style.left = "0px");
    document.querySelector(".hamburger").style.left = "65vw";
    hamburger.style.display = "none";
    cross.style.display = "block";
  }
  )
  cross.addEventListener("click", () => {
    document.getElementById("left").style.left = "-100%"
    document.querySelector(".hamburger").style.left = "initial";
    hamburger.style.display = "block";
    cross.style.display = "none";
  }
  )
  //next an dprevious btns
  next.addEventListener("click", async () => {
    let a = await fetch(`http://127.0.0.1:3000/spotify/${currfolder}`);
    let response = await a.text();
    let data = document.createElement("div");
    data.innerHTML = response;
    let findsong = [];
    let mainindex = -1;
    for (var i = 0; i < data.getElementsByTagName("a").length; i++) {
      if (data.getElementsByTagName("a")[i].href.endsWith(".mp3"))
        findsong.push(data.getElementsByTagName("a")[i].href);
    }
    for (let index = 0; index < findsong.length; index++) {
      const element = findsong[index];
      if (nowplayingsong.src.split("/").slice(-1)[0] == findsong[index].split("/").slice(-1)[0] && index <= findsong.length) {
        mainindex = index;
      }
    }
    if (mainindex < findsong.length - 1) {
      playmusic(findsong[mainindex + 1].split("/").slice(-1)[0]);
      playpose1.classList.add("hidden");
      playpose2.classList.remove("hidden");
    }
    else {
      nowplayingsong.currentTime = nowplayingsong.duration;
    }
  }
  )
  previous.addEventListener("click", async() => {
    let a = await fetch(`http://127.0.0.1:3000/spotify/${currfolder}`);
  let response = await a.text();
  let data = document.createElement("div");
  data.innerHTML = response;
  let findsong = [];
  let mainindex = -1;
  for (var i = 0; i < data.getElementsByTagName("a").length; i++) {
    if (data.getElementsByTagName("a")[i].href.endsWith(".mp3"))
      findsong.push(data.getElementsByTagName("a")[i].href);
  }
  for (let index = 0; index < findsong.length; index++) {
    const element = findsong[index];
    if (nowplayingsong.src.split("/").slice(-1)[0] == findsong[index].split("/").slice(-1)[0] && index <= findsong.length) {
      mainindex = index;
    }
  }
    if (mainindex > 0) {
      playmusic(findsong[mainindex - 1].split("/").slice(-1)[0]);
      playpose1.classList.add("hidden");
      playpose2.classList.remove("hidden");
    }
    else {
      nowplayingsong.currentTime = 0;
    }
  }
  )
  //setting up the pervious btn
  previous.addEventListener("click", () => {
    let index;

    for (let i = 0; i < final_length; i++) {
      const element = final[i];
      if (element.split("/").slice(-1)[0] == `${nowplayingsong.src.split("/").slice(-1)[0]}`) {
        index = i;
      }
    }
    if (index <= 0) {
      nowplayingsong.currentTime = 0;
      playmusic(final[0].split("/").slice(-1)[0]);
    }
    else {
      playmusic(final[index - 1].split("/").slice(-1)[0]);
      playpose1.classList.add("hidden");
      playpose2.classList.remove("hidden");
    }
  }
  )
  //setting up volume bar
  range.addEventListener("change", (e) => {
    nowplayingsong.volume = (e.target.value) / 100;
  }
  )
  // Array.from(document.getElementsByClassName("card")).forEach(e => {
  // });
  volup.addEventListener("click", () => {
    nowplayingsong.volume = 0;
    volup.classList.toggle("hidden");
    mute.classList.toggle("hidden");
  }
  )
  mute.addEventListener("click", () => {
    nowplayingsong.volume = range.value / 100;
    volup.classList.toggle("hidden");
    mute.classList.toggle("hidden");
  }
  )
}
main();