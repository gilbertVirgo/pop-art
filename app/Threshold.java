// For execution on the command line
// java Threshold.java "[path]" "[highlight hex]" "[shadow hex]"

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;

public class Threshold {

	// Constants
	static final int MAX_RGB = 255 * 3;
	static final double FRAMES = 20.0;

	// Hex to RGB translation
	public static Color hexToRGB(String colorStr) {
		return new Color(Integer.valueOf(colorStr.substring(1, 3), 16), Integer.valueOf(colorStr.substring(3, 5), 16),
				Integer.valueOf(colorStr.substring(5, 7), 16));
	}

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

	public static int filterImage(BufferedImage buffer, Color color1, Color color2) {

		// Folder ID
		final int ID = (int) ((Math.random() * 99999) + 100000);

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
							BufferedImage.TYPE_INT_RGB);

					for (int y = 0; y < buffer.getHeight(); y++) {
						for (int x = 0; x < buffer.getWidth(); x++) {
							Color color = new Color(buffer.getRGB(x, y));

							int r = color.getRed(), g = color.getGreen(), b = color.getBlue();

							int sum = r + g + b;

							Color newColor = (sum > threshold) ? color1 : color2;

							image.setRGB(x, y, newColor.getRGB());
						}
					}

					File output = new File("./tmp/" + ID + "/" + this.index + ".png");

					// Create all necessary folders
					output.getParentFile().mkdirs();

					// Create file
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
		System.out.println(args);

		BufferedImage image = loadImage(args[0]);

		int ID = filterImage(image, hexToRGB(args[1]), // highlights
				hexToRGB(args[2]) // shadows
		);

		System.out.println(ID);

	}

}
