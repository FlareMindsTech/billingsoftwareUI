import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import logoleft from '../images/logi-right.png';
import logoRight from '../images/logo-left.png';
import { getBase64ImageFromUrl } from './getBase64Image';

export const generateBillPdf = async (bill) => {
  const leftLogoBase64 = await getBase64ImageFromUrl(logoleft);
  const rightLogoBase64 = await getBase64ImageFromUrl(logoRight);

  const doc = new jsPDF();
  const lineHeight = 7;
  const marginX = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 10;

  // Logos
  doc.addImage(leftLogoBase64, 'PNG', 10, y, 30, 30);
  doc.addImage(rightLogoBase64, 'PNG', pageWidth - 40, y, 30, 30);

  // TAX BILL
  doc.setFontSize(10).setFont('helvetica', 'bold').setTextColor(0, 0, 0);
  doc.text('TAX BILL', pageWidth / 2, y + 5, { align: 'center' });

  y += 18;

  // Company Name - Red
  doc.setFontSize(14).setFont('helvetica', 'bold').setTextColor(255, 0, 0);
  doc.text('TRITECH SYSTEMS', pageWidth / 2, y, { align: 'center' });

  y += lineHeight;

  // Green sub text
  doc.setFontSize(10).setTextColor(0, 150, 0);
  doc.text('All Kind Of HazardousWaste & Non Hazardous waste service care:', pageWidth / 2, y, { align: 'center' });

  y += lineHeight;

  // Contact Info
  doc.setFontSize(9).setFont('helvetica', 'normal').setTextColor(0, 0, 0);
  doc.text('17 A, Kumaran Colony, Ammapalayam, Tirupur, Tamil Nadu, 641654,', pageWidth / 2, y, { align: 'center' }); y += lineHeight;
  doc.text('Cell No: 8940644004.', pageWidth / 2, y, { align: 'center' }); y += lineHeight;
  doc.text('Email Id: tritechsystems2011@gmail.com', pageWidth / 2, y, { align: 'center' });

  y += lineHeight;

  // GST & PAN
  const gstin = 'GSTIN: 33FCJPS9117J1Z3';
  const pan = 'PAN No: FCJPS9117J';
  const middle = pageWidth / 2;
  const gstinWidth = doc.getTextWidth(gstin);
  doc.setFont('helvetica', 'bold');
  doc.text(gstin, middle - gstinWidth / 2 - 20, y);
  doc.text(pan, middle + 20, y);

  y += lineHeight + 4;

  // Bill To
  doc.setFontSize(10).text('To:', marginX, y); y += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.text(`M/S. ${bill.customerName}`, marginX + 10, y); y += lineHeight;
  doc.text(`${bill.customerAddress}`, marginX + 10, y); y += lineHeight;
  doc.text(`GSTIN: ${bill.customerGstin}`, marginX + 10, y); y += lineHeight + 2;

  doc.text(`Date: ${moment(bill.date || bill.createdAt).format('DD/MM/YYYY')}`, marginX, y);
  doc.text(`PO No: ${bill.poNo || '-'}`, marginX + 60, y);
  doc.text(`Bill No: ${bill.billNo}`, pageWidth - 60, y); y += lineHeight;
  doc.text(`Vehicle No: ${bill.vehicleNo || '-'}`, marginX, y); y += lineHeight + 2;

  // Items
  const itemRows = bill.items.map((item, index) => [
    index + 1,
    item.description,
    item.quantity,
    `Rs.${item.price.toFixed(2)}`,
    `Rs.${(item.quantity * item.price).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['S.No', 'Particulars', 'Qty', 'Rate', 'Amount']],
    body: itemRows,
    theme: 'grid',
    styles: { fontSize: 9 },
    margin: { left: marginX, right: marginX }
  });

  y = doc.lastAutoTable.finalY + 6;

  // HSN & Tax
 doc.setFont('helvetica', 'bold');
doc.text('HSN CODE: 998595', marginX, y);
y += lineHeight;

const cgst = (bill.totalGst ?? 0) / 2;
const sgst = (bill.totalGst ?? 0) / 2;

doc.setFont('helvetica', 'normal');
doc.text('ADD: CGST 9%', marginX, y);
doc.text(`Rs.${cgst.toFixed(2)}`, pageWidth - marginX - 30, y);

y += lineHeight;

doc.text('ADD: SGST 9%', marginX, y);
doc.text(`Rs.${sgst.toFixed(2)}`, pageWidth - marginX - 30, y);

y += lineHeight; // move to next line for upcoming fields



  // NET
  doc.setFont('helvetica', 'bold');
  doc.text(`NET AMOUNT: Rs.${(bill.totalAmount ?? 0).toFixed(2)}`, marginX, y); y += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.text(`Rupees: ${convertToWords(Math.round(bill.totalAmount))} only`, marginX, y); y += lineHeight + 6;

  // Signature
  doc.setFont('helvetica', 'bold').text('For TRITECH SYSTEMS', pageWidth - 70, y); y += lineHeight;
  doc.setFont('helvetica', 'normal').text('Proprietor', pageWidth - 45, y);

  doc.save(`BILL-${bill.billNo || 'Unknown'}.pdf`);
};

// Amount to Words Converter (Indian Format & Fixed Grammar)

function convertToWords(num) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = num.toString()).length > 9) return 'Overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;

  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' ' : '';
  return str.trim();
}
