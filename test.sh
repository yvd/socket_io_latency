#! /bin/bash
node dist/server.js &
sleep 1 && node dist/client.js