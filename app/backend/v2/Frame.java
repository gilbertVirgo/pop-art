package backend.v2;

import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

public class Frame implements Runnable {
    private volatile String root;
    private volatile BufferedImage buffer;
    private volatile double index;

    // Constructor
    public Frame(String root, BufferedImage buffer, int index) {
        this.root = root;
        this.buffer = buffer;
        this.index = (double) index;
    }

    // On thread initiate
    public void run() {
        try {
            int threshold = (int) Math.floor((this.index / Constants.FRAMES) * Constants.MAX_RGB);

            BufferedImage image = new BufferedImage(this.buffer.getWidth(), this.buffer.getHeight(),
                    BufferedImage.TYPE_INT_ARGB);

            for (int y = 0; y < this.buffer.getHeight(); y++) {
                for (int x = 0; x < this.buffer.getWidth(); x++) {
                    int pixel = this.buffer.getRGB(x, y);

                    int r = (pixel >> 16) & 0xff, g = (pixel >> 8) & 0xff, b = (pixel) & 0xff;

                    int sum = r + g + b;

                    // Black or transparent (white for readability)
                    int color = (sum < threshold) ? 0xFF000000 : 0x00FFFFFF;

                    image.setRGB(x, y, color);
                }
            }

            File output = new File(root + (int) this.index + ".png");
            output.getParentFile().mkdirs();
            output.createNewFile();

            ImageIO.write(image, "png", output);
        } catch (Exception e) {
            System.out.println("Exception: " + e);
        }
    }
}