let lastidx = -1;
let lastone = {};

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

function blog_post(){
    let html = document.getElementById('field');
    let post = document.getElementById('post');

    lastidx++;
    lastone[lastidx] = post.innerHTML.length;

    html.value = html.value.replace(/\#(.+)/g, '<h3>$1</h3>')
    html.value = html.value.replace(/\##(.+)/g, '<h4>$1</h4>')
    html.value = html.value.replace(/``(.+)``/g, '<code>$1</code>')
    html.value = html.value.replace(/\~\~(.+?)\~\~/g, '<s>$1</s>')
    html.value = html.value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    html.value = html.value.replace(/__(.+?)__/g, '<i>$1</i>')
    html.value = html.value.replace(/``(.+?)``/g, '<small><mark>$1</mark></small>')
    html.value = html.value.replace(/\[([^\[\]]+?)\]\(([^()]+?)\)/g, '<a href=$2 target="_blank" >$1</a>')
    html.value = html.value.replace('\\n', '<br\/>')

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
        <title>mmd's blog</title>
        <link rel="stylesheet" href="../config.css"/>
        <link rel="icon" href="icon.png">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        <link href="https://fonts.googleapis.com/css2?family=DM+Mono&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=PT+Mono&display=swap" rel="stylesheet">

        <script src="../auto_header.js"></script>
    </head>
    <body onload = "init_header('../')">
        <header>
            <!-- Head -->
            <h1 align = "center" class = "title"><u><a href="index.html" title="making stuff since 4 B.W." >mmd's blog</a></u></h1>
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
        <footer class="footnote" id = "footnote">
        </footer>
    </body>
</html>`;
    download(`${name}.html`, cntt)
}
