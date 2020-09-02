#!/usr/bin/env bash
DIR="/home/azmo/projects/webZoneX"

# Shut down the npm / node process
systemctl stop webZoneX

# Fetch & Pull from the repository
git fetch
git pull

# npm install the node_modules
npm install

# spin up the server again
systemctl start webZoneX