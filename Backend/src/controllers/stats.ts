import { redis, redisTTL } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import {
  getChartData,
  getInventories,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  const key = "admin-stats";
  let stats = await redis.get(key);

  if (stats) return res.status(200).json({ success: true, stats: JSON.parse(stats) });

  const today = new Date();
  const sixMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 6));

  const getMonthRange = (monthOffset = 0) => ({
    start: new Date(today.getFullYear(), today.getMonth() - monthOffset, 1),
    end: new Date(today.getFullYear(), today.getMonth() - monthOffset + 1, 0),
  });

  const thisMonth = getMonthRange();
  const lastMonth = getMonthRange(1);

  const fetchStats = async (filter: Record<string, any>) => ({
    products: await Product.countDocuments(filter),
    users: await User.countDocuments(filter),
    orders: await Order.find(filter, "total"),
  });

  const [
    thisMonthData,
    lastMonthData,
    totalProducts,
    totalUsers,
    totalOrders,
    lastSixMonthOrders,
    categories,
    femaleUsersCount,
    latestTransactions,
  ] = await Promise.all([
    fetchStats({ createdAt: { $gte: thisMonth.start, $lte: thisMonth.end } }),
    fetchStats({ createdAt: { $gte: lastMonth.start, $lte: lastMonth.end } }),
    Product.countDocuments(),
    User.countDocuments(),
    Order.find({}, "total"),
    Order.find({ createdAt: { $gte: sixMonthsAgo, $lte: today } }),
    Product.distinct("category"),
    User.countDocuments({ gender: "female" }),
    Order.find({}).select("orderItems discount total status").limit(4),
  ]);

  const calculateChange = (current: number, previous: number) => previous ? ((current - previous) / previous) * 100 : 100;

  const revenue = totalOrders.reduce((sum, { total }) => sum + (total || 0), 0);
  const thisMonthRevenue = thisMonthData.orders.reduce((sum, { total }) => sum + (total || 0), 0);
  const lastMonthRevenue = lastMonthData.orders.reduce((sum, { total }) => sum + (total || 0), 0);

  const changePercent = {
    revenue: calculateChange(thisMonthRevenue, lastMonthRevenue),
    product: calculateChange(thisMonthData.products, lastMonthData.products),
    user: calculateChange(thisMonthData.users, lastMonthData.users),
    order: calculateChange(thisMonthData.orders.length, lastMonthData.orders.length),
  };

  const orderMonthCounts = Array(6).fill(0);
  const orderMonthlyRevenue = Array(6).fill(0);

  lastSixMonthOrders.forEach(({ createdAt, total }) => {
    const monthDiff = (today.getMonth() - createdAt.getMonth() + 12) % 12;
    if (monthDiff < 6) {
      orderMonthCounts[5 - monthDiff] += 1;
      orderMonthlyRevenue[5 - monthDiff] += total;
    }
  });

  const userRatio = { male: totalUsers - femaleUsersCount, female: femaleUsersCount };

  const modifiedLatestTransactions = latestTransactions.map(({ _id, discount, total, orderItems, status }) => ({
    _id, discount, amount: total, quantity: orderItems.length, status,
  }));

  stats = {
    categoryCount: await getInventories({ categories, productsCount: totalProducts }),
    changePercent,
    count: { revenue, product: totalProducts, user: totalUsers, order: totalOrders.length },
    chart: { order: orderMonthCounts, revenue: orderMonthlyRevenue },
    userRatio,
    latestTransaction: modifiedLatestTransactions,
  };

  await redis.setex(key, redisTTL, JSON.stringify(stats));

  return res.status(200).json({ success: true, stats });
});


export const getPieCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-pie-charts";

  charts = await redis.get(key);

  if (charts) charts = JSON.parse(charts);
  else {
    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      outOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    const productCategories = await getInventories({
      categories,
      productsCount,
    });

    const stockAvailablity = {
      inStock: productsCount - outOfStock,
      outOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullfillment,
      productCategories,
      stockAvailablity,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    await redis.setex(key, redisTTL, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getBarCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts";

  charts = await redis.get(key);

  if (charts) charts = JSON.parse(charts);
  else {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };

    await redis.setex(key, redisTTL, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getLineCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-line-charts";

  charts = await redis.get(key);

  if (charts) charts = JSON.parse(charts);
  else {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const usersCounts = getChartData({ length: 12, today, docArr: users });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: usersCounts,
      products: productCounts,
      discount,
      revenue,
    };

    await redis.setex(key, redisTTL, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});
