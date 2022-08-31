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
        const cid = crds[i].id;
        const txt = await fetch_file(`https://mateus-md.github.io/blog/${cid}.html`);
        const src = prsr.parseFromString(txt, 'text/html');

        let brf = src.getElementById('data').innerHTML;
        let tlt = src.getElementsByTagName('h3')[0].innerHTML;
        brf = brf.replace(/\<h3\>.+?\<\/h3\>/, '');
        brf = brf.replace(/\<a.+?\>(.+?)\<\/a\>/, '$1');
        brf = brf.slice(0, brf.indexOf('.', 66) ) + "...";

        let date = cid.toString();
        if(date.length < 6) date = '0' + date;
        
        date = date.slice(0,2) + "/" + date.slice(2,4) + "/" + date.slice(4);

        // make the card
        crds[i].innerHTML = `<h4>${date + " | " + tlt}</h4><p>${brf}</p>
        <a href = \"blog/${cid}.html\" class = \"default\"></a>`;
    }
}