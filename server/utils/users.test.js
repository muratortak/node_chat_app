const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
    var users;

    //it is going to be called before each test call
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            roomName: 'Node Course'
        },
        {
            id: '2',
            name: 'Jen',
            roomName: 'React Course'
        },
        {
            id: '3',
            name: 'Julie',
            roomName: 'Node Course'
        }];
    });
    
    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'andrew',
            roomName: 'The Office Fans'
        };
        var resUser = users.addUser(user.id, user.name, user.roomName);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        var userId = '10';
        var user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find a user', () => {
        var userId = '2';
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find a user', () => {
        var userId = '99';
        var user = users.getUser(userId);

        expect(user).toNotExist;
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for react course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Jen']);
    });
}); 