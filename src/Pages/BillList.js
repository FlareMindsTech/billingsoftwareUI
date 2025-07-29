import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Button, Grid, Box, Modal, IconButton,
  Divider, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../context/Authcontext'; // ✅ make sure this is correct path
import { generateBillPdf } from '../utils/generateBillPdf';

const BillsList = () => {
  const { token } = useAuth();
const [paymentStatus, setPaymentStatus] = useState('');

  // 🔹 Filters
  const [dateRange, setDateRange] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [search, setSearch] = useState('');

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dateOptions = ['', 'Today', 'This Week', 'This Month', 'Custom'];

  const fetchBills = async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.customerName) params.append('name', filters.customerName);
      if (filters.search) params.append('search', filters.search);
      if (filters.paymentStatus) params.append('status', filters.paymentStatus);


      const response = await fetch(
        `https://billingsoftware-back-end.onrender.com/api/bills/getall?${params.toString()}`,
        {
          headers: {
            token: token // ✅ direct token header
          }
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch bills');

      setBills(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchBills({
      dateRange,
      startDate,
      endDate,
      customerName,
      search,
      paymentStatus,
    });
  };

  useEffect(() => {
    fetchBills(); // initial call with no filters
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 6 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
        Bill History
      </Typography>

      {/* Filters */}
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, mb: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Filter Bills</Typography>
        </Box>
        <Box component="form" onSubmit={handleFilter}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  label="Date Range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  {dateOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt === '' ? 'All' : opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Customer Name"
                fullWidth
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search Bill ID / Customer"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
  <FormControl fullWidth size="small">
    <InputLabel>Status</InputLabel>
    <Select
      value={paymentStatus}
      onChange={(e) => setPaymentStatus(e.target.value)}
      label="Status"
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="Paid">Paid</MenuItem>
      <MenuItem value="Unpaid">Unpaid</MenuItem>
    </Select>
  </FormControl>
</Grid>



            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2, px: 4, mt: 1 }}
                size="medium"
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Bill Table */}
      <Paper elevation={3} sx={{ borderRadius: 4 }}>
        {loading ? (
          <Typography sx={{ p: 2 }}>Loading...</Typography>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
        ) : (
          <TableContainer sx={{ maxHeight: { xs: 350, md: 600 } }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Bill ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill._id}>
                    <TableCell>{bill.billNo}</TableCell>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">{bill.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
  <Typography fontWeight="bold" color={bill.paymentStatus === 'Paid' ? 'green' : 'red'}>
    {bill.paymentStatus}
  </Typography>
</TableCell>

                    <TableCell>{bill.createdBy?.name || 'N/A'}</TableCell>
                    <TableCell>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          size="small"
          onClick={() => generateBillPdf(bill)}
        >
          PDF
        </Button>
      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default BillsList;
