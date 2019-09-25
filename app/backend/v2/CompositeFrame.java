package backend.v2;

import java.awt.image.BufferedImage;
import java.io.File;

import java.awt.Color;

import javax.imageio.ImageIO;

public class CompositeFrame implements Runnable {
    private volatile String root;
    private volatile BufferedImage buffer;

    // Constructor
    public CompositeFrame(String root, BufferedImage buffer) {
        this.root = root;
        this.buffer = buffer;
    }

    public void run() {
        BufferedImage image = new BufferedImage(this.buffer.getWidth(), this.buffer.getHeight(),
                BufferedImage.TYPE_INT_ARGB);

        for (int y = 0; y < this.buffer.getHeight(); y++) {
            for (int x = 0; x < this.buffer.getWidth(); x++) {
                int pixel = this.buffer.getRGB(x, y);

                int r = (pixel >> 16) & 0xff, g = (pixel >> 8) & 0xff, b = (pixel) & 0xff;

                int sum = r + g + b;
                sum /= 3;
                sum = 255 - sum;

                int factor = (int) Constants.FRAMES * Math.round(sum / (int) Constants.FRAMES);

                Color color = new Color(r, g, b, factor);

                image.setRGB(x, y, color.getRGB());
            }
        }

        try {
            File output = new File(root + "20.png");
            output.getParentFile().mkdirs();
            output.createNewFile();

            ImageIO.write(image, "png", output);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}