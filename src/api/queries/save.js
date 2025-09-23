import Parse from "../parseConfig";

export default async function save(schema, body) {
    try {
        const parseObject = new Parse.Object(schema)

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                parseObject.set(key, body[key])
            }
        }

        await parseObject.save(null)
        return parseObject
    } catch (error) {
        console.error("Error to save object:", error)
        throw error
    }
}
