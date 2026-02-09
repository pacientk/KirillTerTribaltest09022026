import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { Message } from '../types'

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
})

const SYSTEM_PROMPT = `You are an AI assistant that helps users build UI components.
You can analyze images, code snippets, and user requirements to generate React components with Tailwind CSS.

When asked to create UI components:
1. Analyze the provided context (images, code, or descriptions)
2. Generate clean, modern React/TypeScript code with Tailwind CSS
3. Explain your design decisions briefly

Always respond in a helpful and clear manner.`

export async function sendMessage(
  history: Message[],
  newMessage: Message
): Promise<string> {
  const messages = [
    ...history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: buildMessageContent(newMessage),
    },
  ]

  try {
    const { text } = await generateText({
      model: openai('gpt-4'),
      system: SYSTEM_PROMPT,
      messages,
    })

    return text
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to get response from AI')
  }
}

function buildMessageContent(message: Message): string {
  let content = message.content

  if (message.attachments && message.attachments.length > 0) {
    const codeAttachments = message.attachments.filter((a) => a.type === 'code')
    const imageAttachments = message.attachments.filter((a) => a.type === 'image')

    if (codeAttachments.length > 0) {
      content += '\n\nAttached code files:\n'
      codeAttachments.forEach((attachment) => {
        content += `\n--- ${attachment.name} ---\n${attachment.content || ''}\n`
      })
    }

    if (imageAttachments.length > 0) {
      content += `\n\n[${imageAttachments.length} image(s) attached]`
    }
  }

  return content
}

