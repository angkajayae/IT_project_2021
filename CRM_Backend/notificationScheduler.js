// import contact model & nodemailer
const Events = require('./models/event');
const Contacts = require('./models/contact');
const Users = require('./models/users')
const nodemailer = require('nodemailer')
const moment = require('moment')
const momentTimezone = require('moment-timezone')
const objectId = require('mongodb').ObjectID;


const getParticipants = async (ids) => {
  const participants = await Contacts.find({_id : { $in: ids}}).lean()
  const participantNames = participants.map(participant => (participant.contactName))
  return participantNames

}

const getEmail = async (event) => {
  const userId = event.userId
  const user = await Users.findOne({_id: userId}).lean()
  return user.email
}

const sendNotifications = async() => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const timeFormat = "DD/MM/YY, hh:mm a"

  //create nodemailer transporter with provided credentials
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "developers.personalcrm@gmail.com",
        pass: "devel-opers_crm"
    }
  });
  
  // get all events in the allocated timerange(today, tomorrow)
  const events = await Events.find({startTime: {
    $gt: today,
    $lt: tomorrow
  }, isEmailed: 'false'}).lean()

  if(events.length > 0){
    events.forEach( async (event) => {
      //get the user's Email
      const userEmail = await getEmail(event)
  
      //get the name list of the participants
      const participantsList = await getParticipants(event.participants)
  
      
      // Create the notification text
      const emailText = `Dear User,\n\nYou have an Upcoming Event:\n\n`+
      `Event Name: ${event.eventName}\n\n`+
      `Start Time: ${momentTimezone(event.startTime).tz(event.timezone).format(timeFormat)} (${event.timezone})\n\n`+
      `End Time: ${momentTimezone(event.endTime).tz(event.timezone).format(timeFormat)} (${event.timezone})\n\n`+
      `Participants: ${participantsList.join(", ")}\n\n`+
      `Description: ${event.description}\n\n`+
      `Location: ${event.location}`

  
      // email to the user
      const mailOptions = {
        from: "developers.personalcrm@outlook.com",
        to: userEmail,
        subject: `Personal CRM : Notification for "${event.eventName}"`,
        text: emailText
      }
  
      transporter.sendMail(mailOptions, async function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
          await Events.findOneAndUpdate({_id: objectId(event._id)}, {isEmailed: true});
        }
      });
  
    })

  }

  return

}




module.exports = {
  sendNotifications
};