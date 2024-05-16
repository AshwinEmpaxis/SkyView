import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Box,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TablePagination,
  Button,
  Divider,
  Stack
} from '@mui/material';
import * as XLSX from 'xlsx';

const Exporter13F = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:6060/Service.svc/exportFinalReportService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flag: 'report'
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.text();
      const parsedData = parseData(responseData);
      setTableData(parsedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const parseData = (responseData) => {
    const lines = responseData.split('\n');
    const filteredLines = lines.slice(1);
    const parsedData = filteredLines.map((line, index) => {
      const row = line.split(',');
      row.unshift(index + 1);
      return row;
    });
    return parsedData;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportCSV = () => {
    if (!tableData || tableData.length === 0) {
      console.error('Table data is not available.');
      return;
    }

    const header = ['Sr. No', 'CUSIP', 'Description', 'Shares', 'MV (000)'];
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...tableData].map((row) => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleExportXML = () => {
    if (!tableData || tableData.length === 0) {
      console.error('Table data is not available.');
      return;
    }

    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<TableData>\n';
    const header = ['Sr. No', 'CUSIP', 'Description', 'Shares', 'MV (000)'];
    xmlContent += `<Row id="header">\n${header.map((cell) => `  <Cell>${cell}</Cell>`).join('\n')}\n</Row>\n`;
    tableData.forEach((row, index) => {
      xmlContent += `<Row id="${index + 1}">\n`;
      row.forEach((cell) => {
        xmlContent += `  <Cell>${cell}</Cell>\n`;
      });
      xmlContent += `</Row>\n`;
    });
    xmlContent += '</TableData>';

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', 'export.xml');
    document.body.appendChild(link);
    link.click();
  };

  const handleExportExcel = () => {
    if (!tableData || tableData.length === 0) {
      console.error('Table data is not available.');
      return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet([['Sr. No', 'CUSIP', 'Description', 'Shares', 'MV (000)'], ...tableData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'export.xlsx');
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} p={1}>
          <Button variant="contained" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="contained" onClick={handleExportXML}>
            Export XML
          </Button>
          <Button variant="contained" onClick={handleExportExcel}>
            Export Excel
          </Button>
        </Stack>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr. No</TableCell>
              <TableCell>CUSIP</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Shares</TableCell>
              <TableCell align="center">MV (000)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(loading || error || tableData.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography variant="body1" color="error">
                      Error: {error.message}
                    </Typography>
                  ) : (
                    <Typography variant="body1">Data not found.</Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Exporter13F;
