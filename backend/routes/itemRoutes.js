import express from "express";
import Item from "../models/items.js";
import multer from "multer"
import cloudinary from "../config/cloudinary.js";

const router = express.Router();


const storage = multer.memoryStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });





router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const { name } = req.body;

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "backend-practice" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    // Get Cloudinary image URL
    const image = result.secure_url;

    // Save item to MongoDB
    const newItem = new Item({
      name,
      image
    });

    await newItem.save();

    res.json({
      success: true,
      message: "Item added successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to add item"
    });
  }
});


router.get("/list", async (req, res) => {
  const items = await Item.find();
  res.json({
    success: true,items
  })
})

router.delete("/:id", async (req, res) => {
  

  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "item not found"
      })
    }

    res.json({
      success: true,
      message: "Item deleted successfully"
    })

  }
  
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item"
     })
  }


}

)

export default router;