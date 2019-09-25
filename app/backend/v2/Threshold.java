package backend.v2;

import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

public class Threshold {

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

	public static int splitImage(BufferedImage buffer) {
		final int ID = (int) ((Math.random() * 899999) + 100000);
		final String root = "./tmp/" + ID + "/";

		// Start a thread for each frame
		for (int index = 0; index < (Constants.FRAMES + 1); index++) {
			// Split threads

			Thread thread;

			if (index < Constants.FRAMES) {
				thread = new Thread(new Frame(root, buffer, index));
			} else {
				thread = new Thread(new CompositeFrame(root, buffer));
			}
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
		BufferedImage image = loadImage(args[0]);

		int splitDir = splitImage(image);

		System.out.print(splitDir);
	}

}
