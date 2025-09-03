import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import moment from 'moment-timezone';
import '../styles/PaymentSuccess.css';
import Salonlogo from "../images/Printlogo.png";

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 50,
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px 0",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bdbdbd",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bdbdbd",
  },
  tableCell: {
    margin: 5,
    fontSize: 12,
  },
});

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reference = location.state?.reference;
  const orderId = location.state?.order_id;
  const totalAmount = location.state?.totalAmount;
  const createdAt = location.state?.createdAt;

  const [registeredData, setRegisteredData] = useState({
    SalonName: '',
    adminName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const data = localStorage.getItem('registeredData');
    if (data) {
      setRegisteredData(JSON.parse(data));
    }
  }, []);

  // Convert createdAt to IST format with custom formatting
  const createdAtIST = moment(createdAt).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A');

  // PDF Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>OneSalon Subscription</Text>
              <Text style={styles.title}>Payment Details</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Image style={styles.image} src={Salonlogo} />
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Your Payment ID:</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Order ID:</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{orderId}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total Amount Paid Rs:</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{totalAmount.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Salon Name:</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{registeredData.SalonName}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Admin Name:</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{registeredData.adminName}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Phone Number:</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{registeredData.phoneNumber}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Paid At:</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{createdAtIST}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  const handleCombinedAction = async () => {
    const doc = <MyDocument />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment_details.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    localStorage.clear();
    navigate("/"); // Navigate to the login page
  };

  return (
    <div className='Payment_cont_succe'>
      <div className='card'>
        <h1>Payment Successful</h1>
        <div>
          <p>Your Payment ID:</p>
          <strong>{reference}</strong>
        </div>
        <div>
          <p>Order ID:</p>
          <strong>{orderId}</strong>
        </div>
        <div>
          <p>Total Amount Paid Rs:</p>
          <strong>{totalAmount.toFixed(2)}</strong>
        </div>
        <div>
          <p>Salon Name:</p>
          <strong>{registeredData.SalonName}</strong>
        </div>
        <div>
          <p>Admin Name:</p>
          <strong>{registeredData.adminName}</strong>
        </div>
        <div>
          <p>Phone Number:</p>
          <strong>{registeredData.phoneNumber}</strong>
        </div>
        <div>
          <p>Paid At:</p>
          <strong>{createdAtIST}</strong>
        </div>
        <button className="btn1" type='button' onClick={handleCombinedAction}>Download PDF & Return to Login</button>
      </div>
    </div>
  );
};

export default PaymentSuccess;