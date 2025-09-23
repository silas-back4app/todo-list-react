import Parse from "../parseConfig";

export default async function logOut() {
    try {
        await Parse.User.logOut();
        setUser(null);
        setTasks([]);
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}