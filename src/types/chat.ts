// Chat related type definitions

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'student';
  created_at?: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  title?: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  otherUser?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read?: boolean;
  status?: 'sending' | 'sent' | 'failed';
}

export interface TypingIndicator {
  user_id: string;
  conversation_id: string;
  is_typing: boolean;
}
