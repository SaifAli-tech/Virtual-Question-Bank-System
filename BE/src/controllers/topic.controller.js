const topicService = require("../services/topic.service");

const getTopicsWithPagination = async (req, res) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      take: parseInt(req.query.take, 10) || 10,
      orderBy: req.query.orderBy || "name",
      order: parseInt(req.query.order?.toUpperCase() === "ASC" ? 1 : -1),
      search: req.query.search?.trim() || "",
      filter: req.query.filter || "",
    };

    const paginatedData = await topicService.getAllTopicsWithPageData(
      pageOptions
    );

    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching paginated topics:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

// Get all Topics
const getAllTopics = async (req, res) => {
  try {
    const topics = await topicService.getAllTopics();
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Topic by ID
const getTopicById = async (req, res) => {
  try {
    const topic = await topicService.getTopicById(req.params.id);
    res.status(200).json(topic);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await topicService.getTopicsBySubject(req.params.id);
    res.status(200).json(topics);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new Topic
const createTopic = async (req, res) => {
  try {
    const newTopic = await topicService.createTopic(req.body);
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Topic by ID
const updateTopic = async (req, res) => {
  try {
    const updatedTopic = await topicService.updateTopic(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Topic by ID
const deleteTopic = async (req, res) => {
  try {
    await topicService.deleteTopic(req.params.id);
    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getTopicsWithPagination,
  getAllTopics,
  getTopicById,
  getTopicsBySubject,
  createTopic,
  updateTopic,
  deleteTopic,
};
