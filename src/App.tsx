import React, {ChangeEvent, useState} from 'react'
import './App.css'
import {model} from './gemini/gemini'
import {ChatSession, Content} from '@google/generative-ai'
import {responseToJson} from './gemini/response-utils'

type Action = {
	actionText: string
	actionDescription: string
}

type ActionMessage = {
	content: Content
	actions: Action[]
}

function App() {
	const [prompt, setPrompt] = useState('')
	const [messages, setMessages] = useState<ActionMessage[]>()
	const [chat, setChat] = useState<ChatSession | undefined>(undefined)

	const startChat = async () => {
		const message = ''
		setMessages((prevMessages) => [
			...(prevMessages ? (prevMessages as ActionMessage[]) : []),
			{actions: [], content: {role: 'user', parts: [{text: message}]}},
		])
		let newChat
		if (chat == undefined) {
			newChat = model.startChat({
				history: messages?.map((message) => message.content),
			})
		} else {
			newChat = chat
		}
		setChat(newChat)
		const result = await newChat.sendMessage(message)
		const response = responseToJson(
			result.response.text().replace(/^\s+|\s+$/g, '')
		)

		setMessages((prevMessages) => [
			...(prevMessages ? (prevMessages as ActionMessage[]) : []),
			{
				actions: response.actions,
				content: {
					role: 'model',
					parts: [{text: response.text}],
				},
			},
		])
	}

	const handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPrompt(event.target.value)
	}

	const handleSubmit = async () => {
		const message = prompt
		setPrompt('')
		setMessages((prevMessages) => [
			...(prevMessages ? (prevMessages as ActionMessage[]) : []),
			{actions: [], content: {role: 'user', parts: [{text: message}]}},
		])
		if (chat != undefined) {
			const result = await chat.sendMessage(message)
			const response = responseToJson(
				result.response.text().replace(/^\s+|\s+$/g, '')
			)
			setMessages((prevMessages) => [
				...(prevMessages ? (prevMessages as ActionMessage[]) : []),
				{
					actions: response.actions,
					content: {
						role: 'model',
						parts: [{text: response.text}],
					},
				},
			])
		}
	}
	return (
		<div className='App'>
			<button onClick={startChat}>Start chat</button>
			{messages != undefined ? (
				messages.map(
					(message) =>
						message.content.parts &&
						message.content.parts.length > 0 &&
						message.content.parts[0].text &&
						message.content.parts[0].text.length > 0 && (
							<div>
								{message.content.role} :{' '}
								{message.content.parts[0].text}
								<br />
								{message.actions.map((action) => (
									<button style={{margin: 8}}>
										{action.actionText}
									</button>
								))}
							</div>
						)
				)
			) : (
				<div></div>
			)}
			<input
				placeholder='Enter prompt'
				onChange={handlePromptChange}
				value={prompt}
			/>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	)
}

export default App
