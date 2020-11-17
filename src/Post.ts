import { ReturnPost } from './ReturnPost';
import { Category } from './Category';

export class Post {
    public postId: number = 0;
    public createdDate: Date = new Date(); //Verify this works
    public title: string = "";
    public content: string = "";
    public userId: string = "";
    public headerImage: string = "";
    public lastUpdated: Date = new Date();
    public categories: Category[] = [];
    public comments: Comment[] = [];

    returnPost() {
        let returnPost = new ReturnPost();
        returnPost.postId = this.postId;
        returnPost.createdDate = this.createdDate;
        returnPost.title = this.title;
        returnPost.content = this.content;
        returnPost.userId = this.userId;
        returnPost.headerImage = this.headerImage;
        returnPost.lastUpdated = this.lastUpdated;
        return returnPost;
    }
}

