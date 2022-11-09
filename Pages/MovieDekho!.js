const API_KEY_SEARCH = "5da20700";
const URL_SEARCH = "http://www.omdbapi.com/?apikey="+API_KEY_SEARCH+"&s=";

function search(){
    let input = document.getElementById("search_bar").value;
    if(input === "" || input === null){
      alert("Enter A Name!");
      return false;
    }
    let new_input = input.replace(/\s/g, '%20');
    localStorage.setItem('query', new_input);
    let filename = 'search.html';
    window.location.href = filename;
}

function Display(data) {
    let display = document.getElementById('content');

    var Title = data.Title;
    var year = data.Year;

    var details = "<b>" + Title + "</b>" + " (" + year + ")";

    var poster = data.Poster;
    let image = document.createElement("img");
    image.src = poster;

    var tbl = document.createElement('table');
    tbl.style = "border: 1px solid black; border-collapse: collapse;"

    var row1 = tbl.insertRow(0);
    var cell1 = row1.insertCell(0);
    cell1.innerHTML = details;

    var row2 = tbl.insertRow(1);
    var cell2 = row2.insertCell(0);
    cell2.appendChild(image);

    display.appendChild(tbl);
}


const TRENDING_API_KEY = 'api_key=60861577c310df46ea9a16c2bcd51716';
const BASE_URL = 'https://api.themoviedb.org/3';
const TRENDING_MOVIES_API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+TRENDING_API_KEY;
const TRENDING_TELEVISION_API_URL = BASE_URL + '/discover/tv?sort_by=popularity.desc&'+TRENDING_API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

async function movie() {
    
    // Storing response
    const response = await fetch(TRENDING_MOVIES_API_URL);

    // Storing data in form of JSON
    var data = (await response.json()).results;

    data.forEach(dis_movie);
}

function dis_movie(element){
    const movie_genres = [{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}];

    var poster = IMG_URL + element.poster_path;
    var image = document.createElement('img');
    image.src = poster;
    image.className = "img-fluid";

    var genre_ids = element.genre_ids;
    var genres_final = [];
    for(i = 0 ; i < 19 ; i++){    
        for(j = 0 ; j < genre_ids.length ; j++){
            if(genre_ids[j] === movie_genres[i].id){
                genres_final.push(movie_genres[i].name);
            }
        }
    }
    var title = element.title;
    var rating = element.vote_average;
    var overview = element.overview;
    var title_id = element.id;

    var col = document.createElement('div');
    col.setAttribute('class', 'col');
    col.innerHTML = `<div class="card mb-3" style="max-width: 540px; max-height: " id=${title_id} onclick="click_card(this, 'movie')">
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${poster}" class="img-fluid" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${title} (${rating})</h5>
          <p class="card-text" id="synopsis">${overview}</p>
          <div class="card-footer">
            <small class="text-muted">Genre: ${genres_final}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
   
  document.getElementById('movie-content').appendChild(col);

}

movie();

async function televison(){
    const response2 = await fetch(TRENDING_TELEVISION_API_URL);
    var data2 = (await response2.json()).results;
    data2.forEach(dis_tv);
}

function dis_tv(info){
    const tv_genres = [{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}];

    var poster2 = IMG_URL + info.poster_path;
    var image2 = document.createElement('img');
    image2.src = poster2;
    image2.className = "img-fluid";
    
    var genre_ids2 = info.genre_ids;
    
    var genres_final2 = [];
    for(k = 0 ; k < 16 ; k++){
        for(l = 0 ; l < genre_ids2.length ; l++){
            if(genre_ids2[l] === tv_genres[k].id){
                genres_final2.push(tv_genres[k].name);
            }
        }
    }
    
    var title2 = info.name;
    var title2_id = info.id;    
    var rating2 = info.vote_average;
    var overview2 = info.overview;

    var col2 = document.createElement('div');
    col2.setAttribute('class', 'col');
    col2.innerHTML = `<div class="card mb-3" style="max-width: 540px;" id=${title2_id} onclick="click_card(this, 'tv')">
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${poster2}" class="img-fluid" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${title2} (${rating2})</h5>
          <p class="card-text" id="synopsis">${overview2}</p>
          <div class="card-footer">
            <small class="text-muted">Genre: ${genres_final2}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
   
   document.getElementById('tv-content').appendChild(col2);

}

televison();

function click_card(ele1, ele2){
  let tmdb_id = parseInt(ele1.id);
  let item_type = ele2;
  localStorage.setItem('tmdb_id', tmdb_id);
  localStorage.setItem('item_type', item_type);
  let filename = '';
  if(ele2 === 'movie'){
    filename = './movies/movie_card.html';
  }
  else{
    filename = './tv/tv_card.html';
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
