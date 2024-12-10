const Notification = require("../models/notification.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const NotificationDTO = require("../dtos/notification.dto");

// Get all Notifications with pagination
const getAllNotificationsWithPageData = async (pageOptions) => {
  try {
    const pageOptionsDto = new PageOptionsDto(pageOptions);

    // Build the query based on the search
    const query = {};
    if (pageOptionsDto.search) {
      query.title = { $regex: pageOptionsDto.search, $options: "i" };
    }

    // Fetch data with pagination
    const notifications = await Notification.find(query)
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .sort({
        [pageOptionsDto.orderBy || "createdAt"]: pageOptionsDto.order,
      });

    // Get total count of matching documents
    const itemCount = await Notification.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return paginated data with metadata
    return new PageDto(notifications, pageMetaDto);
  } catch (error) {
    throw new Error("Error while fetching notifications: " + error.message);
  }
};

// Get all Notifications
const getAllNotifications = async () => {
  try {
    return await Notification.find();
  } catch (error) {
    throw new Error("Error while fetching notifications: " + error.message);
  }
};

// Get Notification by ID
const getNotificationById = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  } catch (error) {
    throw new Error("Error while fetching notification: " + error.message);
  }
};

// Create a new Notification
const createNotification = async (notificationData) => {
  const { error } = NotificationDTO.validate(notificationData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const notification = new Notification(notificationData);
    return await notification.save();
  } catch (error) {
    throw new Error("Error while creating notification: " + error.message);
  }
};

// Update Notification by ID
const updateNotification = async (notificationId, notificationData) => {
  const { error } = NotificationDTO.validate(notificationData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      notificationData,
      {
        new: true,
      }
    );
    if (!updatedNotification) {
      throw new Error("Notification not found");
    }
    return updatedNotification;
  } catch (error) {
    throw new Error("Error while updating notification: " + error.message);
  }
};

// Delete Notification by ID
const deleteNotification = async (notificationId) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );
    if (!deletedNotification) {
      throw new Error("Notification not found");
    }
    return deletedNotification;
  } catch (error) {
    throw new Error("Error while deleting Notification: " + error.message);
  }
};

module.exports = {
  getAllNotificationsWithPageData,
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
};
