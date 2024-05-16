import React, { useState } from 'react';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2';

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileProgress, setFileProgress] = useState(0);

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
        // Assuming sheetName and other parameters are empty strings
        await postData(selectedFile.name, '', base64);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const postData = async (fileName, sheetName, stream) => {
    try {
      console.log('Uploading data...');
      console.log('fileName:', fileName);
      console.log('stream:', stream);

      let jsonData = {
        fileName: fileName,
        sheetName: '', // Initialize with an empty string
        stream: stream
      };

      if (fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const extractedSheetName = await extractSheetName(fileName, stream);
        jsonData.sheetName = extractedSheetName;
      }

      const response = await axios.post('http://localhost:55411/Service.svc/loadAlphaDeskFileService', jsonData, {
        headers: {
          'Content-Type': 'application/json'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setFileProgress(progress);
        }
      });

      console.log('Data uploaded successfully!', response.data);

      // Show success message using SweetAlert
      Swal.fire('Success', 'File uploaded successfully', 'success');

      // Clear file selection and progress after successful upload
      setSelectedFile(null);
      setFileProgress(0);
    } catch (error) {
      console.error('Error uploading data:', error.response.data);
      // Handle error cases if needed
    }
  };

  const extractSheetName = async (fileName, stream) => {
    if (fileName.endsWith('.csv')) {
      // For CSV, we can't extract sheet name, so return an empty string
      return 'Sheet1';
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // For XLSX or XLS, use a library like XLSX to extract sheet name
      const XLSX = require('xlsx');
      const workbook = XLSX.read(stream, { type: 'binary' });
      // Assuming the first sheet is the one we want, change as needed
      const sheetName = workbook.SheetNames[0];
      return sheetName || 'Sheet1';
    } else {
      return ''; // Unsupported file type, return an empty string
    }
  };

  return (
    <Box>
      <input type="file" onChange={handleFileChange} accept=".rps" style={{ display: 'none' }} id="file-upload" />
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
    </Box>
  );
};

export default FileUploadForm;
