export default interface IConversation {
  content: string;
  id: number;
  role: 'assistant' | 'user';
  timestamp: string;
  userId: string;
}
