import React, { useState } from 'react';
import {
  Container, Typography, Paper, Grid, TextField, Box,
  TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Button, MenuItem
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';

const hsnOptions = [
  { code: '998595', label: 'Hazardous Waste Services' },
  { code: '998596', label: 'Non-Hazardous Waste Services' },
  { code: '998597', label: 'Disposal Services' },
  { code: '998598', label: 'Annual Maintenance' }
];

const DashboardPage = () => {
  const [billInfo, setBillInfo] = useState({
    customerName: '',
    customerAddress: '',
    customerGstin: '',
    vehicleNo: '',
    billNo: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const [items, setItems] = useState([
    { description: '', quantity: 1, price: 0, gst: 18, hsnCode: '' }
  ]);

  const [paidAmount, setPaidAmount] = useState(0);

  const handleBillFieldChange = (field, value) => {
    setBillInfo({ ...billInfo, [field]: value });
  };

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0, gst: 18, hsnCode: '' }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateRowTotal = (item) => {
    const totalWithoutGst = item.quantity * item.price;
    const gstAmount = (totalWithoutGst * item.gst) / 100;
    return (totalWithoutGst + gstAmount).toFixed(2);
  };

const gstRate = 18;
const cgstRate = gstRate / 2;
const sgstRate = gstRate / 2;

const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
const totalCgst = items.reduce((sum, item) => sum + ((item.quantity * item.price) * cgstRate) / 100, 0);
const totalSgst = items.reduce((sum, item) => sum + ((item.quantity * item.price) * sgstRate) / 100, 0);
const totalGst = totalCgst + totalSgst;

const totalAmount = subtotal + totalGst;
const balance = totalAmount - paidAmount;

  const paymentStatus = balance === 0 ? 'Paid' : 'Unpaid';

  const handleSaveBill = async () => {
    const payload = {
      ...billInfo,
      items: items.map(item => ({
  description: item.description,
  quantity: item.quantity,
  price: item.price,
  gstRate: 18,
  hsnCode: item.hsnCode
})),
subTotal: subtotal,
totalGst,
totalAmount,
paidAmount,
balance,
paymentStatus
    };

    try {
      const res = await fetch('http://localhost:8000/api/bills/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error saving');
      alert('✅ Bill created successfully!');
    } catch (err) {
      alert('❌ Create failed: ' + err.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        {/* Company Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">Tritech Systems</Typography>
          <Typography gutterBottom>17 A, Kumaran Colony, Ammapalayam, Tiruppur, Tamil Nadu, 641654</Typography>
          <Typography gutterBottom>Cell: 8940644004 | Email: tritechsystems2011@gmail.com</Typography>
          <Typography>GSTIN: 33FCJPS9117J1Z3 | PAN: FCJPS9117J</Typography>
        </Box>

        {/* Customer Details */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="Customer Name" fullWidth value={billInfo.customerName}
              onChange={(e) => handleBillFieldChange('customerName', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Customer Address" fullWidth value={billInfo.customerAddress}
              onChange={(e) => handleBillFieldChange('customerAddress', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="GSTIN" fullWidth value={billInfo.customerGstin}
              onChange={(e) => handleBillFieldChange('customerGstin', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Bill No" fullWidth value={billInfo.billNo}
              onChange={(e) => handleBillFieldChange('billNo', e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField label="Vehicle No" fullWidth value={billInfo.vehicleNo}
              onChange={(e) => handleBillFieldChange('vehicleNo', e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField type="date" label="Date" fullWidth InputLabelProps={{ shrink: true }}
              value={billInfo.date} onChange={(e) => handleBillFieldChange('date', e.target.value)} />
          </Grid>
        </Grid>

        {/* Items Table */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>HSN Code</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>GST %</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField value={item.description} size="small"
                      onChange={(e) => updateItem(index, 'description', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <TextField select size="small" value={item.hsnCode}
                      onChange={(e) => updateItem(index, 'hsnCode', e.target.value)}>
                      {hsnOptions.map(opt => (
                        <MenuItem key={opt.code} value={opt.code}>
                          {opt.code} - {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField type="number" value={item.quantity} size="small"
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} />
                  </TableCell>
                  <TableCell>
                    <TextField type="number" value={item.price} size="small"
                      onChange={(e) => updateItem(index, 'price', Number(e.target.value))} />
                  </TableCell>
                  <TableCell>
                    <TextField type="number" value={item.gst} size="small"
                      onChange={(e) => updateItem(index, 'gst', Number(e.target.value))} />
                  </TableCell>
                  <TableCell>{calculateRowTotal(item)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => removeItem(index)} color="error">
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7} align="right">
                  <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={addItem}>
                    Add Item
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <Box mt={4}>
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item xs={6} sm={3}><Typography>Subtotal:</Typography></Grid>
            <Grid item xs={6} sm={2}><Typography align="right">{subtotal.toFixed(2)}</Typography></Grid>

            <Grid item xs={6} sm={3}><Typography>Total GST:</Typography></Grid>
            <Grid item xs={6} sm={2}><Typography align="right">{totalGst.toFixed(2)}</Typography></Grid>

            <Grid item xs={6} sm={3}><Typography variant="h6">Total:</Typography></Grid>
            <Grid item xs={6} sm={2}><Typography variant="h6" align="right">{totalAmount.toFixed(2)}</Typography></Grid>

            <Grid item xs={6} sm={3}><Typography>Paid Amount:</Typography></Grid>
            <Grid item xs={6} sm={2}>
              <TextField type="number" size="small" value={paidAmount}
                onChange={e => setPaidAmount(Number(e.target.value))} />
            </Grid>

            <Grid item xs={6} sm={3}><Typography fontWeight={600}>Balance:</Typography></Grid>
            <Grid item xs={6} sm={2}><Typography fontWeight={600}>{balance.toFixed(2)}</Typography></Grid>

            <Grid item xs={6} sm={3}><Typography>Status:</Typography></Grid>
            <Grid item xs={6} sm={2}>
              <Typography color={paymentStatus === 'Paid' ? 'green' : 'red'} fontWeight={600}>
                {paymentStatus}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box mt={4} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="flex-end">
          <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSaveBill}>
            Save Bill
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
