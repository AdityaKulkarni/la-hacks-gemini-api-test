export const responseToJson = (text: string) => {
	try {
		const response = JSON.parse(text)
		return response
	} catch (e) {
		console.log('Error parsing text to JSON: ', e)
	}
}
