function init_header(){
    let head = document.getElementById('header');
    head.innerHTML = `
    <div class = "j_text" align = "center">
        <a href = "https://www.deviantart.com/mateusmds">sketches</a>
        <a href = "/mmdnight/en.html"                   >mmdnight</a>
        <a href = "/index.html"                         >home</a>
        <a href = "/projects.html"                      >projects</a>
        <a href = "/about_me.html"                      >about me</a>
    </div>
    `;

    let foot = document.getElementById('footnote');
    foot.innerHTML = `
        images are under <a href = "https://creativecommons.org/" target = "_blank">Creative Commons License</a><br/>
        check the license of the source code for further information<br/>
        this website uses the color pallete <a href = "https://lospec.com/palette-list/dnot-froget" target = "_blank">#dnotfroget</a> made by <a href = "https://lospec.com/sukinapan" target = "_blank">sukinapan</a>.</br></br>
        <address>
            contact email: <a href = "mailto:6s4aq0np7@mozmail.com">6s4aq0np7@mozmail.com</a> |
            twitter: <a href = "https://twitter.com/mikumikudice" target = "_blank">@mikumikudice</a> |
            mastodon: <a rel="me" href="https://social.linux.pizza/@mikumikudice" target="_blank">@mikumikudice@social.linux.pizza</a>
        </address>
    `;
    return 0;
}