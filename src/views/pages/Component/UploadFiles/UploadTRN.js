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
import CircularProgress from '@mui/material/CircularProgress';

const FileUploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const handleFileChange = (e) => {
    let files = Array.from(e.target.files);
    files = files.slice(0, 3 - selectedFiles.length);

    setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
    setFileProgress((prevFileProgress) => [...prevFileProgress, ...files.map(() => 0)]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setFileProgress((prevProgress) => {
      const updatedProgress = [...prevProgress];
      updatedProgress.splice(index, 1);
      return updatedProgress;
    });
  };

  const handleSubmit = async () => {
    setUploading(true);

    const uploadFile = async (index) => {
      if (index >= selectedFiles.length) {
        setOpenSnackbar(true);
        setUploading(false);
        return;
      }

      const file = selectedFiles[index];

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target.result.split(';base64,').pop();
          await postData(file.name, '', base64, index);
          uploadFile(index + 1);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        setUploading(false);
      }
    };

    uploadFile(0);
  };

  const postData = async (fileName, sheetName, stream, index) => {
    try {
      const jsonData = {
        fileName: fileName,
        sheetName: sheetName,
        stream: stream
      };

      const response = await axios.post('http://localhost:6060/Service.svc/loadRPSFileService', jsonData, {
        headers: {
          'Content-Type': 'application/json'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setFileProgress((prevProgress) => {
            const updatedProgress = [...prevProgress];
            updatedProgress[index] = progress;
            return updatedProgress;
          });
        }
      });

      console.log('Data uploaded successfully!', response.data);
    } catch (error) {
      console.error('Error uploading data:', error);
      setUploadError(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setUploadError(false); // Reset upload error state
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFiles = (files) => {
    const remainingSlots = 3 - selectedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...filesToAdd]);
    setFileProgress((prevFileProgress) => [...prevFileProgress, ...filesToAdd.map(() => 0)]);
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      sx={{
        border: isDragOver ? '2px dashed #2196f3' : '0px dashed #ccc',
        backgroundColor: isDragOver ? '#f0f8ff' : '#ffffff',
        borderRadius: 1
      }}
    >
      <input type="file" onChange={handleFileChange} accept=".rps" multiple style={{ display: 'none' }} id="file-upload" />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ m: 1.5 }}>
          Choose File
        </Button>
      </label>
      {selectedFiles.map((file, index) => (
        <Box key={index}>
          {fileProgress[index] < 100 ? (
            <CircularProgress variant="determinate" value={fileProgress[index] || 0} />
          ) : (
            <LinearProgress variant="determinate" value={fileProgress[index] || 0} />
          )}
          <Typography variant="body1">File Name: {file.name}</Typography>
          <Typography variant="body1">Size: {(file.size / 1024).toFixed(2)} KB</Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => handleRemoveFile(index)}
            disabled={uploading}
            sx={{ mb: 2 }}
          >
            Remove
          </Button>
        </Box>
      ))}
      <Button variant="contained" onClick={handleSubmit} disabled={uploading || selectedFiles.length === 0} sx={{ ml: 1 }}>
        Upload
      </Button>
      <Typography variant="body1" sx={{ m: 2 }}>
        {selectedFiles.length}/3 selected files
      </Typography>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={uploadError ? 'error' : 'success'}>
          {uploadError ? (
            'Failed to upload files. Please try again.'
          ) : (
            <>{selectedFiles.length === 3 ? 'All files uploaded successfully!' : 'Failed to upload files. Please try again.'}</>
          )}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default FileUploadForm;
