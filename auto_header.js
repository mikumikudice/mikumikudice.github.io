function init_header(subpath){
    if(subpath == undefined) subpath = "";

    let head = document.getElementById('header');
    head.innerHTML = `
    <div class="j_text" align = "center">
        <a href = "https://www.deviantart.com/mateusmds">sketches</a>
        <a href = "${subpath}soon.html"                 >mmdpedia</a>
        <a href = "${subpath}index.html"                >home</a>
        <a href = "${subpath}projects.html"             >projects</a>
        <a href = "${subpath}about_me.html"             >about me</a>
    </div>
    `;

    let foot = document.getElementById('footnote');
    foot.innerHTML = `
        Copyright(c) 2019-2022 by Mateus M. D. de Souza.<br/>
        all images' rights are reserved.<br/>
        this website uses the color pallete <a href = "https://lospec.com/palette-list/laser-lab" target="_blank">laser lab</a> made by <a href="https://twitter.com/polyphorge" target="_blank">polyphorge.</a></br></br>
        <address>
            contact email: 6s4aq0np7@mozmail.com |
            twitter: <a href="https://twitter.com/levi_alfeuson" target="_blank">
            @levi_alfeuson</a>
        </address>
    `;
    return 0;
}