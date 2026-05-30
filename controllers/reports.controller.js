const Purchase = require("../models/purchase.model");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catch-async.util");
const AppError = require("../utils/app-error.util");

exports.getSalesReport = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const matchStage = {};
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start)) {
        return next(new AppError('Invalid startDate format', 400));
      }
      matchStage.createdAt.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end)) {
        return next(new AppError('Invalid endDate format', 400));
      }
      matchStage.createdAt.$lte = end;
    }
  }

  const report = await Purchase.aggregate([
    { $match: matchStage },


    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },


    {
      $lookup: {
        from: "products",
        localField: "product",
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
              totalSalesAmount: { $sum: "$totalPrice"},
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
              revenue: { $sum: "$totalPrice" },
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
});
