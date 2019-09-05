var expect = require("expect");

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        //store response in variable
        //assert from match
        //assert text match
        //assert createdAt is number
        var from = 'Jen';
        var text = 'Some message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            text
        });

    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () =>{ 
        var from = 'TestUser';
        var lat = 15;
        var lng = 19;
        url = 'https://www.google.com/maps?q=15,19';
        var message = generateLocationMessage(from, lat, lng);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            url
        })
        
    })
})