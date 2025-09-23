import Parse from "../parseConfig";

export default async function deleteQuery(schema, id) {
    try {
        const query = new Parse.Query(schema)
        const object = await query.get(id)
    
        if (!object) {
            throw new Error(`Object ${id} not found in ${schema}`)
        }
    
        await object.destroy()
    
        console.log(`${schema} - ${id}`)
        return true
    } catch (error) {
        console.error("Error to delete:", error.message)
        throw error
    }
}

