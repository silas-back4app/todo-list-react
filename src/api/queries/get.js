import Parse from "../parseConfig";

export default async function get(schema, id) {
    try {
        const query = new Parse.Query(schema)
        const results = await query.get(id)
        return results
    } catch (error) {
        console.error("Error to execute get query:", error)
        throw error
    }
}
