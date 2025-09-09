import * as z from "zod";

export interface CommentDto {
  id: number;
  content: string;
  userId: number;
  username: string;
  replyTo: number | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export const upsertComment = z.object({
  content: z.string().nonempty().nonoptional(),
});

export type UpsertCommentDto = z.infer<typeof upsertComment>;
