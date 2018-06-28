export class ResourceEndPoint {
    static User = 'user';
    static Student = 'student';
    static Faculty = 'faculty';
    static LmsAdmin = 'lmsadmin';
}

//Assigned string to enum to fix Angular-cli not working with enums. 
export enum DataContext {
    User = 'user',
    Student = 'student',
    Faculty = 'faculty',
    LmsAdmin = 'lmsadmin',
}

export class UserEntityType {
    static Person = 'Person';
}
