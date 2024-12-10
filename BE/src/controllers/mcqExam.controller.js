const mcqExamService = require("../services/mcqExam.service");

const getMcqExamsWithPagination = async (req, res) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      take: parseInt(req.query.take, 10) || 10,
      filter: req.query.filter || "",
    };

    const paginatedData = await mcqExamService.getAllMcqExamsWithPageData(
      pageOptions
    );

    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching paginated Mcq Exams:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

// Get all McqExams
const getAllMcqExams = async (req, res) => {
  try {
    const mcqExams = await mcqExamService.getAllMcqExams();
    res.status(200).json(McqExams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get McqExam by ID
const getMcqExamById = async (req, res) => {
  try {
    const mcqExam = await mcqExamService.getMcqExamById(req.params.id);
    res.status(200).json(McqExam);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new McqExam
const createMcqExam = async (req, res) => {
  try {
    const newMcqExam = await mcqExamService.createMcqExam(req.body);
    res.status(201).json(newMcqExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update McqExam by ID
const updateMcqExam = async (req, res) => {
  try {
    const updatedMcqExam = await mcqExamService.updateMcqExam(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedMcqExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Mcq Exam by ID
const deleteMcqExam = async (req, res) => {
  try {
    await mcqExamService.deleteMcqExam(req.params.id);
    res.status(200).json({ message: "Mcq Exam deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getMcqExamsWithPagination,
  getAllMcqExams,
  getMcqExamById,
  createMcqExam,
  updateMcqExam,
  deleteMcqExam,
};
