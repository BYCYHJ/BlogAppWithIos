export type UserInfo = {
    userId: string,
    userName: string,
    avatarUrl: string
}

export type Blog = {
    id: string,
    title: string,
    content: string
}

export type MyComment = {
    id:string,
    content: string,
    parentId: string | null | undefined,
    publishDate: string,
    userId: string,
    userName: string,
    avatarUrl: string | null | undefined,
    starCount: number,
    replyUserName: string | null | undefined,
    childrenComment: Array<Comment> | null | undefined
}