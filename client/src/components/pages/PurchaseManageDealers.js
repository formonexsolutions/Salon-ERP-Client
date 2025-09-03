import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Helper/helper';
import "../styles/ProductList.css";
import "../styles/PurchaseManageDealers.css";



// Helper function to format date as DD-MM-YYYY
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const PurchaseManageDealers = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const branchId = localStorage.getItem('branch_id');
        const salonId = localStorage.getItem('salon_id');

        if (!branchId || !salonId) {
          console.error('Branch ID or Salon ID not found in local storage.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/purchase-details-fetch`, {
          params: { branchId, salonId },
        });

        // console.log('API Response:', response.data);

        // Process and format the purchases
        const formattedPurchases = response.data.map(purchase => ({
          ...purchase,
          deliveryDate: purchase.deliveryDate ? formatDate(purchase.deliveryDate) : "",
        }));

        // Sort purchases by dealerId
        formattedPurchases.sort((a, b) => a.dealerId.localeCompare(b.dealerId));

        setPurchases(formattedPurchases);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error loading data: {error.message}</p>;
  }

  // Calculate S.No and group by dealerId
  let currentDealerId = null;
  let serialNo = 0;


  
  return (
    <div className="pd-container12">
      <table className="pd-table120">
        <thead className="thead878">
          <tr>
            <th className="pd-th12">S.No</th>
            <th className="pd-th12">Order ID</th>
            <th className="pd-th12">Category</th>
            <th className="pd-th12">Company</th>
            <th className="pd-th12">Product</th>
            <th className="pd-th12">Description</th>
            <th className="pd-th12">Quantity & Unit</th>
            <th className="pd-th12">Quantity</th>
            <th className="pd-th12">Available Quantity</th>
            <th className="pd-th12">Availability</th>
            <th className="pd-th12">Delivery Date</th>
            <th className="pd-th12">Order Status</th>
          </tr>
        </thead>
        <tbody className="thead87">
          {purchases.map((purchase, purchaseIndex) => {
            const isNewDealer = purchase.dealerId !== currentDealerId;
            if (isNewDealer) {
              currentDealerId = purchase.dealerId;
              serialNo = 1; // Reset serial number for new dealer
            } else {
              serialNo += 1; // Increment serial number for same dealer
            }

            return (
              <React.Fragment key={purchase.purchaseOrderId}>
                {isNewDealer && (
                  <tr className="dealer-heading">
                    <td colSpan="11" className="dealer-id-heading">
                      Dealer ID: {purchase.dealerId}
                    </td>
                  </tr>
                )}

                {purchase.products.map((item, itemIndex) => (
                  <tr key={`${purchase.purchaseOrderId}-${itemIndex}`}>
                    {itemIndex === 0 && (
                      <td className="customer-table11-td1" rowSpan={purchase.products.length}>
                        {serialNo}
                      </td>
                    )}
                    {itemIndex === 0 && (
                      <td className="pd-td12" rowSpan={purchase.products.length}>
                        {purchase.purchaseOrderId}
                      </td>
                    )}
                    <td className="pd-td12">{item.categoryName}</td>
                    <td className="pd-td12">{item.company}</td>
                    <td className="pd-td12">{item.productName}</td>
                    <td className="pd-td12">{item.productDescription}</td>
                    <td className="pd-td12">{item.quantity}{item.unit}</td>
                    <td className="pd-td12">{item.Productquantity}</td>
                    <td className="pd-td12 text-left443">{item.availableQuantity}</td>                   
                    <td className="pd-td12">{item.availability}</td>
                    {itemIndex === 0 && (
                      <>
                        <td className="pd-td12" rowSpan={purchase.products.length}>
                          {purchase.deliveryDate || "N/A"}
                        </td>
                        <td className="pd-td12" rowSpan={purchase.products.length}>
                          {purchase.status}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseManageDealers;
