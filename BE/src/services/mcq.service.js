const Mcq = require("../models/mcq.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const McqDTO = require("../dtos/mcq.dto");

// Get all mcqs with pagination
const getAllMcqsWithPageData = async (pageOptions) => {
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
    const mcqs = await Mcq.find(query)
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
    const itemCount = await Mcq.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return paginated data with metadata
    return new PageDto(mcqs, pageMetaDto);
  } catch (error) {
    throw new Error("Error while fetching mcqs: " + error.message);
  }
};

// Get all Mcqs
const getAllMcqs = async () => {
  try {
    return await Mcq.find();
  } catch (error) {
    throw new Error("Error while fetching mcqs: " + error.message);
  }
};

const getPreparationQuestions = async (data) => {
  const { topic, difficulty, quantity } = data;

  try {
    // Find all questions matching the topic and difficulty
    const questions = await Mcq.find({
      topic: topic,
      difficulty: difficulty,
    });

    // Randomly shuffle the questions and select the desired quantity
    const selectedQuestions = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, quantity);

    return selectedQuestions;
  } catch (error) {
    throw new Error("Error while fetching mcqs: " + error.message);
  }
};

// Get mcq by ID
const getMcqById = async (mcqId) => {
  try {
    const mcq = await Mcq.findById(mcqId);
    if (!mcq) {
      throw new Error("mcq not found");
    }
    return mcq;
  } catch (error) {
    throw new Error("Error while fetching mcq: " + error.message);
  }
};

const getMcqByTopic = async (topic) => {
  try {
    const mcq = await Mcq.findOne({ topic });
    if (!mcq) {
      throw new Error("mcq not found");
    }
    return mcq;
  } catch (error) {
    throw new Error("Error while fetching mcq: " + error.message);
  }
};

const getMcqAnswerById = async (mcqId) => {
  try {
    const mcq = await Mcq.findById(mcqId);
    if (!mcq) {
      throw new Error("mcq not found");
    }
    return mcq.answer;
  } catch (error) {
    throw new Error("Error while fetching mcq: " + error.message);
  }
};

// Create a new mcq
const createMcq = async (mcqData) => {
  const { error } = McqDTO.validate(mcqData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingMcq = await Mcq.findOne({
      text: { $regex: `^${mcqData.text.trim()}$`, $options: "i" },
    });
    if (existingMcq) throw new Error("Mcq with this text already exists");
    const mcq = new Mcq(mcqData);
    return await mcq.save();
  } catch (error) {
    throw new Error("Error while creating mcq: " + error.message);
  }
};

// Update mcq by ID
const updateMcq = async (mcqId, mcqData) => {
  const { error } = McqDTO.validate(mcqData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingMcq = await Mcq.findOne({
      text: { $regex: `^${mcqData.text.trim()}$`, $options: "i" },
      _id: { $ne: mcqId },
    });
    if (existingMcq) throw new Error("Mcq with this text already exists");
    const updatedMcq = await Mcq.findByIdAndUpdate(mcqId, mcqData, {
      new: true,
    });
    if (!updatedMcq) {
      throw new Error("mcq not found");
    }
    return updatedMcq;
  } catch (error) {
    throw new Error("Error while updating mcq: " + error.message);
  }
};

// Delete Mcq by ID
const deleteMcq = async (mcqId) => {
  try {
    const deletedMcq = await Mcq.findByIdAndDelete(mcqId);
    if (!deletedMcq) {
      throw new Error("mcq not found");
    }
    return deletedMcq;
  } catch (error) {
    throw new Error("Error while deleting mcq: " + error.message);
  }
};

module.exports = {
  getAllMcqsWithPageData,
  getAllMcqs,
  getPreparationQuestions,
  getMcqById,
  getMcqByTopic,
  getMcqAnswerById,
  createMcq,
  updateMcq,
  deleteMcq,
};
