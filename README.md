# pop-art
Pop art filter idea.

See it live at [filter.gilbertvirgo.com](http://filter.gilbertvirgo.com)

## Java Backend

Makes use of Java's superior speed (over Node) to generate multiple (default 20) image files with different threshold settings.

## Canvas

Initially had Java hard code the colors into the image on the backend, but using the HTML5 `<canvas>` context, I was able to get quicker results in the client. Used `CanvasRenderingContext2D.globalCompositeOperation`.
