export type ChatItem = {
    id: string;
    author: string | number;
    message: string;
    tags: string[];
    date: Date;
    contacts: number[];
    profileImage: string;
    messageStatus: "sent" | "delivered" | "seen" | "deleted" | "failed" | "unseen";
    lastMessageBy: string;
};
  