import Parse from "../parseConfig";

export default async function find(schema) {
    try {
        const query = new Parse.Query(schema)
        const results = await query.find()
        return results
    } catch (error) {
        console.error("Error to execute find query:", error)
        throw error
    }
}