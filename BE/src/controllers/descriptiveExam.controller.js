const descriptiveExamService = require("../services/descriptiveExam.service");

const getDescriptiveExamsWithPagination = async (req, res) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      take: parseInt(req.query.take, 10) || 10,
      filter: req.query.filter || "",
    };

    const paginatedData =
      await descriptiveExamService.getAllDescriptiveExamsWithPageData(
        pageOptions
      );

    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching paginated descriptive Exams:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

// Get all DescriptiveExams
const getAllDescriptiveExams = async (req, res) => {
  try {
    const descriptiveExams =
      await descriptiveExamService.getAllDescriptiveExams();
    res.status(200).json(descriptiveExams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get DescriptiveExam by ID
const getDescriptiveExamById = async (req, res) => {
  try {
    const descriptiveExam = await descriptiveExamService.getDescriptiveExamById(
      req.params.id
    );
    res.status(200).json(descriptiveExam);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new DescriptiveExam
const createDescriptiveExam = async (req, res) => {
  try {
    const newDescriptiveExam =
      await descriptiveExamService.createDescriptiveExam(req.body);
    res.status(201).json(newDescriptiveExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update DescriptiveExam by ID
const updateDescriptiveExam = async (req, res) => {
  try {
    const updatedDescriptiveExam =
      await descriptiveExamService.updateDescriptiveExam(
        req.params.id,
        req.body
      );
    res.status(200).json(updatedDescriptiveExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete descriptive Exam by ID
const deleteDescriptiveExam = async (req, res) => {
  try {
    await descriptiveExamService.deleteDescriptiveExam(req.params.id);
    res.status(200).json({ message: "Descriptive Exam deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getDescriptiveExamsWithPagination,
  getAllDescriptiveExams,
  getDescriptiveExamById,
  createDescriptiveExam,
  updateDescriptiveExam,
  deleteDescriptiveExam,
};
