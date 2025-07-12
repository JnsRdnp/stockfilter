#!/bin/bash

URL="https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt"
OUTPUT="./tmp/nasdaqlisted.txt"

echo "Downloading Nasdaq symbols file..."
wget -q --show-progress -O "$OUTPUT" "$URL"

if [ $? -eq 0 ]; then
  echo "Download completed: $OUTPUT"
else
  echo "Download failed!"
fi
