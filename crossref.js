let input = document.getElementById('query-box');
let queryItems = document.getElementById('query-static');

input.addEventListener('change', (evt) => {
	let cites = split_cites(evt.target.value);
	console.log(cites)
	replace_cites(cites);
	query_crossref();
})

function split_cites(text){
	return text.split('\n\n');
}

function replace_cites(cites){
	input.classList.toggle('hidden');
	queryItems.classList.toggle('hidden');

	cites.forEach((cite) => {
		let queryDiv = document.createElement('div');
		queryDiv.classList.add('query-item');
		queryDiv.innerHTML = cite;
		queryItems.appendChild(queryDiv);
	})

}

function query_crossref(){
	let citeBoxes = document.getElementsByClassName('query-item');
	let query_base = 'https://api.crossref.org/works?query='
	

	Array.prototype.forEach.call(citeBoxes, (cite) => {
		let cite_enc = encodeURIComponent(cite.innerHTML);
		fetch(query_base + cite_enc)
			.then((res) => res.json())
			.then((res) => {
				console.log(res)
				if (res.status !== 'ok'){
					cite.classList.add('no-results');
				}

				let filteredItems = res.message.items
					.filter(item => item.score > 80);

				if (filteredItems.length === 0){
					cite.classList.add('no-results')
				} else {
					cite.classList.add('results');
					filteredItems.forEach((item) => {
						let itemDiv = document.createElement('div');
						itemDiv.classList.add('result-item');
						let score = document.createElement('p');
						score.textContent = 'score: ' + item.score;
						let title = document.createElement('p');
						title.textContent = 'title: ' + item.title;
						let doi = document.createElement('p');
						doi.textContent = 'doi: ' + item.DOI;
						itemDiv.appendChild(score);
						itemDiv.appendChild(title);
						itemDiv.appendChild(doi);
						cite.appendChild(itemDiv);
					})
				}
			})
	})

}


