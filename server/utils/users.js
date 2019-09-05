[
    {
        id: '',
        name: '',
        room: ''
    }
]

// addUser(id, name, roomName)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, roomName) {
        var user = {id: id, name: name, roomName: roomName};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        // return user that was removed
        var user = this.getUser(id);
        
        if(user) {
            //update the users array with the users without the one user that is supposed to be deleted
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser(id) {

        return this.users.filter((user) => user.id === id)[0];

    }

    getUserList(room) {
        var users = this.users.filter((user) => user.roomName === room);
        //map is similar filter. Map returns the value we want to use
        var namesArray = users.map((user) => user.name);
        
        return namesArray;
    }
}

// class Person {
//     constructor(name, age){
//         this.name = name;
//         this.age = age;
//     }

//     getUserDescription(){
//         return `${this.name} is ${this.age} year(s) old.`;
//     }
// }


// var me = new Person('murat', 25);
// var description = me.getUserDescription();
// console.log(description);


module.exports = {Users};
