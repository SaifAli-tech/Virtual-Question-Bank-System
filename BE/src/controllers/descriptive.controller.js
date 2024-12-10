const descriptiveQuestionService = require("../services/descriptive.service");

const getDescriptiveQuestionsWithPagination = async (req, res) => {
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

    const paginatedData =
      await descriptiveQuestionService.getAllDescriptiveQuestionsWithPageData(
        pageOptions
      );

    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching paginated descriptive questions:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

// Get all DescriptiveQuestions
const getAllDescriptiveQuestions = async (req, res) => {
  try {
    const descriptiveQuestions =
      await descriptiveQuestionService.getAllDescriptiveQuestions();
    res.status(200).json(descriptiveQuestions);
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
    const descriptiveQuestions =
      await descriptiveQuestionService.getPreparationQuestions(data);
    res.status(200).json(descriptiveQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get DescriptiveQuestion by ID
const getDescriptiveQuestionById = async (req, res) => {
  try {
    const descriptiveQuestion =
      await descriptiveQuestionService.getDescriptiveQuestionById(
        req.params.id
      );
    res.status(200).json(descriptiveQuestion);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new DescriptiveQuestion
const createDescriptiveQuestion = async (req, res) => {
  try {
    const newDescriptiveQuestion =
      await descriptiveQuestionService.createDescriptiveQuestion(req.body);
    res.status(201).json(newDescriptiveQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update DescriptiveQuestion by ID
const updateDescriptiveQuestion = async (req, res) => {
  try {
    const updatedDescriptiveQuestion =
      await descriptiveQuestionService.updateDescriptiveQuestion(
        req.params.id,
        req.body
      );
    res.status(200).json(updatedDescriptiveQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete descriptive question by ID
const deleteDescriptiveQuestion = async (req, res) => {
  try {
    await descriptiveQuestionService.deleteDescriptiveQuestion(req.params.id);
    res
      .status(200)
      .json({ message: "Descriptive question deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getDescriptiveQuestionsWithPagination,
  getAllDescriptiveQuestions,
  getPreparationQuestions,
  getDescriptiveQuestionById,
  createDescriptiveQuestion,
  updateDescriptiveQuestion,
  deleteDescriptiveQuestion,
};
