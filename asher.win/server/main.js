const express = require('express');
const os = require('os');
const fs = require('fs').promises;
const https = require('https');
const cors = require('cors');

const app = express();
const port = 9038;
app.use(cors());

let data = null;

const loadData = async () => {
    try {
        const jsonString = await fs.readFile('/etc/webSI.json', 'utf8');
        data = JSON.parse(jsonString);
    } catch (err) {
        console.error("File read failed:", err);
        process.exit(1);
    }
};

const startServer = async () => {
    try {
        const key = await fs.readFile('./ssl/server.key');
        const cert = await fs.readFile('./ssl/server.pem');
        const options = {
            key: key,
            cert: cert,
        };
        const server = https.createServer(options, app);
        server.listen(port, () => {
            console.log("Express server listening on port " + port);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

loadData().then(startServer);

app.get('/device-info', (req, res) => {
    if (data === null) {
        return res.status(500).json({ error: 'Data not loaded' });
    }

    const hostName = os.hostname();
    const networkInterfaces = os.networkInterfaces();
    let ipAddress = '';
    let searchDomain = '';

    for (const [ifaceName, ifaceInfos] of Object.entries(networkInterfaces)) {
        for (const iface of ifaceInfos) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddress = iface.address;
                break;
            }
        }
    }

    res.json({
        displayName: data.name,
        hostName: hostName,
        networking: {
            ip: ipAddress,
            custDomain: data.domainName,
            searchDomain: data.searchDomain
        }
    });
});