const DescriptiveExamServices = require("./descriptiveExam.service.js");
const McqExamServices = require("./mcqExam.service.js");
const UserServices = require("./user.service.js");

const getAnalytics = async (code) => {
  try {
    const user = await UserServices.getUserByCode(code);
    if (!user) throw new Error("User not found");

    const descriptiveExams =
      await DescriptiveExamServices.getDescriptiveExamsByUserId(user);
    const mcqExams = await McqExamServices.getMcqExamsByUserId(user);

    const descriptiveAnalytics = calculateExamAnalytics(descriptiveExams);
    const mcqAnalytics = calculateExamAnalytics(mcqExams);

    const analytics = {
      descriptive: descriptiveAnalytics,
      mcq: mcqAnalytics,
    };

    return analytics;
  } catch (error) {
    throw new Error("Error while fetching analytics: " + error.message);
  }
};

// Function to calculate analytics for a given set of exams
const calculateExamAnalytics = (exams) => {
  const analytics = {};
  let totalTimeTaken = 0;
  let totalExams = 0;

  // Process each exam
  for (const exam of exams) {
    const { questions, acquiredScores, timeTaken, status } = exam;

    // Only include checked exams
    if (status !== "Checked") continue;

    // Sum total time taken
    totalTimeTaken += timeTaken.reduce((sum, time) => sum + time, 0);
    totalExams += timeTaken.length;

    // Process each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const score = acquiredScores[i];

      const topic = question.topic.name;
      const difficulty = question.difficulty;
      const subject = question.topic.subject.name;

      // Ensure topic structure in analytics
      if (!analytics[topic]) {
        analytics[topic] = {
          subject,
          Easy: [],
          Medium: [],
          Hard: [],
        };
      }

      // Add score to the appropriate difficulty array
      analytics[topic][difficulty].push(score);
    }
  }

  // Calculate average scores and prepare the result
  const result = Object.keys(analytics).map((topic) => {
    const topicData = analytics[topic];
    return {
      topic,
      subject: topicData.subject,
      difficulty: {
        Easy: calculateAverage(topicData.Easy),
        Medium: calculateAverage(topicData.Medium),
        Hard: calculateAverage(topicData.Hard),
      },
    };
  });

  // Calculate average time taken
  const averageTimeTaken = totalExams > 0 ? totalTimeTaken / totalExams : 0;

  return {
    analytics: result,
    averageTimeTaken,
  };
};

// Helper function to calculate average
const calculateAverage = (scores) => {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
};

module.exports = {
  getAnalytics,
};
