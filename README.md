# mappy

A browser-based delivery-route planner, centred on Guelph, Ontario. Paste a list of addresses and choose how many drivers (1 to 4). It geocodes each address with the Mapbox Geocoding API (caching results in cookies), splits the stops into one cluster per driver, and orders each driver's stops with nearest-neighbour or brute-force search to keep the drive short.

The routes are drawn on a Leaflet map in a different colour for each driver, with turn-by-turn paths from the Mapbox Directions API. It is plain HTML, CSS and JS with no build step: open `index.html` in a browser.
