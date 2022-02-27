function init_header(){
    let html = document.getElementById('header');
    html.innerHTML = "\
    <div class=\"j_text\" align = \"center\">\
        <a href = \"https://www.deviantart.com/mateusmds\" style = \"color:#3C4D09\">sketches</a>\
        <a href = \"blog.html\"                            style = \"color:#3C4D09\">blog</a>\
        <a href = \"https://mateus-md.github.io/\"         style = \"color:#3C4D09\">home</a>\
        <a href = \"my_work.html\"                         style = \"color:#3C4D09\">work</a>\
        <a href = \"about_me.html\"                        style = \"color:#3C4D09\">about me</a>\
    </div>\
    <hr align = \"center\"/>\
    ";
    return 0;
}