function list_posts(){
    let feed = document.getElementById('feed');
    let crds = feed.getElementsByTagName('li');
    for(i = 0; i < crds.length; i++){
        crds[i].innerHTML = `<p>${crds[i].id}</p>`+
        `<a href = \"blog/${crds[i].id.replaceAll('.', '_')}.html`+
        `\" class = \"main\">read more</a>`;
    }
}
