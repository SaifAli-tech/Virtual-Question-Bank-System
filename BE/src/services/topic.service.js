const Topic = require("../models/topic.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const TopicDTO = require("../dtos/topic.dto");
const McqServices = require("./mcq.service.js");
const DescriptiveServices = require("./descriptive.service.js");

// Get all topics with pagination
const getAllTopicsWithPageData = async (pageOptions) => {
  try {
    const pageOptionsDto = new PageOptionsDto(pageOptions);

    // Build the query based on the search
    const query = {};
    if (pageOptionsDto.search) {
      query.name = { $regex: pageOptionsDto.search, $options: "i" };
    }

    if (pageOptionsDto.filter) {
      query.subject = {
        $in: [pageOptionsDto.filter],
      };
    }

    // Fetch data with pagination
    const topics = await Topic.find(query)
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .sort({
        [pageOptionsDto.orderBy || "name"]: pageOptionsDto.order,
      })
      .populate("subject");

    // Get total count of matching documents
    const itemCount = await Topic.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return paginated data with metadata
    return new PageDto(topics, pageMetaDto);
  } catch (error) {
    throw new Error("Error while fetching topics: " + error.message);
  }
};

// Get all topics
const getAllTopics = async () => {
  try {
    return await Topic.find();
  } catch (error) {
    throw new Error("Error while fetching topics: " + error.message);
  }
};

// Get topic by ID
const getTopicById = async (topicId) => {
  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      throw new Error("Topic not found");
    }
    return topic;
  } catch (error) {
    throw new Error("Error while fetching topic: " + error.message);
  }
};

const getTopicBySubject = async (subject) => {
  try {
    const topic = await Topic.findOne({ subject });
    if (!topic) {
      throw new Error("Topic not found");
    }
    return topic;
  } catch (error) {
    throw new Error("Error while fetching topic: " + error.message);
  }
};

const getTopicsBySubject = async (subjectId) => {
  try {
    const topics = await Topic.find({ subject: subjectId });
    return topics;
  } catch (error) {
    throw new Error("No topic with this subject id found");
  }
};

// Create a new topic
const createTopic = async (topicData) => {
  const { error } = TopicDTO.validate(topicData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingTopic = await Topic.findOne({
      name: { $regex: `^${topicData.name.trim()}$`, $options: "i" },
    });
    if (existingTopic) throw new Error("Topic with this name already exists");
    const topic = new Topic(topicData);
    return await topic.save();
  } catch (error) {
    throw new Error("Error while creating topic: " + error.message);
  }
};

// Update topic by ID
const updateTopic = async (topicId, topicData) => {
  const { error } = TopicDTO.validate(topicData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingTopic = await Topic.findOne({
      name: { $regex: `^${topicData.name.trim()}$`, $options: "i" },
      _id: { $ne: topicId },
    });
    if (existingTopic) throw new Error("Topic with this name already exists");
    const updatedtopic = await Topic.findByIdAndUpdate(topicId, topicData, {
      new: true,
    });
    if (!updatedtopic) {
      throw new Error("Topic not found");
    }
    return updatedtopic;
  } catch (error) {
    throw new Error("Error while updating topic: " + error.message);
  }
};

// Delete topic by ID
const deleteTopic = async (topicId) => {
  try {
    const topic = await McqServices.getMcqByTopic(topicId);
    topic = await DescriptiveServices.getDescriptiveQuestionByTopic(topicId);
    if (!topic) {
      const deletedtopic = await Topic.findByIdAndDelete(topicId);
      if (!deletedtopic) {
        throw new Error("Topic not found");
      }
      return deletedtopic;
    } else if (topic) {
      throw new Error("This topic is in use so it can't be deleted");
    }
  } catch (error) {
    throw new Error("Error while deleting topic: " + error.message);
  }
};

module.exports = {
  getAllTopicsWithPageData,
  getAllTopics,
  getTopicById,
  getTopicBySubject,
  getTopicsBySubject,
  createTopic,
  updateTopic,
  deleteTopic,
};
