const Render = {
    Highlights: ({context, highlights}) => {
        const {canvas} = context;

        context.save();
        context.globalCompositeOperation = "destination-over";

        context.fillStyle = highlights;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    },
    Shadows: ({context, frame, shadows}) => {
        const {canvas} = context;

        context.save();
        context.drawImage(frame, 0, 0, canvas.width, canvas.height);

        // set composite mode
        context.globalCompositeOperation = "source-in";

        // draw color
        context.fillStyle = shadows;

        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    },
    Frame: ({context, frame, highlights, shadows}) => {
        const {canvas} = context;

        context.clearRect(0, 0, canvas.width, canvas.height);

        Render.Shadows({context, frame, shadows});
        Render.Highlights({context, highlights});

        // For later download

        return canvas.toDataURL("image/png");
    }
}

export default Render;