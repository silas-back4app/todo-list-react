import Parse from "../parseConfig";

export default async function requestPasswordReset(email) {
    try {
      await Parse.User.requestPasswordReset(email);
      return true; // sucesso
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
}