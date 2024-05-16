import React, { useState } from 'react';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileProgress, setFileProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Only allow a single file
    setSelectedFile(file);
    setFileProgress(0); // Initialize progress for the file
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileProgress(0);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      console.error('No file selected for upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target.result.split(';base64,').pop();
        const sheetName = await extractSheetName(selectedFile.name, base64); // Extract sheet name
        await postData(selectedFile.name, sheetName, base64, 0); // Pass sheetName to postData
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const postData = async (fileName, sheetName, stream, index) => {
    try {
      console.log('Uploading data...');
      console.log('fileName:', fileName);
      console.log('sheetName:', sheetName);
      console.log('stream:', stream);

      const jsonData = {
        fileName: fileName,
        sheetName: sheetName,
        stream: stream
      };

      const response = await axios.post('http://localhost:6060/Service.svc/loadSecurityMasterService', jsonData, {
        headers: {
          'Content-Type': 'application/json'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setFileProgress(progress);
        }
      });

      console.log('Data uploaded successfully!', response.data);
      setSuccessMessage('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data:', error.response.data);
    }
  };

  const extractSheetName = async (fileName, stream) => {
    if (fileName.endsWith('.csv')) {
      return 'Sheet1';
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // For XLSX or XLS files, use XLSX library to extract sheet name
      const XLSX = require('xlsx');
      const workbook = XLSX.read(stream, { type: 'binary' });
      // Assuming the first sheet is the one we want, change as needed
      const sheetName = workbook.SheetNames[0];
      return sheetName || '';
    } else {
      return ''; // Unsupported file type, return an empty string
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <Box>
      <input type="file" onChange={handleFileChange} accept=".csv, .xlsx, .xls" style={{ display: 'none' }} id="file-upload" />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ m: 1.5 }}>
          Choose File
        </Button>
      </label>
      {selectedFile && (
        <Box>
          <span>
            <LinearProgress variant="determinate" value={fileProgress} />
            <Typography variant="body1">
              File Name: {selectedFile.name} &nbsp; Size: {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          </span>
          <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleRemoveFile} sx={{ mb: 2 }}>
            Remove
          </Button>
        </Box>
      )}
      <Button variant="contained" onClick={handleSubmit} disabled={!selectedFile} sx={{ ml: 1 }}>
        Upload
      </Button>
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default FileUploadForm;
