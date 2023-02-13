let no_len = true;
let within = false;
let onlist = false;
let backup = [];
let inputb = [];
let stateb = [];

// usage:
// - posts with > are in dark mode
// - #, ##, and so on works just like markdown
// - type with a triple star (***) to start a list.
// - type with a plus sign at the beginning within a list to add a new item
// - typing only a newline creates a new paragraph

function allow_return(){
    document.getElementById('field')
    .addEventListener('keyup', function(event){
        event.preventDefault();
        if(event.key == "Enter") push_html();
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

function push_html(){
    no_len = false;

    let input = document.getElementById('field');
    let postb = document.getElementById('post');
    if(input.value == '\\n'){
        within = false;
        onlist = false;
        input.value = "";
        return;
    }

    inputb.push(input.value);
    backup.push(postb.innerHTML);
    stateb.push([no_len, within, onlist]);

    if(input.value == '***'){
        postb.innerHTML += '<ul></ul>\n';
        onlist = true;
        input.value = "";
        return;
    }

    input.value = input.value.replace(/``(.+?)``/g, '<code>$1</code>');
    input.value = input.value.replace(/\~\~(.+?)\~\~/g, '<s>$1</s>');
    input.value = input.value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    input.value = input.value.replace(/__(.+?)__/g, '<i>$1</i>');
    input.value = input.value.replace(/\\n/g, '</br>\n');
    input.value = input.value.replace(/\[(.+?)\]\((.+?)\)/g, '<a href = $2 target = "_blank">$1</a>');
    input.value = input.value.replace('---', '<hr class = "dark_hr" align = "center"/>\n');

    if(input.value.startsWith('#')){
        if(input.value.search(/^# /) != -1) input.value = input.value.replace(/# (.+)/, '<h1>$1</h1>');
        else if(input.value.search(/^## /) != -1) input.value = input.value.replace(/## (.+)/, '<h2>$1</h2>');
        else if(input.value.search(/^### /) != -1) input.value = input.value.replace(/### (.+)/, '<h3>$1</h3>');

        postb.innerHTML += input.value;
        input.value = "";
        return;
    }

    if(within){
        let pclss = postb.innerHTML.match(/(<p.*?>).+<\/p>$/s)[0];
        let prgph = postb.innerHTML.match(/<p.*?>(.+)<\/p>$/s)[0];

        postb.innerHTML = postb.innerHTML.replace(/<p.*?>.+<\/p>$/s, pclss + prgph + input.value + '</p>');

    } else if(onlist){
        if(input.value.startsWith('+ ')){
            postb.innerHTML = postb.innerHTML.replace(
                /(<ul>.*?)(<\/ul>\n)$/s,
                `$1<li>${input.value.replace('+ ', '')}</li>\n$2`
            );
        } else {
            postb.innerHTML = postb.innerHTML.replace(
                /(<ul>.*?)(<\/li>\n<\/ul>\n)$/s,
                `$1${input.value}$2`
            );
        }
    } else {
        within = true;
        if(input.value.startsWith('> ')){
            input.value = input.value.replace('> ', '');

            postb.innerHTML += '<p class = "dark">' + input.value +'</p>\n'
        } else {
            postb.innerHTML += '<p>' + input.value +'</p>\n'
        }
    }
    input.value = "";
}

function dell_html(){
    if(no_len || backup.length == 0) return;

    let input = document.getElementById('field');
    let postb = document.getElementById('post');

    input.value     = inputb[inputb.length - 1];
    postb.innerHTML = backup[backup.length - 1];
    no_len = stateb[stateb.length - 1][0];
    within = stateb[stateb.length - 1][1];
    onlist = stateb[stateb.length - 1][2];

    inputb.pop();
    backup.pop();
    stateb.pop();
}

function save_post(){
    const name = prompt('please enter the post name');
    const keyw = prompt('please enter keywords of the post');
    const desc = prompt('please enter the post\'s description');
    const cntt = `<!DOCTYPE html>
    <html>
    <head>
        <title>lugoo-di</title>
        <link rel = "stylesheet" href = "/assets/css/config.css"/>
        <link rel = "icon" href = "/assets/img/icon.png">

        <link rel = "preconnect" href = "https://fonts.googleapis.com">
        <link rel = "preconnect" href = "https://fonts.gstatic.com" crossorigin>

        <link href = "https://fonts.googleapis.com/css2?family=DM+Mono&display=swap"         rel = "stylesheet">
        <link href = "https://fonts.googleapis.com/css2?family=PT+Mono&display=swap"         rel = "stylesheet">
        <link href = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel = "stylesheet">

        <script src = "/assets/js/auto_header.js"></script>

        <meta charset = "UTF-8">
        <meta name = "author"      content = "Mateus M. D. Souza">
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
            <h1 align = "center" class = "title"><a href = "/index.html" title = "the land of skulls!" >
                <img src = "/assets/img/logo.png" style = "width: 10%; height: auto;" alt = "logo" class = "img_center">
            </a></h1>
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
