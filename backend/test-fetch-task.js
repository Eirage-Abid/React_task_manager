const axios = require("axios");

// Replace with the task ID you want to test
const TASK_ID = 1759325970268;

const fetchTask = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/tasks/${TASK_ID}`);
    console.log("Task fetched successfully:");
    console.log(res.data);
  } catch (error) {
    if (error.response) {
      console.log("Server responded with status:", error.response.status);
      console.log(error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
};

fetchTask();
