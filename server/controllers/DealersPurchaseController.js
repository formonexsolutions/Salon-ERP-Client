// // const PurchaseProduct = require('../models/DealersPurchaseModel');

// // async function generatePurchaseOrderId() {
// //   const lastPurchase = await PurchaseProduct.findOne().sort({ createdAt: -1 }).exec();
// //   let newId = 'PURCORDE_ID001'; // Default ID

// //   if (lastPurchase) {
// //     const lastId = lastPurchase.purchaseOrderId;
// //     const idNumber = parseInt(lastId.split('_ID')[1], 10) + 1;
// //     newId = `PURCORDE_ID${idNumber.toString().padStart(3, '0')}`;
// //   }

// //   return newId;
// // }


// // exports.dealsavePurchase = async (req, res) => {
// //   try {
// //     const {
// //       purchaseDate,
// //       // billNumber,
// //       branchId,
// //       branchName,
// //       salonId,
// //       // paymentType,
// //       address,
// //       phoneNumber,
// //       companyName,
// //       tableData,
// //       createdBy,
// //       modifiedBy,
// //       createdAt,
// //       modifiedAt
// //     } = req.body;

// //     // Validate required fields
// //     if (
// //       !purchaseDate ||
// //       // !billNumber ||
// //       !branchId ||
// //       !branchName ||
// //       !salonId ||
// //       !tableData ||
// //       !createdBy ||
// //       !modifiedBy
// //     ) {
// //       // console.log('Validation failed:', req.body);
// //       return res.status(400).json({ error: 'Please fill all the required fields' });
// //     }

   
// //     const dealpurchaseData = {
// //       purchaseOrderId,
// //       purchaseDate,
// //       // billNumber,
// //       address,
// //       phoneNumber,
// //       branchId,
// //       branchName,
// //       salonId,
// //       // paymentType,
// //       companyName,
// //       createdBy,
// //       createdAt: createdAt || new Date(),
// //       modifiedBy,
// //       modifiedAt: modifiedAt || new Date(),
// //       tableData: tableData.map(entry => ({
// //         product: entry.product,
// //         quantity: entry.quantity,
// //         cp: entry.cp,
// //       }))
// //     };

// //     const newDealPurchase = new PurchaseProduct(dealpurchaseData);
// //     await newDealPurchase.save();

// //     res.status(201).json({ message: 'Purchase saved successfully', purchase: newDealPurchase });
// //   } catch (error) {
// //     console.error('Error saving purchase:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // };



// // exports.dealReadStock = async (req, res) => {
// //   try {
// //     const { salon_id } = req.query; // Read salon_id from query parameters

// //     if (!salon_id) {
// //       return res.status(400).json({ message: 'Salon ID is required' });
// //     }

// //     const properties = await PurchaseProduct.find({ salonId: salon_id });
// //     if (!properties.length) {
// //       // return res.status(404).json({ message: 'No stock data found for the given salon ID' });
// //     }

// //     res.status(200).json(properties);
// //   } catch (error) {
// //     console.error('Error fetching properties:', error);
// //     res.status(500).json({ error: 'Internal server error.' });
// //   }
// // };

// const PurchaseProduct = require('../models/DealersPurchaseModel');

// // Helper function to generate the next Purchase Order ID
// async function generatePurchaseOrderId() {
//   const lastPurchase = await PurchaseProduct.findOne().sort({ createdAt: -1 }).exec();
//   let newId = 'PURCORDE_ID001'; // Default ID

//   if (lastPurchase && lastPurchase.purchaseOrderId) {
//     const lastId = lastPurchase.purchaseOrderId;
//     const idNumber = parseInt(lastId.split('_ID')[1], 10) + 1;
//     newId = `PURCORDE_ID${idNumber.toString().padStart(3, '0')}`;
//   }

//   return newId;
// }

