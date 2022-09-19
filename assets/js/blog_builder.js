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

let backup = [];
let lastbp = 0;

let closed = true;
let nested = false;
let begnin = 0;

let titled = false;
let ptitle = "";

// put last block within a p tag
function close_stream(post){
    if(begnin <= 0) return;

    backup.push(post.innerHTML);
    lastbp++;

    let cntt = post.innerHTML.slice(begnin, post.innerHTML.length);
    let temp = post.innerHTML;
    
    if(!nested){
        temp = temp.slice(0, begnin) + '<p>' + cntt + '</p>\n';
    } else {
        temp = temp.slice(0, begnin) + '<p class = "dark">' + cntt + '</p>\n';
        nested = false;
    }
    post.innerHTML = temp;
    begnin = 0;
}

function blog_post(){
    let html = document.getElementById('field');
    let post = document.getElementById('post');

    // flush buffers
    post.innerHTML = post.innerHTML.replace(/<p.*?><\/p>/g, '');

    // linefeed
    if(html.value.startsWith('>')
    || html.value.endsWith('\\n')
    || (closed && begnin == 0
    && !html.value.startsWith('#'))){

        if(begnin == 0 && closed){
            begnin = post.innerHTML.length;
            closed = false;
        } else if(!closed){
            close_stream(post);
            closed = true;
        }
        // if the if above were evaluated
        if(html.value.startsWith('>')){
            nested = true;
            html.value = html.value.replace(/^>[ ]?(.+)/, '$1');
        }
    }

    if(!closed){
        lastidx++;
        lastone[lastidx] = post.innerHTML.length;
        lastpsh[lastidx] = html.value;

        html.value = html.value.replace(/``(.+?)``/g, '<code>$1</code>');
        html.value = html.value.replace(/\~\~(.+?)\~\~/g, '<s>$1</s>');
        html.value = html.value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
        html.value = html.value.replace(/__(.+?)__/g, '<i>$1</i>');
        html.value = html.value.replace(/\\n/g, '</br>\n');
        html.value = html.value.replace(/\[(.+?)\]\((.+?)\)/g, '<a href = $2 target = "_blank">$1</a>');
        html.value = html.value.replace('---', '<hr class = "dark_hr" align = "center"/>\n');

        post.innerHTML += html.value;

    } else if(html.value.startsWith('#')){
        if(!titled && ptitle == ""){
            titled = true;
            ptitle = html.value.replace(/^##[ ]?(.+)/, '$1');
        }
        html.value = html.value.replace('---', '<hr class = "dark_hr" align = "center"/>\n');
        html.value = html.value.replace(/^##[ ]?(.+)/, '<h4>$1</h4>\n');
        html.value = html.value.replace(/^#[ ]?(.+)/, '<h3>$1</h3>\n');

        post.innerHTML += html.value;
    }

    html.value = "";
}

function blog_post_dell(){
    let post = document.getElementById('post');

    // remove tags
    if(closed && lastbp > 0){
        post.innerHTML = backup[lastbp];
        lastbp--;
    }
    // if we are at the end of a paragraph
    if(post.innerHTML.endsWith('</p>')){
        // find last opened paragraph and remove it
        begnin = post.innerHTML.lastIndexOf('<p');
        post.innerHTML = post.innerHTML.replace(/    \<p\>(.+?)\<\/p\>$/, '$1');
    }
    post.innerHTML = post.innerHTML.slice(0, lastone[lastidx]);
    let tbox       = document.getElementById('field');
    tbox.value     = lastpsh[lastidx];

    lastidx = lastidx > 0 ? lastidx - 1 : 0;
}

function blog_post_save(){
    if(!closed){
        const len = document.getElementById('post').innerHTML.length;
        document.getElementById('post').innerHTML =
        document.getElementById('post').innerHTML.substring(0, len - 2);
    }

    const name = prompt('please enter the post name');
    const keyw = prompt('please enter keywords of the post');
    const desc = prompt('please enter the post\'s description');
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
    download(`${name}.html`, cntt);
}
