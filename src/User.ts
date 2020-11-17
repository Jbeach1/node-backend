import { ReturnUser } from './ReturnUser';
import bcrypt from 'bcrypt';


export class User {
    public userId: string = "";
    public firstName: string = "";
    public lastName: string = "";
    public emailAddress: string = "";
    public hashedPassword: string = "";
    public authToken: string = "";

    setPw(this: any, password: string) {
        this.password = password;
    }

    getPw(this: any, password: string) {
        return this.password;
    }

    returnUser() {
        let returnUser = new ReturnUser();
        returnUser.userId = this.userId;
        returnUser.firstName = this.firstName;
        returnUser.lastName = this.lastName;
        returnUser.emailAddress = this.emailAddress;
        return returnUser;
    }

    hash(password: string) {
        this.hashedPassword = bcrypt.hashSync(password, 10);
    }

    verifyPass(pw: string, hashed: string) {
        if (pw === undefined || hashed === undefined) {
            return false;
        }
        return bcrypt.compareSync(pw, hashed);
    }

}