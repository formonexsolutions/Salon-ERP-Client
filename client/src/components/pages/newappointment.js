
import React, { useState, useEffect } from "react";
import "../styles/newappointment.css";
import "react-datetime/css/react-datetime.css";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../Helper/helper";
import { LuIndianRupee } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

const NewAppointment = ({ customer }) => {
  const [popupData, setPopupData] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  // const salonId = localStorage.getItem('salon_id'); // Get salon_id from local storage

  const [formData, setFormData] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    discount: customer?.discount || "",
    date: "",
    fromTiming: "",
    toTiming: "",
    advance: "",
    notes: "",
    stylist: "",
  });

  const [errors, setErrors] = useState({
    date: "",
    fromTiming: "",
    toTiming: "",
  });

  const openPopup = () => {
    setPopupData(true);
  };

  const closePopup = () => {
    setPopupData(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (label) => {
    if (selectedServices.includes(label)) {
      setSelectedServices(
        selectedServices.filter((service) => service !== label)
      );
    } else {
      setSelectedServices([...selectedServices, label]);
    }
  };

  const fetchServices = async () => {
    try {
      const salonId = localStorage.getItem('salon_id');
      const response = await axios.get(`${BASE_URL}/api/services?salon_id=${salonId}`, {
       
      });
  
      // Filter out services with status "IA" (Inactive)
      const activeServices = response.data.filter(service => service.status !== 'IA');
      setServices(activeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, []);
  

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
          const activeStylists = response.data.filter(stylist => stylist.status !== 'IA');
          setStylists(activeStylists);
        })
        .catch((error) => {
            console.error('Error fetching stylists:', error);
        });
}, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      toast.warn("Please select at least one service.");
      return;
    }

    try {
      const userRole = localStorage.getItem("userRole");
    let createdBy = null;

    if (userRole === "admin") {
      createdBy = localStorage.getItem("employeeName");
    } else {
      createdBy = localStorage.getItem("userName");
    }
    let modifiedBy = null;

      const dataToSend = {
        ...formData,
        selectedServices: selectedServices,
        name: customer.name,
        phone: customer.phone,
        discount: customer.discount,
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        modifiedBy: modifiedBy,
        modifiedAt: new Date().toISOString(),
        branchId: customer.branchId, // Populate branchId from customer
      };

      const customerId = customer._id;
      await axios.post(
        `${BASE_URL}/api/customers/${customerId}/appointments`,
        dataToSend
      );


      toast.success("Appointment Booked Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear the form fields after successful booking
      setSelectedServices([]);
      setFormData({
        name: customer?.name || "",
        phone: customer?.phone || "",
        discount: customer?.discount || "",
        date: "",
        fromTiming: "",
        toTiming: "",
        advance: "",
        notes: "",
        stylist: "",
      });
      setErrors({
        date: "",
        fromTiming: "",
        toTiming: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(
          "Stylist is not available at the selected time. Please select another time or stylist."
        );
      } else {
        toast.error("Error while booking appointment");
      }
    }
  };

  const handleDateChange = (date) => {
    const parsedDate = moment(date, ["YYYY-MM-DD", moment.ISO_8601], true);
    if (parsedDate.isValid()) {
      setFormData({ ...formData, date: parsedDate.format("YYYY-MM-DD") });
      setErrors({ ...errors, date: "" });
    } else {
      setErrors({ ...errors, date: "Invalid date format" });
    }
  };

  const handleFromTimeChange = (time) => {
    const parsedTime = moment(time, ["h:mm A", "HH:mm"], true);
    if (parsedTime.isValid()) {
      setFormData({ ...formData, fromTiming: parsedTime.format("h:mm A") });
      setErrors({ ...errors, fromTiming: "" });
    } else {
      setErrors({ ...errors, fromTiming: "Invalid time format" });
    }
  };

  const handleToTimeChange = (time) => {
    const parsedTime = moment(time, ["h:mm A", "HH:mm"], true);
    if (parsedTime.isValid()) {
      setFormData({ ...formData, toTiming: parsedTime.format("h:mm A") });
      setErrors({ ...errors, toTiming: "" });
    } else {
      setErrors({ ...errors, toTiming: "Invalid time format" });
    }
  };

  return (
    <div className="main-empp">
      <div className="appnt-form11">
        <h5 className="heading234">Appointment Detailes</h5>
        <form onSubmit={handleBook} autoComplete="off">
          <div className="appntform-group11">
            <label htmlFor="name" className="appnt-label11">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={customer?.name}
              onChange={handleChange}
              required
              className="text-input11"
            ></input>
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">Phone</label>
            <input
              type="tel"
              name="phone"
              value={customer?.phone}
              onChange={handleChange}
              className="text-input11"
              required
            ></input>
          </div>

          <div className="appntform-group11">
            <label className="appnt-label11">Services</label>
            <div className="change-column90">
              <div>
                {selectedServices.length > 0 && (
                  <div className="selected-services">
                    <ol>
                      {selectedServices.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ol>
                  </div>
                )}
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
              value={formData.stylist}
              onChange={handleChange}
              required
              className="text-input1101"
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
              value={formData.date}
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
              value={formData.fromTiming}
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
              value={formData.toTiming}
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
              className="textarea567"
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              // required
              rows="4"
              cols="31"
            ></textarea>
          </div>

          <div className="bookbtn-div11">
            <button type="submit" className="bookbtn11">
              Book
            </button>
          </div>
        </form>
      </div>
      {popupData && (
        <div className="popupsk14">
          <div className="popup-contentsk14">
            <div className="btnend234">
              <h5 className="popup-services-heading">Select the Services</h5>
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
                        <label className="lableup123">
                          {`Men - ${service.serviceName}`}{" "}
                        </label>

                        <span className="size293">
                          <LuIndianRupee />
                          {service.price}
                        </span>
                        <span className="size2935">
                          <MdAccessTime /> {service.durationTime}
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
                        <label className="lableup123">
                          {`Women - ${service.serviceName}`}{" "}
                        </label>

                        <span className="size293">
                          <LuIndianRupee />
                          {service.price}
                        </span>
                        <span className="size2935">
                          <MdAccessTime />
                          {service.durationTime}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default NewAppointment;


