import Parse from "../parseConfig";

export default async function update(schema, id, body) {
    try {
        const query = new Parse.Query(schema)
        const parseObject = await query.get(id)

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                parseObject.set(key, body[key])
            }
        }

        await parseObject.save(null)
        return parseObject
    } catch (error) {
        console.error("Error updating object:", error)
        throw error
    }
}