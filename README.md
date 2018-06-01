new york city spots
===

> A map of good spots in new york https://csvsoundsystem.github.com/nyc-spots

To add to the list, edit the spreadsheet that lives at [`src/data/spots.csv`](src/data/spots.csv) and make a pull request.

##### Make your own map

If you want to use this template as a start for your own map, you can do the following (NodeJs required):

1. Fork this repo, clone it and install its dependencies with `git clone https://github.com/YOUR_GHUSERNAME/nyc-spots.git && cd nyc-spots && npm install`
1. Make your edits to the spreadsheet at [`src/data/spots.csv`](src/data/spots.csv)
1. Do `npm run dev` and navigate to `localhost:8000/public/index.html` to preview changes
1. If that looks good, publish to `gh-pages` with `npm run publish`. Visit your live map at <https://YOUR_GHUSERNAME.github.com/nyc-spots>
