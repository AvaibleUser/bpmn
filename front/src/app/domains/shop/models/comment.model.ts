export interface CommentCreate {
  content: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  username: string;
  replyTo?: number;
  replies?: Comment[];
  createdAt: Date;
  updatedAt?: Date;
}
