package backend.v2;

// For execution on the command line
// java Threshold.java "[path]" "[highlight hex]" "[shadow hex]"

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;

import javax.imageio.ImageIO;

public class Threshold {
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

		// Initiates thread
		// Uses local variables so was necessary to put class inside function
		class GenerateImage implements Runnable {
			private volatile double index;

			// Constructor
			public GenerateImage(int index) {
				this.index = (double) index;
			}

			// On thread initiate
			public void run() {
				try {
					int threshold = (int) Math.floor((this.index / FRAMES) * MAX_RGB);

					BufferedImage image = new BufferedImage(buffer.getWidth(), buffer.getHeight(),
							BufferedImage.TYPE_INT_ARGB);

					for (int y = 0; y < buffer.getHeight(); y++) {
						for (int x = 0; x < buffer.getWidth(); x++) {
							int pixel = buffer.getRGB(x, y);

							int a = (pixel >> 24) & 0xff, r = (pixel >> 16) & 0xff, g = (pixel >> 8) & 0xff,
									b = (pixel) & 0xff;

							int sum = r + g + b;

							// Black or transparent (white for readability)
							int color = (sum < threshold) ? 0xFF000000 : 0x00FFFFFF;

							image.setRGB(x, y, color);
						}
					}

					File output = new File("./tmp/" + ID + "/" + (int) this.index + ".png");
					output.getParentFile().mkdirs();
					output.createNewFile();

					ImageIO.write(image, "png", output);
				} catch (Exception e) {
					System.out.println("Exception: " + e);
				}
			}
		}

		// Start a thread for each frame
		for (int i = 0; i < FRAMES; i++) {
			Thread thread = new Thread(new GenerateImage(i));
			thread.start();

			try {
				// Prevent continuation of code before threads are finished
				thread.join();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
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
