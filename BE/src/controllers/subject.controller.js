const subjectService = require("../services/subject.service");

const getSubjectsWithPagination = async (req, res) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      take: parseInt(req.query.take, 10) || 10,
      orderBy: req.query.orderBy || "name",
      order: parseInt(req.query.order?.toUpperCase() === "ASC" ? 1 : -1),
      search: req.query.search?.trim() || "",
    };

    const paginatedData = await subjectService.getAllSubjectsWithPageData(
      pageOptions
    );

    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching paginated subjects:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

// Get all Subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id);
    res.status(200).json(subject);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new Subject
const createSubject = async (req, res) => {
  try {
    const newSubject = await subjectService.createSubject(req.body);
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Subject by ID
const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await subjectService.updateSubject(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Subject by ID
const deleteSubject = async (req, res) => {
  try {
    await subjectService.deleteSubject(req.params.id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getSubjectsWithPagination,
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
