#!/bin/bash
mkdir -p out
convert -size 100x100 ./bus.svg -gravity center -background white -extent 144x168 ./out/pekkle_icon.png
convert ./out/pekkle_icon.png -monochrome ./out/pekkle_icon~bw.png
convert -size 100x100 ./bus.svg -gravity center -background white -extent 180x180 ./out/pekkle_icon~round.png
