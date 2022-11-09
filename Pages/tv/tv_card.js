const API_KEY_OMDB = "5da20700";
const OMDB_BASE_URL = 'http://www.omdbapi.com/?apikey='+API_KEY_OMDB+'&i=';
const API_KEY_TMDB = '?api_key=60861577c310df46ea9a16c2bcd51716';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const YOUTUBE = 'https://www.youtube.com/embed/';

function search(){
    let input = document.getElementById("search_bar").value;
    if(input === "" || input === null){
      alert("Enter A Name!");
      return false;
    }
    let new_input = input.replace(/\s/g, '%20');
    localStorage.setItem('query', new_input);
    let filename = '../search.html';
    window.location.href = filename;
}

function id_receiver(){
	let tmdb_id = parseInt(localStorage.getItem('tmdb_id'));
	let item_type = localStorage.getItem('item_type');
	details_display(tmdb_id, item_type);
	localStorage.clear();
}

async function details_display(num, type){
	let tmdb_link = TMDB_BASE_URL + type + '/' + num + API_KEY_TMDB + '&language=en-US';
    let trailer_links = TMDB_BASE_URL + type + '/' + num + '/videos' + API_KEY_TMDB + '&language=en-US';

    const SIMILAR = 'https://api.themoviedb.org/3/tv/'+num+'/similar'+API_KEY_TMDB+'&language=en-US&page=1';
	
	let tmdb_link_ids = TMDB_BASE_URL + type + '/' + num + '/external_ids' + API_KEY_TMDB;
	const getting_response_ids = await fetch(tmdb_link_ids);
	const data_response_ids = (await getting_response_ids.json());

	let imdb_id = data_response_ids.imdb_id;

	let omdb_link = OMDB_BASE_URL +  imdb_id;

    const response_tmdb = await fetch(tmdb_link);
    const data_tmdb = (await response_tmdb.json());
    let poster = IMG_URL + data_tmdb.poster_path;

    let creators = ["Unknown"];
    if(!(data_tmdb.created_by.length === 0)){
        creators = [];
        for(i = 0 ; i < data_tmdb.created_by.length ; i++){
            creators.push(data_tmdb.created_by[i].name); 
        }
    }

    let title = data_tmdb.name;
    let network = [];
    let seasons = data_tmdb.number_of_seasons;
    let episodes = data_tmdb.number_of_episodes;
    let overview = data_tmdb.overview;
    let tagline = "No Tagline";
    
    let first = data_tmdb.first_air_date;
    let year = "";
    let status = data_tmdb.status;
    if(status === "Ended"){
        let last = data_tmdb.last_air_date ;
        year = first.substring(0, 4) + ' - ' +last.substring(0, 4);
    }else{
        year = first.substring(0, 4) + " - ";
    }
    if(!(data_tmdb.tagline === "")){
        tagline = data_tmdb.tagline;
    }

    let genre = data_tmdb.genres; 

    for(i = 0 ; i < data_tmdb.networks.length ; i++){
        network.push(data_tmdb.networks[i].name); 
    }
    
    const response_omdb = await fetch(omdb_link);
    const data_omdb = (await response_omdb.json());

    let IMDB = "N/A";
    let Metascore = "N/A";
    let RT = "N/A";
    let actors = "N/A";
    
    if(data_omdb.Response === "False"){
        genre = data_tmdb.type;
        if(overview === ""){
            overview = "Not known at this Moment";
        }
    }
    else{
        genre = data_omdb.Genre;
        IMDB = data_omdb.imdbRating;
        Metascore = data_omdb.Metascore;
        for(i = 0 ; i < data_omdb.Ratings.length ; i++){
            if(data_omdb.Ratings[i].Source === "Rotten Tomatoes"){
                RT = data_omdb.Ratings[i].Value;
            }
        }
        actors = data_omdb.Actors;
        if(overview === ""){
            overview = data_omdb.Plot;
        }
    }

    $("#Genres").html(genre);
    $("#Cast").html(actors);
    $('#IMDB').html(IMDB);
    $('#METASCORE').html(Metascore);
    $('#ROTTENTOMATOES').html(RT);
    $('#Title').html(`${title} (${year})`);
    $('#poster').attr('src', `${poster}`);
    $('#Creators').html(`Created By: ${creators}`);
    $('#Network').html(`Network: ${network}`);
    $('#Overview'). html(overview);
    $('#Episodes').html(`Number of Episodes: ${episodes}`);
    $('#Seasons').html(`Number of Seasons: ${seasons}`);
    $('#Tagline').html(tagline);
    
    const response_trailer = await fetch(trailer_links);
    const data_trailer = (await response_trailer.json()).results; 
    if(data_trailer.length === 0){
        document.getElementById('video').innerHTML = "No Trailers Found";
    }
    else{
        let trailer_only = [];
        for(i = 0 ; i < data_trailer.length ; i++){
            if(data_trailer[i].type === "Trailer"){
                trailer_only.push(data_trailer[i]);
            }
        }
        console.log(trailer_only);
        for(i = 0 ; i < trailer_only.length ; i++){
            let key = trailer_only[i].key;
            let yt_link = YOUTUBE + key;
            let myframe = document.createElement('iframe');
            myframe.setAttribute('src', `${yt_link}`);
            myframe.setAttribute('frameborder', '0');
            myframe.style.width = "560px";
            myframe.style.height = "315px";
            document.getElementById('video').appendChild(myframe);
            document.getElementById('video').innerHTML += '<br>';
        } 
    }
    const response_similar = await fetch(SIMILAR);
    const data_similar = (await response_similar.json()).results; 
    console.log(data_similar);

    const IMG_URL_SIMILAR = 'https://image.tmdb.org/t/p/w300'
    let similar = document.getElementById('similar');
    if(data_similar.length === 0){
        let p = document.createElement('p');
        p.innerHTML = "No Shows Found!";
        similar.appendChild(p);
    }
    else{
        for(i = 0 ; i < 8 ; i++){
            let similar_poster = IMG_URL_SIMILAR + data_similar[i].poster_path;
            let similar_title = data_similar[i].name;
            let similar_id = data_similar[i].id;
            let card = document.createElement('div');
            card.style = "width: 15rem";
            card.className = "card";
            card.setAttribute("onclick", "click_card(this, 'tv')")
            card.setAttribute("id",similar_id);
            card.innerHTML = `<img src="${similar_poster}" class="card-img-top">
            <div class="card-body">
              <p class="card-text">${similar_title}</p>
            </div>`
            similar.appendChild(card);
        }
    }
}

window.onload = id_receiver();

function click_card(ele1, ele2){
    let tmdb_id = parseInt(ele1.id);
    let item_type = ele2;
    localStorage.setItem('tmdb_id', tmdb_id);
    localStorage.setItem('item_type', item_type);
    let filename = '';
    if(ele2 === 'movie'){
      filename = 'movie_card.html';
    }
    else{
      filename = 'tv_card.html';
    }
    window.open(filename);
  }

  var input = document.getElementById("search_bar");
document.addEventListener("keypress", function(e) {
  if (e.which == 10 || e.which == 13) {
    event.preventDefault();
    document.getElementById("seach_btn").click();
  }
});
