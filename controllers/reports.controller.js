const Purchase = require("../models/purchase.model");
const mongoose = require("mongoose");

exports.getSalesReport = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const report = await Purchase.aggregate([
    { $match: matchStage },


    {
      $lookup: {
        from: "users", // name of field in DB users not user
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" }, // for not dublicate user when get it back


    {
      $lookup: {
        from: "products",
        localField: "product", // assuming it's a field like: product: ObjectId
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },


    {
      $addFields: {
        totalPrice: { $multiply: ["$price", "$quantity"] },
      },
    },


    {
      $facet: {
        overAllStatus: [
          {
            $group: {
              _id: null,
              totalSalesAmount: { $sum: "$totalPrice"},    // total sale $$ Product price * quantity
              totalQuantitySold: { $sum: "$quantity" },
              numberOfPurchases: { $sum: 1 },
            },
          },
        ],

        topProducts: [
          {
            $group: {
              _id: "$product._id",
              name: { $first: "$product.name" },
              revenue: { $sum: "$totalPrice" },     //Product price
              soldQuantity: { $sum: "$quantity" },
            },
          },
          { $sort: { revenue: -1 } },
          { $limit: 5 },
        ],

        topClients: [
          {
            $group: {
              _id: "$user._id",
              name: { $first: "$user.name" },
              email: { $first: "$user.email" },
              totalSpent: { $sum: "$totalPrice" },
              totalQuantity: { $sum: "$quantity" },
            },
          },
          { $sort: { totalSpent: -1 } },
          { $limit: 5 },
        ],

        monthlySales: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              totalRevenue: { $sum: "$totalPrice" },
              totalQuantity: { $sum: "$quantity" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ],
      },
    },


  ]);
  res.status(200).json(report);
};
