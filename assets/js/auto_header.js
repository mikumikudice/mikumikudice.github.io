function init_header(){
    let head = document.getElementById('header');
    head.innerHTML = `
    <div class = "j_text" align = "center">
        <a href = "https://www.deviantart.com/mateusmds">sketches</a>
        <a href = "/en.mmdnight.html"                   >mmdnight</a>
        <a href = "/index.html"                         >home</a>
        <a href = "/projects.html"                      >projects</a>
        <a href = "/about_me.html"                      >about me</a>
    </div>
    `;

    let foot = document.getElementById('footnote');
    foot.innerHTML = `
        Copyright(c) 2019-2022 by Mateus M. D. de Souza.<br/>
        all images' rights are reserved.<br/>
        this website uses the color pallete <a href = "https://lospec.com/palette-list/laser-lab" target = "_blank">laser lab</a> made by <a href = "https://twitter.com/polyphorge" target = "_blank">polyphorge</a>.</br></br>
        <address>
            contact email: <a href = "mailto:6s4aq0np7@mozmail.com">6s4aq0np7@mozmail.com</a> |
            twitter: <a href = "https://twitter.com/levi_alfeuson" target = "_blank">
            @levi_alfeuson</a>
        </address>
    `;
    return 0;
}