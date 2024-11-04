const http = require("http");
const fs = require("fs");
const port = 3005;
const usuarios = [
    { user: 'admin', password: 'admin' },
    { user: 'client', password: 'client' },
    { user: 'dev', password: 'dev' }
]
const logados = {};

const server = http.createServer((req, res) => {
    const url = req.url;
    switch (url) {
        case "/":
            res.writeHead(200);
            res.end(fs.readFileSync("./index.html"))
            break;
        case "/login":
            req.on("data", (data) => {
                const parsedData = JSON.parse(data);
                const logged = usuarios.find(usuario => usuario.user === parsedData.user && usuario.password == parsedData.password);
                if (!logged) {
                    console.log("logadon't!")
                    res.writeHead(404, "ACESSO NEGADO!")
                    res.end(JSON.stringify(false));
                    return;
                }
                logados[req.socket.remoteAddress] = true;
                res.writeHead(200)
                res.end(JSON.stringify(true))
            })
            break;
        case "/conteudo.html":
            const logged = logados[req.socket.remoteAddress];

            if (!logged) {
                res.writeHead(400)
                res.end(fs.readFileSync('./404.html'))
                return;
            }
            console.log("Olha o erro");
            res.writeHead(200);
            res.end(fs.readFileSync('./conteudo.html'));
            break;
    }
})

console.log(port)
server.listen(port);