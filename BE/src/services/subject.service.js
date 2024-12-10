const Subject = require("../models/subject.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const SubjectDTO = require("../dtos/subject.dto");
const TopicServices = require("./topic.service.js");

// Get all subjects with pagination
const getAllSubjectsWithPageData = async (pageOptions) => {
  try {
    const pageOptionsDto = new PageOptionsDto(pageOptions);

    // Build the query based on the search
    const query = {};
    if (pageOptionsDto.search) {
      query.name = { $regex: pageOptionsDto.search, $options: "i" };
    }

    // Fetch data with pagination
    const subjects = await Subject.find(query)
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .sort({
        [pageOptionsDto.orderBy || "name"]: pageOptionsDto.order,
      });

    // Get total count of matching documents
    const itemCount = await Subject.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return paginated data with metadata
    return new PageDto(subjects, pageMetaDto);
  } catch (error) {
    throw new Error("Error while fetching Subjects: " + error.message);
  }
};

// Get all subjects
const getAllSubjects = async () => {
  try {
    return await Subject.find();
  } catch (error) {
    throw new Error("Error while fetching subjects: " + error.message);
  }
};

// Get Subject by ID
const getSubjectById = async (subjectId) => {
  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw new Error("subject not found");
    }
    return subject;
  } catch (error) {
    throw new Error("Error while fetching subject: " + error.message);
  }
};

// Create a new Subject
const createSubject = async (subjectData) => {
  const { error } = SubjectDTO.validate(subjectData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingSubject = await Subject.findOne({
      name: { $regex: `^${subjectData.name.trim()}$`, $options: "i" },
    });
    if (existingSubject)
      throw new Error("Subject with this name already exists");
    const subject = new Subject(subjectData);
    return await subject.save();
  } catch (error) {
    throw new Error("Error while creating subject: " + error.message);
  }
};

// Update subject by ID
const updateSubject = async (subjectId, subjectData) => {
  const { error } = SubjectDTO.validate(subjectData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingSubject = await Subject.findOne({
      name: { $regex: `^${subjectData.name.trim()}$`, $options: "i" },
      _id: { $ne: subjectId },
    });
    if (existingSubject)
      throw new Error("Subject with this name already exists");
    const updatedSubject = await Subject.findByIdAndUpdate(
      subjectId,
      subjectData,
      {
        new: true,
      }
    );
    if (!updatedSubject) {
      throw new Error("Subject not found");
    }
    return updatedSubject;
  } catch (error) {
    throw new Error("Error while updating subject: " + error.message);
  }
};

// Delete Subject by ID
const deleteSubject = async (subjectId) => {
  try {
    const topic = await TopicServices.getTopicBySubject(subjectId);
    if (!topic) {
      const deletedSubject = await Subject.findByIdAndDelete(subjectId);
      if (!deletedSubject) {
        throw new Error("Subject not found");
      }
      return deletedSubject;
    } else if (topic) {
      throw new Error("This subject is in use so it can't be deleted");
    }
  } catch (error) {
    throw new Error("Error while deleting subject: " + error.message);
  }
};

module.exports = {
  getAllSubjectsWithPageData,
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
