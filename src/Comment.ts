export class Comment {
    public commentId: string = ""; //number?
    public comment: string = "";
    public userId: string = "";
    public postId: string = "";
    public commentDate: Date = new Date(); //todo make hashed
}
