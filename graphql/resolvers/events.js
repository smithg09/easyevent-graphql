
const EventModel = require("../../models/event");
const UserModel = require('../../models/user');
const { user } = require('./merge')
const { transformEvent } = require('./merge');


module.exports = {
  events: async () => {
    try {
      const res = await EventModel.find({});
      return res.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new EventModel({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const res = await event.save();
      createdEvent = transformEvent(res);
      const creator = await UserModel.findById(req.userId);
      if (!creator) {
        throw new Error("User doesn't exists.");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
};