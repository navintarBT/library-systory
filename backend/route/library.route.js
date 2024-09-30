const express = require('express');
const router = express.Router();
const { User, AddLibrarySchema } = require('../models/Library');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './backend/public/images/users'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

// Initialize multer with storage and file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 500000000 } 
}).fields([
  { name: 'files', maxCount: 10 },
  { name: 'image', maxCount: 1 }
]);

// Route to create a new library entry
router.post('/create-library', upload, async (req, res) => {
  try {
    const imageFile = req.files.image[0];
    const files = req.files?.files || [];
    const image = imageFile ? imageFile.filename : '';

    let attrachment = [];
    await files.forEach(item => {
      let file = {
        filename: item.filename,
        originalname: item.originalname,
        size: item.size
      };
      attrachment.push(file);
    });

    // Extract other fields from the request body
    const {
      userName,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample
    } = JSON.parse(req.body.data); // Ensure req.body.data is properly formatted

    // Create new library document
    const newLibrary = new AddLibrarySchema({
      LIB_NAME: libraryName,
      DESCRIPTION: description,
      REFERENCE: reference,
      DESCRIPTIONS_OVER: overviewDes,
      DESCRIPTIONS_INS: installationDes,
      DESCRIPTIONS_HTU: HowToUseDes,
      DESCRIPTIONS_EXP: exampleDes,
      DESCRIPTIONS_SGT: suggestionDes,
      IMAGE: image,
      CREATE_BY: userName,
      ATTRACHMENT: JSON.stringify(attrachment),
      INSTALLATION: JSON.stringify(rowsInstallations),
      HOWTOUSE: JSON.stringify(rowsHowToUse),
      EXAMPLE: JSON.stringify(rowsExample)
    });

    // Save the new library entry
    const addedLibrary = await newLibrary.save();
    res.status(201).json(addedLibrary); // Return the saved document with a 201 status
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving library', error: err.message });
  }
});


//Read library
router.route('/').get(async (req, res) => {
  AddLibrarySchema.find().then((doc) => {
    res.status(200).send(doc);
  }).catch((err) => {
    console.log(err);
  });
});

router.put('/Update/Data/:id', upload, async (req, res) => {
  try {
    const { id: update_id } = req.params;
    let image = '';
    const imageFile = req.files ? req.files.image[0] : null;
    
  
    if (imageFile) {
      const oldImagePath = path.join(__dirname, './backend/public/images/users', imageFile.originalname); // Original name path
      const newImagePath = path.join(__dirname, './backend/public/images/users', imageFile.filename); // New uploaded file path
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete old file if it exists
        fs.renameSync(newImagePath, oldImagePath); // Rename new file to original name
        image = imageFile.originalname; // Keep original name
      } else {
        // If no old file with the same name exists, use the new filename directly
        image = imageFile.filename;
      }
    }
  
    const files = req.files?.files || [];    
    let attrachment = [];
  
    for (const item of files) {
      const oldFilePath = path.join(__dirname, './backend/public/images/users', item.originalname); // Path with original name
      const newFilePath = path.join(__dirname, './backend/public/images/users', item.filename); // Path with new filename
      let file = {
        filename: item.filename, // New filename
        originalname: item.originalname, // Original filename
        size: item.size
      };
  
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Delete old file if it exists
        fs.renameSync(newFilePath, oldFilePath); // Rename the new file to the original name
        file.filename = item.originalname; // Assign original name to file object
      } 
  
      attrachment.push(file); // Push file to the attachment array
    }

    const {
      userName,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
    } = JSON.parse(req.body.record);

    // Update data in MongoDB
    const libraryData = await AddLibrarySchema.findByIdAndUpdate(
      update_id,
      {
        LIB_NAME: libraryName,
        DESCRIPTION: description,
        REFERENCE: reference,
        DESCRIPTIONS_OVER: overviewDes,
        DESCRIPTIONS_INS: installationDes,
        DESCRIPTIONS_HTU: HowToUseDes,
        DESCRIPTIONS_EXP: exampleDes,
        DESCRIPTIONS_SGT: suggestionDes,
        IMAGE: image,
        CREATE_BY: userName,
        ATTRACHMENT: JSON.stringify(attrachment),
        INSTALLATION: JSON.stringify(rowsInstallations),
        HOWTOUSE: JSON.stringify(rowsHowToUse),
        EXAMPLE: JSON.stringify(rowsExample)
      },
      { new: true } // Return the updated document
    );

    if (!libraryData) {
      return res.status(404).json({ message: 'Library not found' });
    }

    res.status(200).json({
      message: 'success',
      data: libraryData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete library
router.delete('/delete/library/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  try {
    const response = await AddLibrarySchema.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({
        message: 'Library not found',
      });
    }
    res.status(200).json({
      message: 'Delete success',
      data: response
    });
  } catch (error) {
    console.error('Error deleting library record:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// Route to serve files
router.get('/files/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '../public/images/users', fileName); // Adjust path based on your project structure

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    // Serve the file without triggering download
    res.sendFile(filePath, (err) => {
      if (err) {
        return res.status(500).send('Error in serving the file');
      }
    });
  });
});

//-----------------------------------------user
// Get user
// Endpoint to fetch initial login values
router.post('/getUser', async (req, res) => {
  try {
    const { userInput, password } = req.body;
    // Query to find user by either name or email
    const user = await User.find({
      $or: [{ name: userInput }],
      password: password
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
