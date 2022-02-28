function init_header(subpath){
    if(subpath == undefined) subpath = "";

    let head = document.getElementById('header');
    head.innerHTML = `
    <div class="j_text" align = "center">
        <a href = "https://www.deviantart.com/mateusmds" style = "color:#3C4D09">sketches</a>
        <a href = "${subpath}blog.html"                  style = "color:#3C4D09">blog</a>
        <a href = "https://mateus-md.github.io/"         style = "color:#3C4D09">home</a>
        <a href = "${subpath}my_work.html"               style = "color:#3C4D09">work</a>
        <a href = "${subpath}about_me.html"              style = "color:#3C4D09">about me</a>
    </div>
    `;

    let foot = document.getElementById('footnote');
    foot.innerHTML = `
    <p>
        BinaryBrain_ Copyright(c) 2019-2022 by Mateus M. D. de Souza,
        name (BinaryBrain_) and logo.<br/>
        All rights reserved.
    </p>
    `;
    return 0;
}