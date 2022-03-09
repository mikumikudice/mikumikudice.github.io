async function fetch_file(link){
    return await (await fetch(link)).text()
}

async function list_posts(){
    // get each element (card) of the field "feed"
    const feed = document.getElementById('feed');
    const crds = feed.getElementsByTagName('li');
    const prsr = new DOMParser();

    // substitute each of them by the preview card
    for(i = 0; i < crds.length; i++){
        // get the source for the brief line
        const txt = await fetch_file(`https://mateus-md.github.io/blog/${crds[i].id}.html`);
        const src = prsr.parseFromString(txt, 'text/html');

        let brf = src.getElementById('data').innerHTML;
        brf = brf.replace(/\<h3\>.+\<\/h3\>/, '');
        brf = brf.slice(0, brf.indexOf('.', 66) ) + "...";

        // make the card
        crds[i].innerHTML = `<h3>${crds[i].id}</h3>`+
        `<p>${brf}</p>`+
        `<a href = \"blog/${crds[i].id.replaceAll('.', '_')}.html`+
        `\" class = \"main\">read more</a>`;
    }
}
