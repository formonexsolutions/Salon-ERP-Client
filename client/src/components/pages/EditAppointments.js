import React, { useState, useEffect,useCallback } from "react";
// import "../styles/EditAppointments.css";
import axios from "axios";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { BASE_URL } from "../Helper/helper";

const EditAppointments = ({ data, index, onSave, onCancel }) => {
  const [customerData, setCustomerData] = useState(data);
  const [stylists, setStylists] = useState([]);
  const salonId = localStorage.getItem("salon_id");
  // const branchId = localStorage.getItem("branch_id");
  const [editedData, setEditedData] = useState(
    data.appointments && data.appointments.length > 0
      ? {
          ...data.appointments[index],
          services: data.appointments[index].selectedServices || [],
        }
      : {
          /* Provide a default value if necessary */
        }
  );

  const [selectedServices, setSelectedServices] = useState(
    editedData.selectedServices || []
  );

  const [popupData, setPopupData] = useState(null);
  const [services, setServices] = useState([]);
  useEffect(() => {
    if (editedData.selectedServices && editedData.selectedServices.length > 0) {
      setSelectedServices(editedData.selectedServices);
    }
  }, [editedData.selectedServices]);

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/services`, {
        headers: {
          salon_id: salonId, // Include salon_id in the request headers
        },
      });
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, [salonId]);
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  
  useEffect(() => {
    const salonId = localStorage.getItem('salon_id');
    const branchId = localStorage.getItem('branch_id');
    if (!salonId || !branchId) {
        console.error('Salon ID or Branch ID not found in local storage.');
        return;
    }

    axios
        .get(`${BASE_URL}/api/employees/stylists/bySalonAndBranch?salon_id=${salonId}&branch_id=${branchId}`)
        .then((response) => {
            setStylists(response.data);
        })
        .catch((error) => {
            console.error('Error fetching stylists:', error);
        });
}, []);

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    date: "",
    fromTiming: "",
    toTiming: "",
    notes:'',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Check for any existing errors before saving
    if (errors.name || errors.phone) {
      return;
    }

    const updatedAppointment = {
      ...editedData,
      selectedServices: selectedServices,
    };

    const updatedAppointments = [...customerData.appointments];
    updatedAppointments[index] = updatedAppointment;

    setCustomerData({
      ...customerData,
      appointments: updatedAppointments,
    });

    onSave(updatedAppointment); // Pass the updated appointment to onSave
  };

  const openPopup = (item) => {
    setPopupData(true);
  };

  const closePopup = () => {
    setPopupData(null);
    // Reset display when closing the popup
  };

  const handleCheckboxChange = (label) => {
    // Check if the label is already in the selected services
    if (selectedServices.includes(label)) {
      // If it's already selected, deselect it by filtering it out
      setSelectedServices(
        selectedServices.filter((service) => service !== label)
      );
    } else {
      // If it's not selected, select it by adding it to the array
      setSelectedServices([...selectedServices, label]);
    }
  };

  const handleDateChange = (date) => {
    const parsedDate = moment(date, ["YYYY-MM-DD", moment.ISO_8601], true);
    if (parsedDate.isValid()) {
      setEditedData({ ...editedData, date: parsedDate.format("YYYY-MM-DD") });
      setErrors({ ...errors, date: "" });
    } else {
      setErrors({ ...errors, date: "Invalid date format" });
    }
  };

  const handleFromTimeChange = (time) => {
    const parsedTime = moment(time, ["h:mm A", "HH:mm"], true);
    if (parsedTime.isValid()) {
      setEditedData({ ...editedData, fromTiming: parsedTime.format("h:mm A") });
      setErrors({ ...errors, fromTiming: "" });
    } else {
      setErrors({ ...errors, fromTiming: "Invalid time format" });
    }
  };

  const handleToTimeChange = (time) => {
    const parsedTime = moment(time, ["h:mm A", "HH:mm"], true);
    if (parsedTime.isValid()) {
      setEditedData({ ...editedData, toTiming: parsedTime.format("h:mm A") });
      setErrors({ ...errors, toTiming: "" });
    } else {
      setErrors({ ...errors, toTiming: "Invalid time format" });
    }
  };

  return (
    <div className="edit-main11">
      <div className="appnt-form11">
        <h5 className="appnt-heading11">Appointment Details</h5>

        <form>
          <div className="appntform-group11">
            <label htmlFor="name" className="appnt-label11">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleChange}
              required
              readOnly
              className="text-input11"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">Phone</label>
            <input
              type="tel"
              name="phone"
              value={editedData.phone}
              onChange={handleChange}
              pattern="[6-9][0-9]{9}"
              title="Phone number should be 10 digits long and start with a digit from 6 to 9"
              className="text-input11"
              maxLength="10"
              required
              readOnly
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">Services</label>
            <div className="flex-category390">
              <div className="selected-services12">
                <ol className="ol897">
                  {selectedServices.length > 0 && (
                    <div className="selected-services">
                      {/* <h6>Selected Services:</h6> */}

                      {selectedServices.map((service, index) => (
                        <li className="li78" key={index}>
                          {service}
                        </li>
                      ))}
                    </div>
                  )}
                </ol>
              </div>

              <div>
                <button
                  type="button"
                  className="servbtn11"
                  onClick={() => openPopup()}
                >
                  + Add Services
                </button>
              </div>
            </div>
          </div>
          <div className="appntform-group11">
            <label className="appnt-label11">Select Stylist</label>
            <select
              name="stylist"
              value={editedData.stylist}
              onChange={handleChange}
              required
              className="text-input11"
            >
              <option value="">Select a stylist</option>
              {stylists.map((stylist) => (
                <option key={stylist._id} value={stylist.employeeName}>
                  {stylist.employeeName}
                </option>
              ))}
            </select>
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">Date</label>
            <Datetime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              value={editedData.date}
              onChange={handleDateChange}
              className="small-input1122 datetime-picker"
              inputProps={{
                className: "text-input111",
                placeholder: "Select date",
                readOnly: false,
              }}
              closeOnSelect
            />
            {errors.date && <div className="error">{errors.date}</div>}
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">From Timing</label>
            <Datetime
              dateFormat={false}
              timeFormat="h:mm A"
              value={editedData.fromTiming}
              onChange={handleFromTimeChange}
              className="small-input1133 datetime-picker"
              inputProps={{
                className: "text-input111",
                placeholder: "Select start time",
                readOnly: false,
              }}
            />
            &nbsp;&nbsp; To &nbsp;&nbsp;
            <Datetime
              dateFormat={false}
              timeFormat="h:mm A"
              value={editedData.toTiming}
              onChange={handleToTimeChange}
              className="small-input1133 datetime-picker"
              inputProps={{
                className: "text-input111",
                placeholder: "Select end time",
                readOnly: false,
              }}
            />
            {errors.fromTiming && (
              <div className="error">{errors.fromTiming}</div>
            )}
            {errors.toTiming && <div className="error">{errors.toTiming}</div>}
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">Notes</label>
            <textarea
              name="notes"
              className="customer-inputa7"
              value={editedData.notes}
              onChange={handleChange}
              required
              rows="4"
              cols="40"
            ></textarea>
          </div>

          <div className="bookbtn-div11">
            <button type="submit" className="bookbtn11" onClick={handleSave}>
              Book
            </button>
            <button className="cancel-btn11" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {popupData && (
        <div className="popupsk14">
          <div className="popup-contentsk14">
            <div className="btnend234">
              <h5>Select the Services</h5>
              <button className="btn567" onClick={closePopup}>
                X
              </button>
            </div>
            <div className="men-women">
              <div className="flex0033">
                <h5 className="h58">Men Category</h5>
                <div className="men-category">
                  {services
                    .filter((service) => service.category === "Male")
                    .map((service) => (
                      <div className="service-item" key={service._id}>
                        <input
                          type="checkbox"
                          onChange={() =>
                            handleCheckboxChange(`Men - ${service.serviceName}`)
                          }
                          checked={selectedServices.includes(
                            `Men - ${service.serviceName}`
                          )}
                          style={{ marginLeft: "8px" }}
                          className="custom-checkbox"
                        />
                        <label className="lableup123">{`Men - ${service.serviceName}`}</label>
                        <span className="size293">Rs - {service.price}</span>
                        <span className="size2935">
                          Time: {service.durationTime}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex0033">
                <h5 className="h58">Women Category</h5>
                <div className="women-category">
                  {services
                    .filter((service) => service.category === "Female")
                    .map((service) => (
                      <div className="service-item" key={service._id}>
                        <input
                          type="checkbox"
                          onChange={() =>
                            handleCheckboxChange(
                              `Women - ${service.serviceName}`
                            )
                          }
                          checked={selectedServices.includes(
                            `Women - ${service.serviceName}`
                          )}
                          style={{ marginLeft: "8px" }}
                          className="custom-checkbox"
                        />
                        <label className="lableup123">{`Women - ${service.serviceName}`}</label>
                        <span className="size293">Rs - {service.price}</span>
                        <span className="size2935">
                          Time: {service.durationTime}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAppointments;
