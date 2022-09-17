const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '8642e7bf60msh7ffbbab9b19f5ebp13f96bjsnab90e1ac7d1b',
		'X-RapidAPI-Host': 'webknox-jokes.p.rapidapi.com'
	}
};

fetch('https://webknox-jokes.p.rapidapi.com/jokes/search?keywords=kick%2C%20hard&numJokes=5&category=Chuck%20Norris&minRating=5', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));