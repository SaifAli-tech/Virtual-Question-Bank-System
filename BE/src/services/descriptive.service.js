const Descriptive = require("../models/descriptive.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const DescriptiveDTO = require("../dtos/descriptive.dto");
const mongoose = require("mongoose");

// Get all descriptives with pagination
const getAllDescriptiveQuestionsWithPageData = async (pageOptions) => {
  try {
    const pageOptionsDto = new PageOptionsDto(pageOptions);

    // Build the query based on the search
    const query = {};
    if (pageOptionsDto.search) {
      query.text = { $regex: pageOptionsDto.search, $options: "i" };
    }

    if (pageOptionsDto.filter) {
      query.topic = {
        $in: [pageOptionsDto.filter],
      };
    }
    if (pageOptionsDto.difficulty) {
      query.difficulty = {
        $in: [pageOptionsDto.difficulty],
      };
    }

    // Fetch data with pagination
    const descriptives = await Descriptive.find(query)
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .sort({
        [pageOptionsDto.orderBy || "text"]: pageOptionsDto.order,
      })
      .populate({
        path: "topic",
        populate: {
          path: "subject",
        },
      });

    // Get total count of matching documents
    const itemCount = await Descriptive.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return paginated data with metadata
    return new PageDto(descriptives, pageMetaDto);
  } catch (error) {
    throw new Error(
      "Error while fetching descriptive questions: " + error.message
    );
  }
};

// Get all descriptive questions
const getAllDescriptiveQuestions = async () => {
  try {
    return await Descriptive.find();
  } catch (error) {
    throw new Error(
      "Error while fetching descriptive questions: " + error.message
    );
  }
};

const getPreparationQuestions = async (data) => {
  const { topic, difficulty, quantity } = data;

  try {
    // Find all questions matching the topic and difficulty
    const questions = await Descriptive.find({
      topic: topic,
      difficulty: difficulty,
    });

    // Randomly shuffle the questions and select the desired quantity
    const selectedQuestions = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, quantity);

    return selectedQuestions;
  } catch (error) {
    throw new Error(
      "Error while fetching descriptive questions: " + error.message
    );
  }
};

// Get descriptive question by ID
const getDescriptiveQuestionById = async (descriptiveId) => {
  try {
    const descriptiveQuestion = await Descriptive.findById(descriptiveId);
    if (!descriptiveQuestion) {
      throw new Error("descriptive question not found");
    }
    return descriptiveQuestion;
  } catch (error) {
    throw new Error(
      "Error while fetching descriptive question: " + error.message
    );
  }
};

const getDescriptiveQuestionByTopic = async (topic) => {
  try {
    const descriptiveQuestion = await Descriptive.findOne({ topic });
    if (!descriptiveQuestion) {
      throw new Error("descriptive question not found");
    }
    return descriptiveQuestion;
  } catch (error) {
    throw new Error(
      "Error while fetching descriptive question: " + error.message
    );
  }
};

// Create a new descriptive question
const createDescriptiveQuestion = async (descriptiveData) => {
  const { error } = DescriptiveDTO.validate(descriptiveData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingDescriptive = await Descriptive.findOne({
      text: { $regex: `^${descriptiveData.text.trim()}$`, $options: "i" },
    });
    if (existingDescriptive)
      throw new Error("Descriptive question with this text already exists");
    if (descriptiveData.hint.trim() == "" || null)
      descriptiveData.hint = "No hint";
    const descriptive = new Descriptive(descriptiveData);
    return await descriptive.save();
  } catch (error) {
    throw new Error(
      "Error while creating descriptive question: " + error.message
    );
  }
};

// Update descriptive question by ID
const updateDescriptiveQuestion = async (descriptiveId, descriptiveData) => {
  const { error } = DescriptiveDTO.validate(descriptiveData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingDescriptive = await Descriptive.findOne({
      text: { $regex: `^${descriptiveData.text.trim()}$`, $options: "i" },
      _id: { $ne: descriptiveId },
    });
    if (existingDescriptive)
      throw new Error("descriptive question with this text already exists");
    if (descriptiveData.hint.trim() == "" || null)
      descriptiveData.hint = "No hint";
    const updatedDescriptive = await Descriptive.findByIdAndUpdate(
      descriptiveId,
      descriptiveData,
      {
        new: true,
      }
    );
    if (!updatedDescriptive) {
      throw new Error("descriptive question not found");
    }
    return updatedDescriptive;
  } catch (error) {
    throw new Error(
      "Error while updating descriptive question: " + error.message
    );
  }
};

// Delete descriptive question by ID
const deleteDescriptiveQuestion = async (descriptiveId) => {
  try {
    const deletedDescriptive = await Descriptive.findByIdAndDelete(
      descriptiveId
    );
    if (!deletedDescriptive) {
      throw new Error("descriptive question not found");
    }
    return deletedDescriptive;
  } catch (error) {
    throw new Error(
      "Error while deleting descriptive question: " + error.message
    );
  }
};

module.exports = {
  getAllDescriptiveQuestionsWithPageData,
  getAllDescriptiveQuestions,
  getPreparationQuestions,
  getDescriptiveQuestionById,
  getDescriptiveQuestionByTopic,
  createDescriptiveQuestion,
  updateDescriptiveQuestion,
  deleteDescriptiveQuestion,
};
