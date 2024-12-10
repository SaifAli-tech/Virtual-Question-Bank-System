const McqExam = require("../models/mcqExams.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const McqExamDTO = require("../dtos/mcqExam.dto");
const McqService = require("./mcq.service.js");

// Get all Mcqs with pagination
const getAllMcqExamsWithPageData = async (pageOptions) => {
  try {
    const pageOptionsDto = new PageOptionsDto(pageOptions);

    // Build the query based on the search
    const query = {};
    if (pageOptionsDto.filter) {
      query.status = {
        $in: [pageOptionsDto.filter],
      };
    }

    // Fetch data with pagination
    const mcqs = await McqExam.find(query)
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

    // Get total count of matching documents
    const itemCount = await McqExam.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return paginated data with metadata
    return new PageDto(mcqs, pageMetaDto);
  } catch (error) {
    throw new Error("Error while fetching Mcq exam data: " + error.message);
  }
};

// Get all Mcq questions
const getAllMcqExams = async () => {
  try {
    return await McqExam.find();
  } catch (error) {
    throw new Error("Error while fetching Mcq exam data: " + error.message);
  }
};

// Get Mcq question by ID
const getMcqExamById = async (mcqId) => {
  try {
    const mcqExam = await McqExam.findById(mcqId);
    if (!mcqExam) {
      throw new Error("Mcq exam not found");
    }
    return mcqExam;
  } catch (error) {
    throw new Error("Error while fetching Mcq exam data: " + error.message);
  }
};

const getMcqExamsByUserId = async (user) => {
  try {
    const mcqExams = await McqExam.find({ user }).populate({
      path: "questions",
      select: "text answer difficulty topic",
      populate: {
        path: "topic",
        select: "name subject",
        populate: { path: "subject", select: "name" },
      },
    });
    if (!mcqExams) {
      throw new Error("Mcq exams not found");
    }
    return mcqExams;
  } catch (error) {
    throw new Error("Error while fetching Mcq exams data: " + error.message);
  }
};

// Create a new Mcq question
const createMcqExam = async (mcqData) => {
  const { error } = McqExamDTO.validate(mcqData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const acquiredScores = [];
  const quesScore = mcqData.totalScore / mcqData.questions.length;

  try {
    for (let i = 0; i < mcqData.questions.length; i++) {
      const questionId = mcqData.questions[i];
      const givenAnswer = mcqData.givenAnswers[i];

      const correctAnswer = await McqService.getMcqAnswerById(questionId);
      if (!correctAnswer) {
        throw new Error(`Question with ID ${questionId} not found.`);
      }

      const isCorrect = correctAnswer === givenAnswer;
      acquiredScores.push(isCorrect ? quesScore : 0);
    }

    mcqData.acquiredScores = acquiredScores;
    mcqData.status = "Checked";
    mcqData.checkedAt = Date.now();

    console.log(mcqData);

    const mcqExam = new McqExam(mcqData);
    return await mcqExam.save();
  } catch (error) {
    throw new Error("Error while creating mcq exam data: " + error.message);
  }
};

// Update Mcq question by ID
const updateMcqExam = async (mcqId, mcqData) => {
  const { error } = McqDTO.validate(mcqData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const updatedMcq = await McqExam.findByIdAndUpdate(mcqId, mcqData, {
      new: true,
    });
    if (!updatedMcq) {
      throw new Error("Mcq exam data not found");
    }
    return updatedMcq;
  } catch (error) {
    throw new Error("Error while updating Mcq exam data: " + error.message);
  }
};

// Delete Mcq question by ID
const deleteMcqExam = async (mcqId) => {
  try {
    const deletedMcq = await McqExam.findByIdAndDelete(mcqId);
    if (!deletedMcq) {
      throw new Error("Mcq exam data not found");
    }
    return deletedMcq;
  } catch (error) {
    throw new Error("Error while deleting Mcq exam data: " + error.message);
  }
};

const deleteMcqExamsByUserId = async (user) => {
  try {
    const deletedMcq = await McqExam.DeleteMany({ user });
    if (!deletedMcq) {
      throw new Error("Mcq exam data not found");
    }
    return deletedMcq;
  } catch (error) {
    throw new Error("Error while deleting Mcq exam data: " + error.message);
  }
};

module.exports = {
  getAllMcqExamsWithPageData,
  getAllMcqExams,
  getMcqExamById,
  getMcqExamsByUserId,
  createMcqExam,
  updateMcqExam,
  deleteMcqExam,
  deleteMcqExamsByUserId,
};
