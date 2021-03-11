export default async function tryExecute(resolve, reject) {
    try {
        const data = await resolve();
        return Promise.resolve(data);
    } catch (err) {
        console.error(err);
        await reject(err);
        return Promise.reject(err);
    }
}
