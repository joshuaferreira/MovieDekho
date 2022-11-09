const API_KEY_TMDB = '?api_key=60861577c310df46ea9a16c2bcd51716';
const URL_TMDB = 'https://api.themoviedb.org/3/search/multi'+ API_KEY_TMDB +'&language=en-US&query=';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const movie_genres = [{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}];
const tv_genres = [{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}];

function url_receiver(){
    let query = localStorage.getItem('query');
	let search_url = URL_TMDB + query + '&page=1';
    getStuff(search_url);
    localStorage.clear();
}

function search(){
	let input = document.getElementById("search_bar").value;
    if(input === "" || input === null){
        alert("Enter A Name!");
        return false;
      }
	let new_input = input.replace(/\s/g, '%20');
	console.log(new_input);
	localStorage.setItem('query', new_input);
    let filename = 'search.html';
    window.location.href = filename;
}

async function getStuff(url) {
    let display = document.getElementById('content');
    const resp = await fetch(url);
    const respData = await resp.json();
	const results = respData.results;

	if(results.length === 0){
		display.innerHTML = "<h2>No Results Found</h2>"
	}

	else{
		display.innerHTML = "<h1>Search Results</h1>"
        results.forEach(Display);
	}

	console.log(results); 
}

function Display(data) {
	let display = document.getElementById('content');
	let type = data.media_type;

	let title = "Unknown"
	let overview = "Not known at this moment!" ;
	let genres = ["Unknown"];
    let year = "Unknown";
	if(type === 'tv'){
		title = data.name;
		let genre_ids = data.genre_ids;
		if(genre_ids.length !== 0){
			genres = [];
			genre_ids.forEach(element => {
				for(i = 0 ; i < tv_genres.length ; i++){
					if(element == tv_genres[i].id){
						genres.push(tv_genres[i].name);
					}
				}
			});
		}
        year = data.first_air_date.substring(0, 4);
	}
	else if(type === 'movie'){
		title = data.title;
		let genre_ids = data.genre_ids;
		if(genre_ids.length !== 0){
			genres = [];
			genre_ids.forEach(element => {
				for(i = 0 ; i < movie_genres.length ; i++){
					if(element == movie_genres[i].id){
						genres.push(movie_genres[i].name);
					}
				}
			});
		}
        year = data.release_date.substring(0, 4);
	}
	if(!(data.overview === "")){
		overview = data.overview;
	}
	
	let poster = IMG_URL + data.poster_path;
	let id = data.id; 
    let rating = data.vote_average;
    let tbody = document.createElement('tbody');
    tbody.className = "table_row";
    tbody.innerHTML = `<tr>
        <th rowspan="3" id ="rating" class="align-middle">${rating}</th>
        <td rowspan="3" id="poster" class="align-middle"><img class="img-fluid" src = "${poster}" id="display-poster"></td>
        <td id="title" class="align-middle">${title}</td>
        </tr>
        <tr>
            <td id="ovr" class="align-middle">${overview}</td>
        </tr>
        <tr>
            <td id="genre" class="align-middle">${genres}</td>
        </tr>`;
    
    let tbl = document.createElement('table');
    tbl.className = "table table-borderless";
    tbl.setAttribute('id', `${id}`);
    tbl.setAttribute('onclick', `click_card(this, '${type}')`);
    tbl.appendChild(tbody);
    display.appendChild(tbl);
}

var input = document.getElementById("search_bar");
document.addEventListener("keypress", function(e) {
  if (e.which == 10 || e.which == 13) {
    event.preventDefault();
    document.getElementById("seach_btn").click();
  }
});

window.onload = url_receiver();

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