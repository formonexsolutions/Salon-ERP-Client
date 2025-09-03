import React, { useEffect, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/Calendar.css";
import { BASE_URL } from "../Helper/helper";

const Calendar = ({ onNewBillClick }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const branchId = localStorage.getItem('branch_id');
      const salonId = localStorage.getItem('salon_id');
  
      if (!branchId || !salonId) {
        console.error('Branch ID or Salon ID not found in localStorage');
        return;
      }
  
      // Pass both branchId and salonId as query parameters
      const response = await axios.get(`${BASE_URL}/api/appointments`, {
        params: { branchId, salonId }
      });
  
      if (response.status === 200) {
        const appointmentsData = response.data;
        setAppointments(appointmentsData);
      } else {
        console.error("Error fetching appointments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };
  
  

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateNewClick = () => {
    if (onNewBillClick) {
      onNewBillClick();
    }
  };

  const handleEventClick = (info) => {
    const event = info.event.extendedProps;
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const convertTo24HourFormat = (time) => {
    if (!time) {
      
      return '';
    }
  
    // Split the time into time part and AM/PM modifier
    const [timePart, modifier] = time.split(' ');
    if (!timePart || !modifier) {
      
      return '';
    }
  
    // Split the time part into hours and minutes
    let [hours, minutes] = timePart.split(':');
    if (!hours || !minutes) {
      
      return '';
    }
  
    // Convert hours to integer
    hours = parseInt(hours);
    if (isNaN(hours)) {
     
      return '';
    }
  
    // Convert PM hours to 24-hour format
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      // Convert 12 AM to 0 hours
      hours = 0;
    }
  
    // Ensure hours and minutes are two digits
    return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };
  
  

  const appointmentEvents = appointments.flatMap(appointment => 
    appointment.__parentArray.map((parent, index) => {
      const startTime = `${parent.date}T${convertTo24HourFormat(parent.fromTiming)}`;
      const endTime = `${parent.date}T${convertTo24HourFormat(parent.toTiming)}`;
      return {
        id: `appointment-${parent._id}-${index}`,
        title: `Appointment with ${parent.name}`,
        start: startTime,
        end: endTime,
        extendedProps: { ...parent },
      };
    })
  );

 
  return (
    <div className="both-calendar-container2pcc">
      <div className="roaylcalendermain2p-cal">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "bookButton dayGridMonth,timeGridWeek,timeGridDay",
          }}
          customButtons={{
            bookButton: {
              text: "+ New",
              click: handleCreateNewClick,
            },
          }}
          height={"90vh"}
          events={appointmentEvents}
          eventClick={handleEventClick}
          eventContent={(arg) => {
            const fromTime = convertTo24HourFormat(arg.event.extendedProps.fromTiming);
            const appointmentInfo = `${fromTime} appointment with ${arg.event.extendedProps.name}`;
            // const services = arg.event.extendedProps.selectedServices.join(', ');
            return (
              <div className="custom-event">
                <p className="fc-event-title">{appointmentInfo}</p>
                {/* <p className="fc-event-services">Services: {services}</p> */}
              </div>
            );
          }}
          eventClassNames={(info) => {
            const eventDate = new Date(info.event.start);
            const currentDate = new Date();
            const isToday =
              eventDate.toDateString() === currentDate.toDateString();

            if (isToday) {
              return ["today-appointment"];
            } else if (eventDate < currentDate) {
              return ["past-appointment"];
            }

            return [];
          }}
        />
      </div>

      <div className="main-empp">
        {selectedEvent && (
          <Modal show={true} onHide={closeModal}>
            <Modal.Header>
              <Modal.Title>Appointment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="bd908">
                <div className="roaylcalendermain2p-p">
                  <span className="box-container">Name</span>: &nbsp;&nbsp;
                  {selectedEvent.name}
                </div>
                <div className="roaylcalendermain2p-p">
                  <span className="box-container">Phone</span>: &nbsp;&nbsp;
                  {selectedEvent.phone}
                </div>
                <div className="roaylcalendermain2p-p">
                  <span className="box-container">From</span>: &nbsp;&nbsp;
                  {selectedEvent.fromTiming}
                </div>
                <div className="roaylcalendermain2p-p">
                  <span className="box-container">To</span>: &nbsp;&nbsp;
                  {selectedEvent.toTiming}
                </div>
                <div className="roaylcalendermain2p-p">
                  <span className="box-container">Stylist</span>: &nbsp;&nbsp;
                  {selectedEvent.stylist}
                </div>
                <div className="roaylcalendermain2p-p">
                  <span className="box-container">Services</span>: &nbsp;&nbsp;
                  {selectedEvent.selectedServices.join(', ')}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};
export default Calendar;
