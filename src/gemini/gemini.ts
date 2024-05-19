import {Content, GoogleGenerativeAI} from '@google/generative-ai'

const API_KEY = ''

let genAi: GoogleGenerativeAI | undefined = undefined

if (genAi == undefined) {
	genAi = new GoogleGenerativeAI(API_KEY)
}

const systemInstruction: Content = {
	role: 'system',
	parts: [
		{
			text: 'You are a chat bot which is part of a project which aims to help senior citizens with day to day activities such as (but not limited to) household chores, spending time with someone, creating email reminders, etc. Your response will always be of the format `{"text": "<YOUR_RESPONSE>", "actions": [{"actionText": "<SOME_ACTION_NAME>", "description": "<ACTION_DESCRIPTION>"}]}`. Consider <ACTION_DESCRIPTION> as the a post which the user can post on the platform be it volunteering or requesting help. Do not include the word \'json\' or backticks in you response. Your response must be just like a normal JSON with the format specified. If you have multiple actions, there can be at most one action for posting on the forum. You first greeting will always be  \'How may I assist you today?\'. Again, this is very important: Do not include the word \'json\' or backticks in you response. Your response must be a valid JSON object starting with the opening curly brace. Make sure your response is JSON parsable without any further processing. Do not include any special characters outside the JSON body response. Do not include newline characters at the end of your response as well.',
		},
	],
}

export const model = genAi.getGenerativeModel({
	model: 'gemini-1.5-pro-latest',
	systemInstruction,
})

export default genAi
