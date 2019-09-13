export const hexToRGB = hex => {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    
    return [r, g, b];
}

export const applyColorToPixel = ({data, rgba, index}) => {
    rgba.forEach((channel, delta) => {
        data[index + delta] = channel;
    });

    return data;
}