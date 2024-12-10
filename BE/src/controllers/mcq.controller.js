const mcqService = require("../services/mcq.service.js");

const getMcqsWithPagination = async (req, res) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      take: parseInt(req.query.take, 10) || 10,
      orderBy: req.query.orderBy || "text",
      order: parseInt(req.query.order?.toUpperCase() === "ASC" ? 1 : -1),
      search: req.query.search?.trim() || "",
      filter: req.query.filter || "",
      difficulty: req.query.difficulty || "",
    };

    const paginatedData = await mcqService.getAllMcqsWithPageData(pageOptions);

    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching paginated mcqs:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

// Get all mcqs
const getAllMcqs = async (req, res) => {
  try {
    const mcqs = await mcqService.getAllMcqs();
    res.status(200).json(mcqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPreparationQuestions = async (req, res) => {
  const data = {
    topic: req.query.topic,
    difficulty: req.query.difficulty,
    quantity: parseInt(req.query.quantity),
  };
  try {
    const mcqs = await mcqService.getPreparationQuestions(data);
    res.status(200).json(mcqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get mcq by ID
const getMcqById = async (req, res) => {
  try {
    const mcq = await mcqService.getMcqById(req.params.id);
    res.status(200).json(mcq);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new mcq
const createMcq = async (req, res) => {
  try {
    const newMcq = await mcqService.createMcq(req.body);
    res.status(201).json(newMcq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update mcq by ID
const updateMcq = async (req, res) => {
  try {
    const updatedMcq = await mcqService.updateMcq(req.params.id, req.body);
    res.status(200).json(updatedMcq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete mcq by ID
const deleteMcq = async (req, res) => {
  try {
    await mcqService.deleteMcq(req.params.id);
    res.status(200).json({ message: "Mcq deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getMcqsWithPagination,
  getAllMcqs,
  getPreparationQuestions,
  getMcqById,
  createMcq,
  updateMcq,
  deleteMcq,
};
