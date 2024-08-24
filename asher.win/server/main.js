const express = require('express');
const os = require('os');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const port = 9038;
app.use(cors());

let data = null;
fs.readFile('/etc/webSI.json', 'utf8')
    .then(jsonString => {
        data = JSON.parse(jsonString);
    })
    .catch(err => {
        console.log("File read failed:", err);
    });

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});