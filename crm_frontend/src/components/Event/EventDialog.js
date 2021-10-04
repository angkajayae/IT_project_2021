import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import moment from "moment";
import SuggestionDropDown from "./SuggestionDropDown";

export default function EventDialog({ isOpen, setDialog, onAdd}) {

  const initialState = {
    eventName: "",
    startTime: moment(new Date()).format("yyyy-MM-DDTHH:mm"),
    endTime: moment(new Date()).format("yyyy-MM-DDTHH:mm"),
    description: "",
    location: "",
  };

  const [state, setState] = useState(initialState);
  const [contacts, setContacts] = useState([])
  const [participants, setParticipants] = useState([])

  //Fetch Contacts
  const fetchContacts = async () => {
    const res = await fetch('http://localhost:5000/contact')
    const data = await res.json()
    const returnedData = []

    data.map((contact) => returnedData.push({name: contact.contactName, id: contact._id}))
    
    return returnedData
  }

  // handle the change for the states
  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setDialog(false);
    setState(initialState);
    setParticipants([])
    setContacts([])
  };

  // handle submitting the data to the backend
  const onSubmit = (e) => {
    e.preventDefault();
    const dateAdded = new Date()

    //extract the participantsId from the participant list
    const participantsIdArray = []
    participants.map((participant) => participantsIdArray.push(participant.id))

    const data = {
      eventName: state.eventName, 
      startTime: state.startTime, 
      endTime: state.endTime, 
      participants:participantsIdArray, 
      description: state.description, 
      location: state.location, 
      dateAdded}

    onAdd(data)
    handleClose()
    
  };

  useEffect(() => {
    const getContacts = async () =>{
      const contactsFromBackEnd = await fetchContacts()
      setContacts(contactsFromBackEnd)
    }
    getContacts()
  }, [isOpen])

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth={true} maxWidth={'xs'}>
      <DialogTitle>Create Event</DialogTitle>
      <DialogContent>
        <div>

          <div className='form-control'>
            <TextField
              fullWidth
              type="text"
              label="Event Name" 
              variant="outlined"
              name="eventName"
              value={state.eventName}
              onChange={onChange}
            />
          </div>

          <div className='form-control'>
            <TextField
              fullWidth
              type="datetime-local"
              label="Start Time" 
              variant="outlined"
              name="startTime"
              value={state.startTime}
              onChange={onChange}
            />
          </div>

          <div className='form-control'>
            <TextField
              fullWidth
              type="datetime-local"
              label="End Time" 
              variant="outlined"
              name="endTime"
              value={state.endTime}
              onChange={onChange}
            />
          </div>

          <div className='form-control'>
          <SuggestionDropDown 
            participants={participants} 
            items={contacts} 
            onChange={(value) => setParticipants(value)}/>
          </div>

          <div className='form-control'>
            <TextField
              fullWidth
              type="text"
              label="Description" 
              variant="outlined"
              name="description"
              value={state.description}
              onChange={onChange}
            />
          </div>

          <div className='form-control'>
            <TextField
              fullWidth
              type="text"
              label="Location" 
              variant="outlined"
              name="location"
              value={state.location}
              onChange={onChange}
            />
          </div>
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}