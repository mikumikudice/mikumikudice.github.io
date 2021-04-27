let lastidx = -1;
let lastone = {};

// function from codegrepper.com
function download(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function blog_post(){
    let html = document.getElementById('field');
    let post = document.getElementById('post');

    lastidx++;
    lastone[lastidx] = post.innerHTML.length;

    post.innerHTML += html.value;
    html.value = "";
}

function blog_post_dell(){
    let post = document.getElementById('post');

    post.innerHTML = post.innerHTML.slice(0, lastone[lastidx]);
    lastidx = lastidx > 0 ? lastidx - 1 : 0;
}

function blog_post_save(){
    let   name = prompt('please enter the post name')
    const cntt = `<html>
    <head>
        <title>BinaryBrain_</title>
        <link rel="stylesheet" href="../config.css"/>
    </head>
    <body>
        <!-- Head -->
        <h1 align = "center" style = "color:#3C4D09"><u><br/>BinaryBrain</u></h1>
        <hr align = "center"/>

        <!-- Menu -->
        <div class="j_text" align = "center">
            <a href = "coming_s.html"               style = "color:#3C4D09">sketches</a>
            <a href = "daily_blog.html"             style = "color:#3C4D09">blog</a>
            <a href = "https://mateusmds.github.io" style = "color:#3C4D09">home</a>
            <a href = "my_work.html"                style = "color:#3C4D09">work</a>
            <a href = "about_me.html"               style = "color:#3C4D09">about me</a>
        </div>
        <hr align = "center"/>

        <!-- Body -->
        <div class = "default" align = "justify">
            ${document.getElementById('post').innerHTML}
        </div>

        <hr align = "center"/>
        <!-- Footnote -->
        <div class="default" align = "center">
            <p align = "center">
                BinaryBrain_ Copyright(c) 2019-2021 by Mateus M. D. de Souza,
                name (BinaryBrain_) and logo.<br/>
                All rights reserved.
                <br/><br/>
            </p>
        </div>
    </body>`;
    download(`${name}.html`, cntt)
}
