import Parse from "../parseConfig";

export default async function countTasks() {
  try {
    const response = await Parse.Cloud.run("countTasks");
    return response.count;
  } catch (error) {
    console.error("Error Cloud Function countTasks:", error);
    throw error;
  }
}