// exports.dealsavePurchase = async (req, res) => {
//   try {
//     const {
//       purchaseDate,
//       branchId,
//       branchName,
//       salonId,
//       address,
//       phoneNumber,
//       companyName,
//       tableData,
//       createdBy,
//       modifiedBy,
//       createdAt,
//       modifiedAt
//     } = req.body;

//     // Validate required fields
//     if (
//       !purchaseDate ||
//       !branchId ||
//       !branchName ||
//       !salonId ||
//       !tableData ||
//       !createdBy ||
//       !modifiedBy
//     ) {
//       return res.status(400).json({ error: 'Please fill all the required fields' });
//     }

//     // Generate the new Purchase Order ID
//     const purchaseOrderId = await generatePurchaseOrderId();

//     const dealpurchaseData = {
//       purchaseOrderId,
//       purchaseDate,
//       address,
//       phoneNumber,
//       branchId,
//       branchName,
//       salonId,
//       companyName,
//       createdBy,
//       createdAt: createdAt || new Date(),
//       modifiedBy,
//       modifiedAt: modifiedAt || new Date(),
//       tableData: tableData.map(entry => ({
//         product: entry.product,
//         quantity: entry.quantity,
//         cp: entry.cp,
//       }))
//     };

//     const newDealPurchase = new PurchaseProduct(dealpurchaseData);
//     await newDealPurchase.save();

//     res.status(201).json({ message: 'Purchase saved successfully', purchase: newDealPurchase });
//   } catch (error) {
//     console.error('Error saving purchase:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.dealReadStock = async (req, res) => {
//   try {
//     const { salon_id } = req.query;

//     if (!salon_id) {
//       return res.status(400).json({ message: 'Salon ID is required' });
//     }

//     const properties = await PurchaseProduct.find({ salonId: salon_id });
//     if (!properties.length) {
//       return res.status(404).json({ message: 'No stock data found for the given salon ID' });
//     }

//     res.status(200).json(properties);
//   } catch (error) {
//     console.error('Error fetching properties:', error);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// };
// Helper function to generate the next Purchase Order ID
// async function generatePurchaseOrderId(dealerId) {
//   // Find the last purchase order for the specific dealer
//   const lastPurchase = await PurchaseProduct.findOne({ dealerId }).sort({ createdAt: -1 }).exec();
  
//   let newId = `PURCORDE_ID001`; // Default ID for a new dealer

//   // If there is a previous purchase order for the dealer, increment the ID
//   if (lastPurchase && lastPurchase.purchaseOrderId) {
//     const lastId = lastPurchase.purchaseOrderId.replace('PURCORDE_ID', '');
//     const idNumber = parseInt(lastId, 10);
    
//     if (!isNaN(idNumber)) {
//       const newNumber = idNumber + 1;
//       newId = `PURCORDE_ID${newNumber.toString().padStart(3, '0')}`;
//     }
//   }

//   return newId;
// }
const PurchaseProduct = require('../models/DealersPurchaseModel');

async function generatePurchaseOrderId(dealerId) {
  // Find the last purchase for the specific dealer
  const lastPurchase = await PurchaseProduct.findOne({ dealerId }).sort({ createdAt: -1 }).exec();
  let newId = `PURCORDE_ID001`; // Default ID for the first purchase of a dealer

  if (lastPurchase && lastPurchase.purchaseOrderId) {
    const lastId = lastPurchase.purchaseOrderId;
    const idNumber = parseInt(lastId.split('_ID')[1], 10) + 1;
    newId = `PURCORDE_ID${idNumber.toString().padStart(3, '0')}`;
  }

  return newId;
}


