async function fetch_file(link){
    return await (await fetch(link)).text()
}

async function list_posts(path){
    // get each element (card) of the field "feed"
    const feed = document.getElementById('feed');
    const crds = feed.getElementsByTagName('li');
    const prsr = new DOMParser();

    // substitute each of them by the preview card
    for(i = 0; i < crds.length; i++){
        // get the source for the brief line
        const cid = crds[i].id;
        if(cid == "skip") continue;

        const txt = await fetch_file(`${path}${cid}.html`);

        if(txt == undefined || txt == null) console.log(`${cid} is ${txt}`);

        const src = prsr.parseFromString(txt, 'text/html');

        if(src == undefined || src == null) console.log(`src is ${src}`);

        let brf = src.getElementById('data').innerHTML;
        let tlt = src.getElementsByTagName('h3')[0].innerHTML;
        brf = brf.replace(/\<h3\>.+?\<\/h3\>/, '');
        brf = brf.replace(/\<a.+?\>(.+?)\<\/a\>/, '$1');
        
        let idx = 80;
        let sub = "";
        while(sub.length < 100
            && idx < brf.length
            && idx > 0){
            sub = brf.slice(0, idx);
            idx = brf.indexOf('.', idx) + 1;
        }
        brf = sub + " [...]";

        let date = cid.toString();
        if(date.length < 6) date = '0' + date;
        
        date = date.slice(0,2) + "/" + date.slice(2,4) + "/" + date.slice(4);

        // make the card
        crds[i].innerHTML = `<h4>${date + " | " + tlt}</h4>
        ${brf}</p>
        <a href = \"${path}${cid}.html\" class = \"main\"></a>`;
    }
}
