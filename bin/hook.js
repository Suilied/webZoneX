// this thing is used to reboot the webzone
const http = require('http');
const { execSync } = require('child_process');

let server = http.createServer( (req, res) => {
    if( req.method === "POST" ){
        console.log("POST");

        let body = '';
        req.on('data', (data) => {
            body += data;
        });

        req.on('end', () => {
            let stdout = execSync('bash ./bin/deploy.sh', { timeout: 120000, encoding: "utf-8" });
            console.log('FullBody:', body);
            console.log('Script output:', stdout);

            // Don't forget to give some feedback for the Post!
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('POST Received: '+stdout);
        });
    }
    else if( req.method === "GET" ) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("API is Online!");
    }
}).listen('3100');