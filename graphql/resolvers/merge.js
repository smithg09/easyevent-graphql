const EventModel = require('../../models/event')
const DataLoader = require('dataloader');
const UserModel = require("../../models/user");
const { dateToString } = require("../../helpers/date");


// DataLoader used for batching all simillar requests 
const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return UserModel.find({ _id: { $in: userIds } });
})

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.createdAt),
  };
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
   };
};

const events = async (eventIds) => {
  try {
    const events = await EventModel.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString());
    });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};
const user = async (userId) => {
  try {
    // const user = await UserModel.findById(userId);
    // Instead used loader 
    const user = await userLoader.load(userId.toString()); // Ids converted to String to avoid conjuction of dataloader with different key
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
      // OR
      // createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};


// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;