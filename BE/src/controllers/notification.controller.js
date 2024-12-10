const notificationService = require("../services/notification.service");

const getNotificationsWithPagination = async (req, res) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      take: parseInt(req.query.take, 10) || 10,
      orderBy: req.query.orderBy || "createdAt",
      order: parseInt(req.query.order?.toUpperCase() === "ASC" ? 1 : -1),
      search: req.query.search?.trim() || "",
    };

    const paginatedData =
      await notificationService.getAllNotificationsWithPageData(pageOptions);

    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching paginated notifications:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

// Get all Notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(
      req.params.id
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new Notification
const createNotification = async (req, res) => {
  try {
    const newNotification = await notificationService.createNotification(
      req.body
    );
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Notification by ID
const updateNotification = async (req, res) => {
  try {
    const updatedNotification = await notificationService.updateNotification(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Notification by ID
const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getNotificationsWithPagination,
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
};
