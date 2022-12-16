let lastpsh = [];
let fbackup = [];

let closed = true;
let begnin = 0;

let nested = false;
let titled = false;
let ptitle = "";

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

// put last block within a p tag
function close_stream(post){
    if(closed){
        begnin = post.innerHTML.length;
        return;
    }

    // flush buffer
    post.innerHTML = post.innerHTML.replace(/<p.*?><\/p>[\n]?/g, '');
    post.innerHTML = post.innerHTML.replace(/<\/(.+?)><p(.*?)>/g, '<\/$1>\n<p$2>');

    let temp = post.innerHTML;
    let cntt = post.innerHTML.slice(begnin, post.innerHTML.length);

    if(cntt.length == 0) return;

    if(!nested){
        temp = temp.slice(0, begnin) + '<p>' + cntt + '</p>\n';
    } else {
        temp = temp.slice(0, begnin) + '<p class = "dark">' + cntt + '</p>\n';
        nested = false;
    }
    post.innerHTML = temp;

    begnin = temp.length;
    closed = true;
}

function push_html(post, html){
    lastpsh.push(html.value);
    fbackup.push(post.innerHTML);

    if(html.value.startsWith('>')){
        close_stream(post);
        nested = true;
        closed = false;
        html.value = html.value.replace(/^>[ ]?(.+)/, '$1');
    }

    html.value = html.value.replace(/\\n$/, '');
    html.value = html.value.replace(/``(.+?)``/g, '<code>$1</code>');
    html.value = html.value.replace(/\~\~(.+?)\~\~/g, '<s>$1</s>');
    html.value = html.value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    html.value = html.value.replace(/__(.+?)__/g, '<i>$1</i>');
    html.value = html.value.replace(/\\n/g, '</br>\n');
    html.value = html.value.replace(/\[(.+?)\]\((.+?)\)/g, '<a href = $2 target = "_blank">$1</a>');
    html.value = html.value.replace('---', '<hr class = "dark_hr" align = "center"/>\n');

    post.innerHTML += html.value;

    // linefeed
    if(lastpsh[lastpsh.length - 1].endsWith('\\n')){
        close_stream(post);
    }
    html.value = "";
}

function blog_post(){
    let html = document.getElementById('field');
    let post = document.getElementById('post');

    if(html.value.startsWith('#')){
        close_stream(post);

        lastpsh.push(html.value);
        fbackup.push(post.innerHTML);

        if(!titled && ptitle == ""){
            titled = true;
            ptitle = html.value.replace(/^[#]+[ ]?(.+)/, '$1');
        }
        html.value = html.value.replace('---', '<hr class = "dark_hr" align = "center"/>\n');
        html.value = html.value.replace(/^##[ ]?(.+)/, '<h4>$1</h4>\n');
        html.value = html.value.replace(/^#[ ]?(.+)/, '<h3>$1</h3>\n');

        post.innerHTML += html.value;

    } else if(html.value != "\\n"){
        if(closed){
            begnin = post.innerHTML.length;
            closed = false;
        }
        push_html(post, html);

    } else close_stream(post);

    html.value = "";
}

function blog_post_dell(){
    if(lastpsh.length == 0) return;
    
    let html = document.getElementById('field');
    let post = document.getElementById('post');

    post.innerHTML = fbackup[fbackup.length - 1];
    html.value = lastpsh[lastpsh.length - 1];

    lastpsh.pop();
    fbackup.pop();
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
    const cntt = `<!DOCTYPE html>
    <html>
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
