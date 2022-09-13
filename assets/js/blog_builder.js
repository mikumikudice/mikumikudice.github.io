let lastidx = -1;
let lastone = {};
let lastpsh = {};

function allow_return(){
    document.getElementById('field')
    .addEventListener('keyup', function(event){
        event.preventDefault();
        if(event.key == "Enter") blog_post();
    });
}

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

let opened = false;
let closed = false;
let begnin = 0;
function blog_post(){
    
    let html = document.getElementById('field');
    let post = document.getElementById('post');

    // flush buffers
    html.value = html.value.trim();
    post.innerHTML = post.innerHTML.replace('<p></p>', '');

    // linefeed
    if(html.value.startsWith('#')
    || html.value.endsWith('\\n')
    || begnin == 0 && !closed){
        if(begnin == 0) begnin = post.innerHTML.length;
        else closed = true;
        
        if(html.value.startsWith('#') && begnin > 0){
            let sub = html.value;
            sub = sub.replace(/^##[ ]?(.+)/, '<h4>$1</h4>');
            sub = sub.replace(/^#[ ]?(.+)/, '<h3>$1</h3>');

            begnin += sub.length;
        }
    }

    if(html.value != "\\n"){
        lastidx++;
        lastone[lastidx] = post.innerHTML.length;
        lastpsh[lastidx] = html.value;

        html.value = html.value.replace(/^#[ ]?(.+)/, '<h3>$1</h3>\n');
        html.value = html.value.replace(/^##[ ]?(.+)/, '<h4>$1</h4>\n');
        html.value = html.value.replace(/``(.+?)``/g, '<code>$1</code>');
        html.value = html.value.replace(/\~\~(.+?)\~\~/g, '<s>$1</s>');
        html.value = html.value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
        html.value = html.value.replace(/__(.+?)__/g, '<i>$1</i>');
        html.value = html.value.replace('\\\\n', '\\n');
        html.value = html.value.replace(/\[(.+?)\]\((.+?)\)/g, '<a href = $2 target = "_blank">$1</a>');
        html.value = html.value.replace('---', '<hr class = "dark_hr" align = "center"/>');

        post.innerHTML += html.value;
    }

    if(opened){
        begnin = post.innerHTML.length;
        opened = false;
    }

    if(closed){
        // put last block within a p tag
        if(begnin > 0){
            let cntt = post.innerHTML.slice(begnin, post.innerHTML.length);
            let temp = post.innerHTML;
            temp = temp.slice(0, begnin) + '<p>' + cntt + '</p>\n';
            
            post.innerHTML = temp;
            begnin = 0;
        }
        closed = false;
    }   

    html.value = "";
}

function blog_post_dell(){
    let post       = document.getElementById('post');

    // if we are at the end of a paragraph
    if(post.innerHTML.endsWith('</p>')){
        // find last opened paragraph and remove it
        begnin = post.innerHTML.lastIndexOf('<p>');
        post.innerHTML = post.innerHTML.replace(/\<p\>(.+?)\<\/p\>$/, '$1');
    }
    post.innerHTML = post.innerHTML.slice(0, lastone[lastidx]);
    let tbox       = document.getElementById('field');
    tbox.value     = lastpsh[lastidx];

    lastidx = lastidx > 0 ? lastidx - 1 : 0;
}

function blog_post_save(){
    const name = prompt('please enter the post name')
    const keyw = prompt('please enter keywords of the post')
    const desc = prompt('please enter the post\'s description')
    const cntt = `<html>
    <head>
        <title>mmd's blog</title>
        <link rel = "stylesheet" href = "/assets/css/config.css"/>
        <link rel = "icon" href = "/assets/img/icon.png">

        <link rel = "preconnect" href = "https://fonts.googleapis.com">
        <link rel = "preconnect" href = "https://fonts.gstatic.com" crossorigin>

        <link href = "https://fonts.googleapis.com/css2?family=DM+Mono&display=swap"         rel = "stylesheet">
        <link href = "https://fonts.googleapis.com/css2?family=PT+Mono&display=swap"         rel = "stylesheet">
        <link href = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel = "stylesheet">

        <script src = "/assets/js/auto_header.js"></script>

        <meta charset = "UTF-8">
        <meta name = "author"      content = "Mateus M.D. Souza">
        <meta name = "keywords"    content = 
            "${keyw}"
        >
        <meta name = "description" content =
            "${desc}"
        >
    </head>

    <body onload = "init_header()">
        <header>
            <!-- Head -->
            <h1 align = "center" class = "title"><a href = "index.html" title = "making stuff since 4 B.W." >mmd's blog</a></h1>
            <hr align = "center"/>

            <!-- Menu -->
            <nav id = "header"></nav>
            <hr align = "center"/>
        </header>

        <!-- Body -->
        <main class = "default" id = "data" align = "justify">
            ${document.getElementById('post').innerHTML}
        </main>

        <!-- Footnote -->
        <hr align = "center"/>
        <footer id = "footnote">
        </footer>
    </body>
</html>`;
    download(`${name}.html`, cntt)
}
