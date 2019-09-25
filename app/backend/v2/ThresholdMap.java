package backend.v2;

// For execution on the command line
// java Threshold.java "[path]" "[highlight hex]" "[shadow hex]"

import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

public class ThresholdMap {
    // Constants
    static final int MAX_RGB = 255 * 3;
    // static final double FRAMES =
    // Double.parseDouble(System.getenv("FRAMES_LENGTH"));
    static final double FRAMES = 20;

    // Read image from file path
    public static BufferedImage loadImage(String path) {
        BufferedImage image = null;
        try {
            image = ImageIO.read(new File(path));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return image;
    }

    public static int filterImage(BufferedImage buffer) {
        final int ID = (int) ((Math.random() * 899999) + 100000);

        try {
            // BufferedImage image = new BufferedImage(buffer.getWidth() * (int) FRAMES,
            // buffer.getHeight(),BufferedImage.TYPE_INT_ARGB);

            BufferedImage image = new BufferedImage(buffer.getWidth() * (int) FRAMES, buffer.getHeight(),
                    BufferedImage.TYPE_INT_ARGB);

            for (int index = 0; index < FRAMES; index++) {
                int threshold = (int) Math.floor(((double) index / FRAMES) * MAX_RGB);

                int offset = index * buffer.getWidth();

                for (int y = 0; y < buffer.getHeight(); y++) {
                    for (int x = 0; x < buffer.getWidth(); x++) {
                        int pixel = buffer.getRGB(x, y);

                        int r = (pixel >> 16) & 0xff, g = (pixel >> 8) & 0xff, b = (pixel) & 0xff;

                        int sum = r + g + b;

                        // Black or transparent (white for readability)
                        int color = (sum < threshold) ? 0xFF000000 : 0x00FFFFFF;

                        // Offset for mapping
                        image.setRGB(offset + x, y, color);
                    }
                }

                File output = new File("./tmp/" + ID + ".png");
                output.getParentFile().mkdirs();
                output.createNewFile();

                ImageIO.write(image, "png", output);
            }
        } catch (Exception e) {
            System.out.println("Exception: " + e);
        }

        return ID;
    }

    public static void main(String[] args) {
        // args:
        // 0 file path
        // highlights
        // shadows

        BufferedImage image = loadImage(args[0]);

        int ID = filterImage(image);

        System.out.print(ID);
    }

}
