# pop-art
Pop art filter idea.

See it live at [filter.gilbertvirgo.com](http://filter.gilbertvirgo.com)

Example:

<img src="https://avatars0.githubusercontent.com/u/7665822?s=400&u=8b4bee9395dbc0ef49d53236e0eea9a587989ebc&v=4"/>

## Java Backend

Makes use of Java's superior speed (over Node) to generate multiple image files at different thresholds.

## Canvas

Initially had Java hard code the colors into the image on the backend, but using the HTML5 `<canvas>` context, I was able to get quicker results in the client. Used `CanvasRenderingContext2D.globalCompositeOperation`.

