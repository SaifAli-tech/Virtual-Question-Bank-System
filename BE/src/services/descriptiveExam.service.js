const DescriptiveExam = require("../models/descriptiveExams.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const DescriptiveDTO = require("../dtos/descriptiveExam.dto");
const UpdateDescriptiveExamDTO = require("../dtos/updateDescriptiveExam.dto");

// Get all descriptives with pagination
const getAllDescriptiveExamsWithPageData = async (pageOptions) => {
  try {
    // Instantiate the DTO for page options
    const pageOptionsDto = new PageOptionsDto(pageOptions);

    // Build the query object based on the filter
    const query = {};
    if (pageOptionsDto.filter) {
      query.status = { $in: pageOptionsDto.filter };
    }

    // Fetch data with pagination
    const descriptives = await DescriptiveExam.find(query)
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .sort({
        ["createdAt"]: -1,
      })
      .populate("user", "name code")
      .populate({
        path: "questions",
        select: "difficulty topic",
        populate: {
          path: "topic",
          select: "name subject",
          populate: {
            path: "subject",
            select: "name",
          },
        },
      });

    // Get the total count of matching documents
    const itemCount = await DescriptiveExam.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return the paginated data along with metadata
    return new PageDto(descriptives, pageMetaDto);
  } catch (error) {
    console.error("Error fetching descriptive exam data:", error); // Log the error for debugging
    throw new Error(
      `Error while fetching descriptive exam data: ${error.message}`
    );
  }
};

// Get all descriptive questions
const getAllDescriptiveExams = async () => {
  try {
    return await DescriptiveExam.find();
  } catch (error) {
    throw new Error(
      "Error while fetching descriptive exam data: " + error.message
    );
  }
};

// Get descriptive question by ID
const getDescriptiveExamById = async (descriptiveId) => {
  try {
    const descriptiveExam = await DescriptiveExam.findById(
      descriptiveId
    ).populate("questions", "text answer");
    if (!descriptiveExam) {
      throw new Error("descriptive exam not found");
    }
    return descriptiveExam;
  } catch (error) {
    throw new Error(
      "Error while fetching descriptive exam data: " + error.message
    );
  }
};

const getDescriptiveExamsByUserId = async (user) => {
  try {
    const descriptiveExams = await DescriptiveExam.find({ user }).populate({
      path: "questions",
      select: "text answer difficulty topic",
      populate: {
        path: "topic",
        select: "name subject",
        populate: { path: "subject", select: "name" },
      },
    });
    if (!descriptiveExams) {
      throw new Error("descriptive exams not found");
    }
    return descriptiveExams;
  } catch (error) {
    throw new Error(
      "Error while fetching descriptive exams data: " + error.message
    );
  }
};

// Create a new descriptive question
const createDescriptiveExam = async (descriptiveData) => {
  const { error } = DescriptiveDTO.validate(descriptiveData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const descriptiveExam = new DescriptiveExam(descriptiveData);
    return await descriptiveExam.save();
  } catch (error) {
    throw new Error(
      "Error while creating descriptive exam data: " + error.message
    );
  }
};

// Update descriptive question by ID
const updateDescriptiveExam = async (descriptiveId, descriptiveData) => {
  const { error } = UpdateDescriptiveExamDTO.validate(descriptiveData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const updatedDescriptive = await DescriptiveExam.findByIdAndUpdate(
      descriptiveId,
      descriptiveData,
      {
        new: true,
      }
    );
    if (!updatedDescriptive) {
      throw new Error("descriptive exam data not found");
    }
    return updatedDescriptive;
  } catch (error) {
    throw new Error(
      "Error while updating descriptive exam data: " + error.message
    );
  }
};

// Delete descriptive question by ID
const deleteDescriptiveExam = async (descriptiveId) => {
  try {
    const deletedDescriptive = await DescriptiveExam.findByIdAndDelete(
      descriptiveId
    );
    if (!deletedDescriptive) {
      throw new Error("descriptive exam data not found");
    }
    return deletedDescriptive;
  } catch (error) {
    throw new Error(
      "Error while deleting descriptive exam data: " + error.message
    );
  }
};

const deleteDescriptiveExamsByUserId = async (user) => {
  try {
    const deletedDescriptive = await DescriptiveExam.DeleteMany({ user });
    if (!deletedDescriptive) {
      throw new Error("No descriptive exam data with this user id found");
    }
    return deletedDescriptive;
  } catch (error) {
    throw new Error(
      "Error while deleting descriptive exam data: " + error.message
    );
  }
};

module.exports = {
  getAllDescriptiveExamsWithPageData,
  getAllDescriptiveExams,
  getDescriptiveExamById,
  getDescriptiveExamsByUserId,
  createDescriptiveExam,
  updateDescriptiveExam,
  deleteDescriptiveExam,
  deleteDescriptiveExamsByUserId,
};
