import Parse from "../parseConfig";

export default async function signUp({ username, password, email }) {
  try {
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    await user.signUp();
    return user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
