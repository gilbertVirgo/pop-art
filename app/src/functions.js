export default (function() {
    Image.prototype.toDataURL = function(canvas) {
        const context = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0, this.width, this.height);
        
        return canvas.toDataURL();
    }

    File.prototype.getDimensions = function() {
        return new Promise(resolve => {
            const image = new Image();

            image.src = window.URL.createObjectURL(this);

            image.onload = () => {
                let {naturalWidth: width, naturalHeight: height} = image;
                window.URL.revokeObjectURL(image.src);
                
                resolve({width, height});
            }  
        });
    }
})();