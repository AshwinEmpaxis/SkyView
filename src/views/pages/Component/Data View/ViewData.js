import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import { saveAs } from 'file-saver';
import GetAppIcon from '@mui/icons-material/GetApp';

// Main component definition
export default function Main() {
  // State variables
  const [tables, setTables] = useState([]);
  const [selectedTableData, setSelectedTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [exportFlag, setExportFlag] = useState('');
  const [selectedTableName, setSelectedTableName] = useState('');

  // Function to fetch table data from the API when the component mounts
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:6060/Service.svc/countLoadedDataService');
        console.log('Response data:', response.data);
        const formattedData = response.data.map((item) => ({
          TableName: item[0].Key,
          Records: item[0].Value.split('#')[0],
          LastUpdatedDate: item[0].Value.split('#')[1]
        }));
        setTables(formattedData);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  // Function to fetch full data of the selected table
  const fetchDataForTable = async (tableName) => {
    setLoading(true);
    try {
      let responseData = [];
      let response;
      switch (tableName) {
        case 'RPS':
          response = await axios.post(
            'http://localhost:6060/Service.svc/showLoadedDataServivce',
            { flag: tableName },
            { headers: { 'Content-Type': 'application/json' } }
          );
          responseData = response.data.response.rPSDatas || [];
          break;

        case 'SecurityMaster':
          const securityResponse = await axios.post(
            'http://localhost:6060/Service.svc/showLoadedDataServivce',
            { flag: 'SECURITYMASTER' },
            { headers: { 'Content-Type': 'application/json' } }
          );
          console.log('Security Master Response:', securityResponse.data);
          responseData = securityResponse.data.response.securityDatas || [];
          break;

        case 'AlphaDesk':
          const alphaResponse = await axios.post(
            'http://localhost:6060/Service.svc/showLoadedDataServivce',
            { flag: 'ALPHADESK' },
            { headers: { 'Content-Type': 'application/json' } }
          );

          console.log('Alphadesk  Response:', alphaResponse.data);

          responseData = alphaResponse.data.response.alphadeskDatas || [];
          break;

        case 'AccountMaster':
          const accountMasterResponse = await axios.post(
            'http://localhost:6060/Service.svc/accountMasterDataServivce',
            { flag: 'AccountMaster' },
            { headers: { 'Content-Type': 'application/json' } }
          );

          console.log('AccountMaster  Response:', accountMasterResponse.data);

          responseData = accountMasterResponse.data.response.accountMasterDatas || [];
          break;

        default:
          console.error('Invalid table name:', tableName);
          break;
      }
      setSelectedTableName(tableName);
      setSelectedTableData(responseData);
      setError(null);
      // Set the export flag to the current table name
      setExportFlag(tableName);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setError('Error fetching table data');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Function to handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to export data using API
  const exportData = async () => {
    try {
      const response = await axios.post(
        'http://localhost:6060/Service.svc/exportCSVLoadedDataServivce',
        { flag: exportFlag },
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'text/csv' });
      saveAs(blob, `${exportFlag}_data.csv`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Rendering the UI
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={{
          flexGrow: 0.5,
          p: 3,
          marginTop: '55px',
          justifyContent: 'center'
        }}
      >
        <AppBar position="sticky" sx={{ bgcolor: 'grey.300' }}>
          <Toolbar>
            <Typography variant="h6" color={'black'}>
              View Loaded Data
            </Typography>
          </Toolbar>
        </AppBar>
        <Container>
          <Box sx={{ marginTop: '64px' }}>
            <Box
              sx={{
                borderBottom: '1px solid #ccc',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Grid container spacing={2} justifyContent={'center'} p={2}>
                {tables.map((table, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          onClick={() => fetchDataForTable(table.TableName)}
                          sx={{ color: 'steelblue', fontWeight: 'bold' }}
                        >
                          {table.TableName}
                        </Typography>
                        <Typography variant="body1">No. of Records: {table.Records}</Typography>
                        <Typography variant="body1">Last Updated Date: {table.LastUpdatedDate}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* Additional table container for displaying fetched data */}
            <Box sx={{ marginTop: '32px' }}>
              {selectedTableName === 'SecurityMaster' && (
                <TableContainer component={Paper}>
                  <Typography variant="h6" color={'black'}>
                    SecurityMaster Data
                  </Typography>

                  <Box
                    sx={{
                      marginTop: '16px',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button onClick={exportData} startIcon={<GetAppIcon />}>
                      Export to CSV
                    </Button>
                  </Box>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ fontWeight: 'bold' }}>
                        <TableCell>CUSIP</TableCell>
                        <TableCell>DESCRIPTION</TableCell>
                        {/* <TableCell>id</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? selectedTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : selectedTableData
                      ).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.CUSIP}</TableCell>
                          <TableCell>{item.DESCRIPTION}</TableCell>
                          {/* <TableCell>{item.id}</TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    component="div"
                    count={selectedTableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              )}
              {selectedTableName === 'RPS' && (
                <Box>
                  <Typography variant="h6" color={'black'}>
                    RPS Data
                  </Typography>

                  <Box
                    sx={{
                      marginTop: '16px',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button onClick={exportData} startIcon={<GetAppIcon />}>
                      Export to CSV
                    </Button>
                  </Box>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ fontWeight: 'bold' }}>
                          <TableCell>Account ID</TableCell>
                          <TableCell>Business Date</TableCell>
                          <TableCell>CUSIP</TableCell>
                          <TableCell>Custodian ID</TableCell>
                          <TableCell>ISIN</TableCell>
                          <TableCell>Master Account Name</TableCell>
                          <TableCell>Master Account Number</TableCell>
                          <TableCell>SEDOL</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0
                          ? selectedTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          : selectedTableData
                        ).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.AccountID}</TableCell>
                            <TableCell>{item.BusinessDate}</TableCell>
                            <TableCell>{item.CUSIP}</TableCell>
                            <TableCell>{item.CustodianID}</TableCell>
                            <TableCell>{item.ISIN}</TableCell>
                            <TableCell>{item.MasterAccountName}</TableCell>
                            <TableCell>{item.MstrAcctNumber}</TableCell>
                            <TableCell>{item.SEDOL}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      component="div"
                      count={selectedTableData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </Box>
              )}
              {selectedTableName === 'AlphaDesk' && (
                <Box>
                  <Typography variant="h6" color={'black'}>
                    AlphaDesk Data
                  </Typography>

                  <Box
                    sx={{
                      marginTop: '16px',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button onClick={exportData} startIcon={<GetAppIcon />}>
                      Export to CSV
                    </Button>
                  </Box>
                  <TableContainer component={Paper}>
                    <Table>
                      {/* Render table head with column names */}
                      <TableHead>
                        <TableRow sx={{ fontWeight: 'bold' }}>
                          <TableCell>Alpha ID</TableCell>
                          <TableCell>Alpha Desc</TableCell>
                          {/* Add more column names as needed */}
                        </TableRow>
                        {/* "COMPANYSYMBOL": "CASH USD",
                "CURRENCY": "USD",
                "CUSIP": "",
                "DESCRIPTION": "USD CASH BALANCE",
                "SECURITY": "CASH USD",
                "SECURITYTYPE": "Cash",
                "TOTALQUANTITY": "5.88" */}
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0
                          ? selectedTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          : selectedTableData
                        ).map((item, index) => (
                          <TableRow key={index}>
                            {/* Render table cells with data */}
                            <TableCell>{item.COMPANYSYMBOL}</TableCell>
                            <TableCell>{item.CURRENCY}</TableCell>
                            {/* Add more table cells for additional data */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      component="div"
                      count={selectedTableData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </Box>
              )}
              {selectedTableName === 'AlphaDesk' && (
                <Box>
                  <Typography variant="h6" color={'black'}>
                    AlphaDesk Data
                  </Typography>

                  <Box
                    sx={{
                      marginTop: '16px',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button onClick={exportData} startIcon={<GetAppIcon />}>
                      Export to CSV
                    </Button>
                  </Box>
                  <TableContainer component={Paper}>
                    <Table>
                      {/* Render table head with column names */}
                      <TableHead>
                        <TableRow sx={{ fontWeight: 'bold' }}>
                          <TableCell>Alpha ID</TableCell>
                          <TableCell>Alpha Desc</TableCell>
                          {/* Add more column names as needed */}
                        </TableRow>
                        {/* "COMPANYSYMBOL": "CASH USD",
                "CURRENCY": "USD",
                "CUSIP": "",
                "DESCRIPTION": "USD CASH BALANCE",
                "SECURITY": "CASH USD",
                "SECURITYTYPE": "Cash",
                "TOTALQUANTITY": "5.88" */}
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0
                          ? selectedTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          : selectedTableData
                        ).map((item, index) => (
                          <TableRow key={index}>
                            {/* Render table cells with data */}
                            <TableCell>{item.COMPANYSYMBOL}</TableCell>
                            <TableCell>{item.CURRENCY}</TableCell>
                            {/* Add more table cells for additional data */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      component="div"
                      count={selectedTableData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
