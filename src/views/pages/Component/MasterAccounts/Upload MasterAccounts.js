// import React, { useState } from 'react';
// import axios from 'axios';
// import LinearProgress from '@mui/material/LinearProgress';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import CancelIcon from '@mui/icons-material/Cancel';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import Table from '@mui/material/Table';
// import TableHead from '@mui/material/TableHead';
// import TableBody from '@mui/material/TableBody';
// import TableRow from '@mui/material/TableRow';
// import TableCell from '@mui/material/TableCell';

// const FileUploadForm = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileProgress, setFileProgress] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [uploadError, setUploadError] = useState('');
//   const [data, setData] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0]; // Only allow a single file
//     setSelectedFile(file);
//     setFileProgress(0); // Initialize progress for the file
//   };

//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setFileProgress(0);
//     setUploadError('');
//     setSuccessMessage('');
//     setData(null); // Clear data if any
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) {
//       setUploadError('No file selected for upload.');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const base64 = event.target.result.split(';base64,').pop();
//         const sheetName = await extractSheetName(selectedFile.name, base64); // Extract sheet name
//         const uploadedData = await postData(selectedFile.name, sheetName, base64, 0); // Pass sheetName to postData
//         setData(uploadedData); // Set data after successful upload
//       } catch (error) {
//         console.error('Error reading file:', error);
//       }
//     };

//     reader.readAsDataURL(selectedFile);
//   };

//   const postData = async (fileName, sheetName, stream, index) => {
//     try {
//       console.log('Uploading data...');
//       console.log('fileName:', fileName);
//       console.log('sheetName:', sheetName);
//       console.log('stream:', stream);

//       const jsonData = {
//         fileName: fileName,
//         sheetName: sheetName,
//         stream: stream
//       };

//       const response = await axios.post('http://localhost:6060/Service.svc/loadSecurityMasterService', jsonData, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//           setFileProgress(progress);
//         }
//       });

//       console.log('Data uploaded successfully!', response.data);
//       setSuccessMessage('File uploaded successfully!');
//       setUploadError('');
//       return response.data; // Return uploaded data
//     } catch (error) {
//       console.error('Error uploading data:', error.response.data);
//       setUploadError('Error uploading data: ' + error.response.data);
//       setSuccessMessage('');
//       throw error;
//     }
//   };

//   const extractSheetName = async (fileName, stream) => {
//     if (fileName.endsWith('.csv')) {
//       return 'Sheet1';
//     } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
//       // For XLSX or XLS files, use XLSX library to extract sheet name
//       const XLSX = require('xlsx');
//       const workbook = XLSX.read(stream, { type: 'binary' });
//       // Assuming the first sheet is the one we want, change as needed
//       const sheetName = workbook.SheetNames[0];
//       return sheetName || '';
//     } else {
//       return ''; // Unsupported file type, return an empty string
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSuccessMessage('');
//     setUploadError('');
//   };

//   const renderDataTable = () => {
//     if (data) {
//       return (
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Master Account No.</TableCell>
//               <TableCell>Master Account Name</TableCell>
//               <TableCell>TRN Number</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell>{item.masterAccountNo}</TableCell>
//                 <TableCell>{item.masterAccountName}</TableCell>
//                 <TableCell>{item.trnNumber}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       );
//     } else {
//       return null;
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" sx={{ backgroundColor: '#d1c4e9', padding: '10px', marginBottom: '10px' }}>
//         Upload Master Accounts
//       </Typography>
//       <hr />
//       <input type="file" onChange={handleFileChange} accept=".csv, .xlsx, .xls" style={{ display: 'none' }} id="file-upload" />
//       <label htmlFor="file-upload">
//         <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ m: 1.5 }}>
//           Choose File
//         </Button>
//       </label>
//       {selectedFile && (
//         <Box>
//           <span>
//             <LinearProgress variant="determinate" value={fileProgress} />
//             <Typography variant="body1">
//               File Name: {selectedFile.name} &nbsp; Size: {(selectedFile.size / 1024).toFixed(2)} KB
//             </Typography>
//           </span>
//           <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleRemoveFile} sx={{ mb: 2 }}>
//             Remove
//           </Button>
//         </Box>
//       )}
//       <Button variant="contained" onClick={handleSubmit} disabled={!selectedFile} sx={{ ml: 1 }}>
//         Upload
//       </Button>
//       <Snackbar open={!!successMessage || !!uploadError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//         <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"}>
//           {successMessage ? successMessage : uploadError}
//         </MuiAlert>
//       </Snackbar>
//       {renderDataTable()}
//     </Box>
//   );
// };

// export default FileUploadForm;

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
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const LoadMasterAccntData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileProgress, setFileProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [data, setData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Only allow a single file
    setSelectedFile(file);
    setFileProgress(0); // Initialize progress for the file
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileProgress(0);
    setUploadError('');
    setSuccessMessage('');
    setData(null); // Clear data if any
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError('No file selected for upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target.result.split(';base64,').pop();
        const sheetName = await extractSheetName(selectedFile.name, base64); // Extract sheet name
        const uploadedData = await postData(selectedFile.name, sheetName, base64, 0); // Pass sheetName to postData
        setData(uploadedData); // Set data after successful upload
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
      setUploadError('');
      return response.data; // Return uploaded data
    } catch (error) {
      console.error('Error uploading data:', error.response.data);
      setUploadError('Error uploading data: ' + error.response.data);
      setSuccessMessage('');
      throw error;
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
    setUploadError('');
  };

  const renderDataTable = () => {
    if (data) {
      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Master Account No.</TableCell>
              <TableCell>Master Account Name</TableCell>
              <TableCell>TRN Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.masterAccountNo}</TableCell>
                <TableCell>{item.masterAccountName}</TableCell>
                <TableCell>{item.trnNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    } else {
      return null;
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ backgroundColor: '#d1c4e9', padding: '10px', marginBottom: '10px' }}>
        Upload Master Accounts
      </Typography>
      <hr />
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
      <Snackbar open={!!successMessage || !!uploadError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={successMessage ? 'success' : 'error'}>
          {successMessage ? successMessage : uploadError}
        </MuiAlert>
      </Snackbar>
      {renderDataTable()}
    </Box>
  );
};

export default LoadMasterAccntData;
