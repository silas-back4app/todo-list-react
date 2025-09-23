import Parse from "../parseConfig";

export default async function logIn(username, password) {
    try {
        const user = await Parse.User.logIn(username, password);
        return user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}