exports.dealsavePurchase = async (req, res) => {
  try {
    const {
      purchaseDate,
      branchId,
      branchName,
      salonId,
      address,
      phoneNumber,
      companyName,
      tableData,
      dealerName,
      dealerPhone,
      dealerId,
      state,
      city,
      area,
      dealerCompany,
      createdBy,
      modifiedBy,
      createdAt,
      modifiedAt
    } = req.body;

    // Validate required fields
    if (
      !purchaseDate ||
      !branchId ||
      !branchName ||
      !salonId ||
      !tableData ||
      !createdBy ||
      !dealerPhone ||
      !dealerId ||
      !state ||
      !city ||
      !area ||
      !dealerCompany ||
      !modifiedBy
    ) {
      return res.status(400).json({ error: 'Please fill all the required fields' });
    }

    // Generate the new Purchase Order ID
    const purchaseOrderId = await generatePurchaseOrderId(dealerId);

    const dealpurchaseData = {
      purchaseOrderId,
      purchaseDate,
      address,
      phoneNumber,
      branchId,
      branchName,
      salonId,
      dealerName,
      dealerPhone,
      dealerId,
      state,
      city,
      area,
      dealerCompany,
      companyName,
      status: 'Ordered', // Set initial status to 'ordered'
      createdBy,
      createdAt: createdAt || new Date(),
      modifiedBy,
      modifiedAt: modifiedAt || new Date(),
      tableData: tableData.map(entry => ({
        categoryName: entry.categoryName,
        company: entry.company,
        productName: entry.productName,
        productDescription: entry.productDescription,
        Productquantity: entry.Productquantity,
        quantity: entry.quantity,
        unit: entry.unit,
      }))
    };

    const newDealPurchase = new PurchaseProduct(dealpurchaseData);
    await newDealPurchase.save();

    res.status(201).json({ message: 'Purchase saved successfully', purchase: newDealPurchase });
  } catch (error) {
    console.error('Error saving purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ... (rest of the code remains unchanged)


exports.dealReadStock = async (req, res) => {
  try {
    const { salon_id } = req.query;

    if (!salon_id) {
      return res.status(400).json({ message: 'Salon ID is required' });
    }

    const properties = await PurchaseProduct.find({ salonId: salon_id });
    if (!properties.length) {
      return res.status(404).json({ message: 'No stock data found for the given salon ID' });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getBranchDetails = async (req, res) => {
  try {
      const { dealerId } = req.query;

      if (!dealerId) {
        return res.status(400).json({ message: 'Dealer ID is required' });
      }

      const branches = await PurchaseProduct.find({ dealerId }, 'branchName address phoneNumber');
      res.status(200).json(branches);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
exports.getProductsByBranch = async (req, res) => {
  const { branchName } = req.params;
  const { dealerId } = req.query;

  try {
    const products = await PurchaseProduct.find({ branchName, dealerId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateDeliveryDate = async (req, res) => {
  const { orderId, deliveryDate } = req.body;

  try {
    const order = await PurchaseProduct.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryDate = new Date(deliveryDate);
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating delivery date:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const validStatuses = ['Accepted', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await PurchaseProduct.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.updateProductAvailability = async (req, res) => {
  const { orderId, productId, availability } = req.body;

  try {
    const order = await PurchaseProduct.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    const product = order.tableData.id(productId);
    if (!product) {
      return res.status(404).send({ message: 'Product not found in order' });
    }

    product.availability = availability;
    await order.save();

    res.send({ message: 'Product availability updated successfully' });
  } catch (error) {
    console.error('Error updating product availability:', error);
    res.status(500).send({ message: 'Server error' });
  }
};
exports.getPurchaseDetails = async (req, res) => {
  try {
    const { branchId, dealerId } = req.query;

    if (!branchId || !dealerId) {
      return res.status(400).json({ message: 'Branch ID and Dealer ID are required' });
    }

    // Find purchases based on branchId and dealerId, including deliveryDate
    const purchases = await PurchaseProduct.find({ branchId, dealerId }, 'purchaseOrderId tableData modifiedAt status deliveryDate').lean().exec();

    

    const formattedPurchases = purchases.map(purchase => ({
      purchaseOrderId: purchase.purchaseOrderId,
      products: purchase.tableData.map(item => ({
        product: item.product,
        availability: item.availability,
        productId: item.productId
      })),
      deliveryDate: (purchase.deliveryDate), // Format date as DD-MM-YYYY
      status: purchase.status,
    }));

    res.status(200).json(formattedPurchases);
  } catch (error) {
    console.error('Error fetching purchase details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.fetchPurchaseDetails = async (req, res) => {
  try {
    const { branchId, salonId } = req.query;

    if (!branchId || !salonId) {
      return res.status(400).json({ message: 'Branch ID and Salon ID are required' });
    }

    // Find purchases based on branchId and salonId
    const purchases = await PurchaseProduct.find({ branchId, salonId }).lean().exec();

    // Initialize serial number and tracking variables
    let serialNo = 0;
    let lastDealerId = null;

    // Format and serialize purchases based on dealerId
    const formattedPurchases = purchases.map(purchase => {
      // Reset serial number for a new dealer
      if (purchase.dealerId !== lastDealerId) {
        serialNo = 1;
        lastDealerId = purchase.dealerId;
      } else {
        serialNo += 1;
      }

      return {
        serialNo,  // Add the serial number to the purchase details
        purchaseOrderId: purchase.purchaseOrderId,
        products: purchase.tableData.map(item => ({
          product: item.product,
          availability: item.availability,
          productId: item.productId,
          categoryName: item.categoryName,
          company: item.company,
          productName: item.productName,
          availableQuantity: item.availableQuantity,
          productDescription: item.productDescription,
          Productquantity: item.Productquantity,
          unit: item.unit,
          quantity: item.quantity
        })),
        deliveryDate: purchase.deliveryDate ? new Date(purchase.deliveryDate).toISOString().split('T')[0] : null, // Format date as YYYY-MM-DD
        status: purchase.status,
        dealerId: purchase.dealerId,
      };
    });

    res.status(200).json(formattedPurchases);
  } catch (error) {
    console.error('Error fetching purchase details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





exports.updateAvailableQuantitys = async (req, res) => {
  try {
    const { orderId, productId, availability, availableQuantity } = req.body;

    // Find the specific order
    const order = await PurchaseProduct.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the specific product within the order's tableData
    const product = order.tableData.id(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found in the order" });
    }

    // Update the product details
    product.availability = availability;
    product.availableQuantity = availableQuantity;

    // Save the updated order
    await order.save();

    return res.status(200).json({ message: "Product details updated successfully" });
  } catch (error) {
    console.error("Error updating product details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderStatistics = async (req, res) => {
  try {
    const { dealerId } = req.query;

    if (!dealerId) {
      return res.status(400).json({ message: 'Dealer ID is required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Count total orders (all statuses included)
    const totalOrders = await PurchaseProduct.countDocuments({ 
      dealerId 
    });

    // Count unviewed today's orders
    const todayOrders = await PurchaseProduct.countDocuments({ 
      dealerId, 
      createdAt: { $gte: today, $lte: endOfDay },
      viewed: false // only count unviewed orders
    });

    // Count pending orders (including Accepted and Ordered)
    const pendingOrders = await PurchaseProduct.countDocuments({ 
      dealerId, 
      status: { $in: ['Accepted', 'Ordered'] } 
    });

    // Count delivered orders
    const deliveredOrders = await PurchaseProduct.countDocuments({ 
      dealerId, 
      status: 'Delivered' 
    });

    // Count cancelled orders
    const cancelledOrders = await PurchaseProduct.countDocuments({ 
      dealerId, 
      status: 'Cancelled' 
    });

    res.status(200).json({
      totalOrders,
      todayOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.markOrdersAsViewed = async (req, res) => {
  try {
    const { dealerId } = req.body;

    if (!dealerId) {
      return res.status(400).json({ message: 'Dealer ID is required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    await PurchaseProduct.updateMany(
      {
        dealerId,
        createdAt: { $gte: today, $lte: endOfDay },
        viewed: false
      },
      { $set: { viewed: true } }
    );

    res.status(200).json({ message: 'Orders marked as viewed' });
  } catch (error) {
    console.error('Error marking orders as viewed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




