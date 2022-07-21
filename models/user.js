class User{
    constructor(
        fullName,
        userName,
        email,
        password,
        role
    ){
        this.fullName = fullName;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

module.exports = User;