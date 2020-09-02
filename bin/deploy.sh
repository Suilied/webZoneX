#!/usr/bin/env bash
DIR="/home/azmo/projects/webZoneX"

# Shut down the npm / node process
systemctl stop webZoneX

# Update & Pull from the repository
git remote update
git remote pull

# npm install the node_modules
npm install

# spin up the server again
#npm start
systemctl start webZoneX