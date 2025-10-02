import Parse from "../parseConfig";

export async function signUp({ username, password, email }) {
  try {
    const response = await Parse.Cloud.run("signUp", {
      username: username,
      password: password,
      email: email
    });

    console.log(response)
  } catch (error) {
      console.error("Error on signup:", error);
  }
}

export async function logIn(username, password) {
    try {
        const response = await Parse.Cloud.run("logIn", {
          username: username,
          password: password
        });

        return response
    } catch (error) {
        console.error("Error on login:", error);
    }
}

export async function logOut() {
  try {
    const currentUser = Parse.User.current();
    if (!currentUser) return;
    await Parse.Cloud.run("logOut", {}, { sessionToken: currentUser.getSessionToken() });
    await Parse.User.logOut();
  } catch (error) {
    console.error("Error on logout:", error);
  }
}