import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/landingpage.css";
import Laptap from "../images/Laptap.png";
import manimage from "../images/man-image.png";
import greenproduct from "../images/green-product.png";
// import rectangelimg1 from "../images/Rectangle-1.png";
// import rectangelimg2 from "../images/Rectangle-2.png";
// import rectangelimg3 from "../images/Rectangle-3.png";
import womenimage1 from "../images/Womenimg-1.png";
import womenimage2 from "../images/Womenimg-2.png";
import womenimage3 from "../images/Womenimg-3.png";
import womenimage5 from "../images/Womenimg-5.png";
import womenimage6 from "../images/Women-img-6.png";
import womenimage7 from "../images/Women-img-7.png";
import womenimage8 from "../images/Women-img-8.png";
import womenimage9 from "../images/Women-img-9.png";
import womenimage10 from "../images/Women-img-10.png";
import womenimage11 from "../images/Women-img-11.png";
import womenimage12 from "../images/Women-img-12.png";
import womenimage13 from "../images/Women-img-13.png";
import womenimage14 from "../images/Women-img-14.png";
import womenimage15 from "../images/Women-img-15.png";
import menimg1 from "../images/men-image-1.png";
import menimg2 from "../images/men-image-2.png";
import menimg3 from "../images/men-image-3.png";
import menimg4 from "../images/men-image-4.png";
import menimg5 from "../images/men-image-5.png";
import menimg6 from "../images/men-image-6.png";
import menimg7 from "../images/men-image-7.png";
import menimg8 from "../images/men-image-8.png";
import menimg9 from "../images/men-image-9.png";
import menimg10 from "../images/men-image-10.png";
import menimg11 from "../images/men-image-11.png";
import menimg12 from "../images/men-image-12.png";
import menimg13 from "../images/men-image-13.png";
import reviewimage1 from "../images/review-men-img.jpg";
import reviewimage2 from "../images/review-men-img1.jpg";
import reviewimage3 from "../images/review-women-img.jpg";
import Tabmobileimg from "../images/Tab-mobile.png";
import Salonlogo from "../images/Salon-logo.png";
// import Bgimage from "../images/Bg-image.jpg";
import startimg from "../images/Star.png";
import greentrendslogo from "../images/green-trends.png";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import lorealimg from "../images/loreal-img.png";
import naturalsimg from "../images/naturals.png";
import { FaChevronDown } from "react-icons/fa";
import mobileviewimage from "../images/mobile-viewimage.png";
import { FaChevronUp } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import teammateimg from "../images/teammate-img.png";
import { FaMapLocationDot, FaRegCircleCheck } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
// import { FaYoutube, FaInstagram } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";
import { PiDeviceMobileCameraThin } from "react-icons/pi";
import { AiOutlineExpand } from "react-icons/ai";
import { LuLaptop } from "react-icons/lu";
// import mobileviewimg from "../images/Mobile-View-img.png";
import PlayStoreIcon from "../images/play-store.png";
import AppleStoreIcon from "../images/apple-store.png";
import lapfullscreenimg from "../images/lap-fullscreen-img.png";
// import mobilefullscreenimg from "../images/mobile-fullscreen.png";
import { AiOutlineCompress } from "react-icons/ai";
import TermsModal from "./TermsModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import { IoMdArrowDropdown } from "react-icons/io";
// import { Link as ScrollLink } from "react-scroll";

const reviews = [
  {
    img: reviewimage1,
    text: "One Salon has completely transformed the way we manage our salon. The POS system is intuitive and the customer service is outstanding!",
    name: "Sujith",
    location: "Luxe Locks Coimbatore, Coimbatore",
    rating: 4.2,
  },
  {
    img: reviewimage2,
    text: "I love how One Salon makes scheduling and managing appointments so effortless. It's a game-changer for our business.",
    name: "Ramesh",
    location: "Bubbles Hair and Beauty Salon, Hyderabad",
    rating: 4.9,
  },
  {
    img: reviewimage3,
    text: "The inventory management feature is fantastic! It keeps us organized and helps us keep track of our products efficiently.",
    name: "Leela Sai",
    location: "Ideal Salon, Bengaluru",
    rating: 4.5,
  },
];

const Landingpage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeGender, setActiveGender] = useState("Women");

  const [isMobileViewPOS, setIsMobileViewPOS] = useState(false);
  const [isMobileViewService, setIsMobileViewService] = useState(false);
  const [isMobileViewCrm, setIsMobileViewCrm] = useState(false);
  const [isMobileViewReport, setIsMobileViewReport] = useState(false);
  const [isMobileViewInventory, setIsMobileViewInventory] = useState(false);
  const [isMobileViewStat, setIsMobileViewStat] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const openPrivacyModal = () => {
    setIsPrivacyModalOpen(true);
  };

  const closePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTogglePOS = () => {
    setIsMobileViewPOS(!isMobileViewPOS);
  };

  const handleToggleService = () => {
    setIsMobileViewService(!isMobileViewService);
  };
  // const handleTogglecrm = () => {
  //   setIsMobileViewCrm(!isMobileViewCrm);
  // };
  const handleToggleReport = () => {
    setIsMobileViewReport(!isMobileViewReport);
  };
  // const handleToggleInventort = () => {
  //   setIsMobileViewInventory(!isMobileViewInventory);
  // };
  const handleToggleStat = () => {
    setIsMobileViewStat(!isMobileViewStat);
  };

  const handleButtonClick = (gender) => {
    setActiveGender(gender);
  };
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [selectedCard, setSelectedCard] = useState("aboutUs");

  const handleCardClick = (cardName) => {
    setSelectedCard(cardName);
  };

  const [currentReview, setCurrentReview] = useState(0);
  const [animationClass, setAnimationClass] = useState("slide-in");

  const handleNext = () => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
      setAnimationClass("slide-in");
    }, 1000);
  };

  const handlePrevious = () => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
      setAnimationClass("slide-in");
    }, 1000);
  };

  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  const closeMenu = () => {
    setMenuActive(false);
  };

  const { img, text, name, location, rating } = reviews[currentReview];
  const [isPopupPOS, setIsPopupPOS] = useState(false);
  const [isPopupService, setIsPopupService] = useState(false);
  const [isPopupCrm, setIsPopupCrm] = useState(false);
  const [isPopupReport, setIsPopupReport] = useState(false);
  const [isPopupInventory, setIsPopupInventory] = useState(false);
  const [isPopupStat, setIsPopupStat] = useState(false);
  const handleToggleCrm = () => {
    setIsMobileViewCrm(!isMobileViewCrm);
  };

  const handleToggleInventory = () => {
    setIsMobileViewInventory(!isMobileViewInventory);
  };
  const handlePopupTogglePOS = () => {
    setIsPopupPOS(!isPopupPOS);
  };

  const handlePopupToggleService = () => {
    setIsPopupService(!isPopupService);
  };

  const handlePopupToggleCrm = () => {
    setIsPopupCrm(!isPopupCrm);
  };

  const handlePopupToggleReport = () => {
    setIsPopupReport(!isPopupReport);
  };

  const handlePopupToggleInventory = () => {
    setIsPopupInventory(!isPopupInventory);
  };

  const handlePopupToggleStat = () => {
    setIsPopupStat(!isPopupStat);
  };

  const isPopupActive =
    isPopupPOS ||
    isPopupService ||
    isPopupCrm ||
    isPopupReport ||
    isPopupInventory ||
    isPopupStat;

  const faqs = [
    {
      question: "What features does One Salon software offer?",
      answer:
        "One Salon offers a comprehensive suite of features including POS Billing, CRM, Inventory Management, Service Scheduling, Detailed Reports, and Statistics. It's designed to streamline your salon operations efficiently.",
    },
    {
      question: "How can One Salon help manage my inventory?",
      answer:
        "One Salon's Inventory Management allows you to track new purchases, add new products, and manage self-stock consumption. This helps you maintain optimal stock levels and avoid shortages or overstocking.",
    },
    {
      question: "Can I manage multiple branches with One Salon?",
      answer:
        "Yes, One Salon supports multiple branches, enabling you to oversee all your locations from a single platform. This feature is ideal for expanding businesses that require centralized control.",
    },
    {
      question: "Is One Salon suitable for both men and women services?",
      answer:
        "Absolutely! One Salon is designed to handle a wide range of services for both men and women, including haircuts, hairstyles, body massages, and more. You can customize the services offered based on your salon's specialties.",
    },
    {
      question:
        "How does One Salon handle customer relationship management (CRM)?",
      answer:
        "One Salon's CRM features help you manage customer information, track their service history, and engage with them through personalized marketing campaigns. This helps in building strong customer relationships and enhancing their experience.",
    },
    {
      question: "What types of reports can I generate with One Salon?",
      answer:
        "One Salon offers a variety of reports including billing reports, service reports, product sales reports, and employee performance reports. These reports provide valuable insights to help you make informed business decisions.",
    },
    {
      question: "How secure is my data with One Salon?",
      answer:
        "One Salon prioritizes data security with robust encryption and secure data storage practices. Your business information and customer data are well-protected to ensure privacy and compliance.",
    },
  ];

  return (
    <div className="pkk567">
      {/* Header code */}
      <header className="header">
        <div className="container43">
          <img className="header-h1" src={Salonlogo} alt="Salon logo" />
          <div className="flex603">
            <div className="menu-icon" onClick={toggleMenu}>
              &#9776;
            </div>
            <div className={`menu-content ${menuActive ? "active10" : ""}`}>
              <nav className="navigation8">
                <a href="#about-us" className="nav-link8" onClick={closeMenu}>
                  About Us
                </a>
                <a href="#features" className="nav-link8" onClick={closeMenu}>
                  Our Features
                </a>
                <a href="#services" className="nav-link8" onClick={closeMenu}>
                  Our Service
                </a>
              </nav>
              <Link to="/register" className="btn87" onClick={closeMenu}>
                  Register
                 
                </Link>
              
              <div className="mot67"
                onMouseEnter={() => setPopupVisible(true)}
                onMouseLeave={() => setPopupVisible(false)}
              >
                 <Link to="" className="btn879" onClick={closeMenu}>
                  Login
                   <IoMdArrowDropdown className="icon74" />
                </Link>
                
                {popupVisible && (
                  <div className="popup1">
                    <Link
                      to="/LoginPage"
                      className="popup-link"
                      onClick={closeMenu}
                    >
                      Salon Login
                    </Link>
                    <Link
                      to="/Dealer"
                      className="popup-link"
                      onClick={closeMenu}
                    >
                      Distributor Login
                    </Link>
                  </div>
                )}
                
              </div>
             
              <div
                className="mot677"
                onMouseEnter={() => setPopupVisible(true)}
                onMouseLeave={() => setPopupVisible(false)}
              >
                {/* <Link to="" className="btn87" onClick={closeMenu}>
                  Register
                  <IoMdArrowDropdown className="icon74" />
                </Link> */}

                {/* {popupVisible && ( */}
                {/* <div className="popup1"> */}
                <Link to="/register" className="btn8787" onClick={closeMenu}>
                  Salon Register
                </Link>
                <Link to="/Dealer" className="btn8787" onClick={closeMenu}>
                  Distributor Login
                </Link>
                <Link to="/LoginPage" className="btn879" onClick={closeMenu}>
                   Salon Login
                </Link>
                {/* </div> */}
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content-1 */}
      <div className="part1">
        <div className="gfd45">
          {/* <div className="posi5654"> */}
          <div className="main66">
            <h1 className="heading56">
              Take Your Salon To Next Level with{" "}
              <span className="bl90"> One Salon</span>
            </h1>
            <p className="para323">
              Elevate your salon business with One Salon, the ultimate SaaS
              solution designed to streamline operations, enhance client
              experience, and boost profitability. Whether you're managing
              appointments, optimizing inventory, or improving customer
              engagement, One Salon provides intuitive tools tailored for your
              success. Join thousands of salons worldwide who trust One Salon to
              take their business to the next level.
            </p>
          </div>
          {/* </div> */}
          <Link to="/register" className="btn-enroll88">
            Enroll Now
          </Link>
        </div>
        <img
          className="image-set-size23"
          src={manimage}
          alt="Salon promotion"
        />{" "}
      </div>

      {/* Sponsers Scrolling */}
      <div className="scrolling-container">
        <div className="scrolling-images">
          <img src={greenproduct} alt="Partners" className="sponsors90" />
          <img
            src={greentrendslogo}
            alt="greentrendslogo"
            className="sponsors90"
          />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
          <img src={lorealimg} alt="Partners" className="sponsors90" />
          <img
            src={greentrendslogo}
            alt="greentrendslogo"
            className="sponsors90"
          />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
          <img src={lorealimg} alt="Partners" className="sponsors90" />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
          <img src={greenproduct} alt="Partners" className="sponsors90" />
          <img
            src={greentrendslogo}
            alt="greentrendslogo"
            className="sponsors90"
          />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
          <img src={lorealimg} alt="Partners" className="sponsors90" />
          <img
            src={greentrendslogo}
            alt="greentrendslogo"
            className="sponsors90"
          />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
          <img src={lorealimg} alt="Partners" className="sponsors90" />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
          <img src={greenproduct} alt="Partners" className="sponsors90" />
          <img
            src={greentrendslogo}
            alt="greentrendslogo"
            className="sponsors90"
          />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
          <img src={lorealimg} alt="Partners" className="sponsors90" />
          <img
            src={greentrendslogo}
            alt="greentrendslogo"
            className="sponsors90"
          />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
          <img src={lorealimg} alt="Partners" className="sponsors90" />
          <img src={naturalsimg} alt="Partners" className="sponsors90" />
        </div>
      </div>

      {/* About Us Code */}
      <div id="about-us" className="scroll-css">
        <div className="part2">
          <h1 className="h1901">ABOUT US</h1>
          <p className="para20">
            To know,us here is our vision and mission with achievements of our
            team
          </p>
          <div className="threeimages3">
            <div
              className={`image012 ${
                selectedCard === "aboutUs"
                  ? "about-us-expanded"
                  : "about-us-shrunk"
              }`}
              onClick={() => handleCardClick("aboutUs")}
            >
              <h1 className="h1900">About Us</h1>
              <p className="para21">
                One Salon is dedicated to revolutionizing the salon industry
                through innovative technology solutions.Our mission is to
                empower salon owners with powerful tools that simplify
                operations,enhance customer experience,and drive business
                growth.At One Salon,we understand the challenges faced by salon
                professionals and aim to provide a comprehensive SaaS platform
                that streamlines appointment scheduling,optimizes inventory
                management,and facilitates seamless client communication.
              </p>
            </div>
            <div
              className={`image0122 ${
                selectedCard === "ourTeam"
                  ? "our-team-expanded"
                  : "our-team-shrunk"
              }`}
              onClick={() => handleCardClick("ourTeam")}
            >
              <h1 className="h1900">Our Team</h1>

              <p className="para212">
                One Salon is a group of dedicated professionals with expertise
                in salon management and technology. We are committed to
                delivering innovative solutions and exceptional support to help
                your salon thrive.
              </p>
            </div>
            <div
              className={`image0122 ${
                selectedCard === "achievements"
                  ? "achievements-expanded"
                  : "achievements-shrunk"
              }`}
              onClick={() => handleCardClick("achievements")}
            >
              <h1 className="h1900">Achievements</h1>
              <p className="para212">
                One Salon has revolutionized salon management with our
                cutting-edge software, empowering hundreds of salons to
                streamline operations and enhance client experiences.
              </p>

              <div className="achieve-supermother">
                <div className="achieve-mother">
                  <h1>10,000+</h1>
                  <h3>
                    Happy
                    <br className="br453" /> Customer
                  </h3>
                </div>
                <div className="achieve-mother">
                  <h1>500+</h1>
                  <h3>Salon</h3>
                </div>
                <div className="achieve-mother">
                  <h1>150+</h1>
                  <h3>Stylish</h3>
                </div>
                <div className="achieve-mother">
                  <h1>4+</h1>
                  <h3>States</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Features */}
      {/* <div className="smallbox98"> */}
      <div id="features" className="scroll-css">
        <div className="outer-container">
          <div
            className={`box-container40 ${
              isPopupActive ? "blurred-background" : ""
            }`}
          >
            <h4 className="h48">OUR FEATURES</h4>
            <p className="para20">
              Our software offers a comprehensive suite of features including
              POS Billing, CRM, Inventory Management, Service Scheduling,
              Detailed Reports, and Real-time Statistics to elevate your salon's
              efficiency and customer satisfaction.
            </p>

            <div className="small-containersgap09">
              <div className="flexsub">
                <div className="columncontainers">
                  <div className={`sub-container554 `}>
                    <h3 className="h342">POS Billing</h3>
                    <p className="para16">
                      Streamline your transactions with our intuitive POS
                      Billing system for quick and efficient payments.
                    </p>

                    <div className="container009 color10">
                      <div className="flexend3" onClick={handleTogglePOS}>
                        {isMobileViewPOS ? (
                          <LuLaptop className="bold1" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold1" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupPOS
                            ? isMobileViewPOS
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewPOS
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupPOS
                            ? isMobileViewPOS
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewPOS
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={isMobileViewPOS ? "Mobile View" : "Laptop Image"}
                      />
                      <div className="flexend3" onClick={handlePopupTogglePOS}>
                        {isPopupPOS ? (
                          <AiOutlineCompress />
                        ) : (
                          <AiOutlineExpand className="expand1" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`sub-container554`}>
                    <h3 className="h342">Service</h3>
                    <p className="para16">
                      Offer a wide range of salon services, from hairstyling to
                      massages, tailored for both men and women.
                    </p>

                    <div className="container009 color13">
                      <div className="flexend3" onClick={handleToggleService}>
                        {isMobileViewService ? (
                          <LuLaptop className="bold1" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold1" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupService
                            ? isMobileViewService
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewService
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupService
                            ? isMobileViewService
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewService
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={
                          isMobileViewService ? "Mobile View" : "Laptop Image"
                        }
                      />
                      <div
                        className="flexend3"
                        onClick={handlePopupToggleService}
                      >
                        {isPopupService ? (
                          <AiOutlineCompress />
                        ) : (
                          <AiOutlineExpand className="expand1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columncontainers downpush">
                  <div className={`sub-container554`}>
                    <h3 className="h342">CRM</h3>
                    <p className="para16">
                      Efficiently manage customer relationships with
                      appointments and communication tools.
                    </p>

                    <div className="container009 color11">
                      <div className="flexend3" onClick={handleToggleCrm}>
                        {isMobileViewCrm ? (
                          <LuLaptop className="bold1" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold1" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupCrm
                            ? isMobileViewCrm
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewCrm
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupCrm
                            ? isMobileViewCrm
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewCrm
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={isMobileViewCrm ? "Mobile View" : "Laptop Image"}
                      />
                      <div className="flexend3" onClick={handlePopupToggleCrm}>
                        {isPopupCrm ? (
                          <AiOutlineCompress />
                        ) : (
                          <AiOutlineExpand className="expand1" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`sub-container554`}>
                    <h3 className="h342">Reports</h3>
                    <p className="para16">
                      Access detailed reports on billing, services, product
                      sales, and employee performance.
                    </p>

                    <div className="container009 color14">
                      <div className="flexend3" onClick={handleToggleReport}>
                        {isMobileViewReport ? (
                          <LuLaptop className="bold1" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold1" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupReport
                            ? isMobileViewReport
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewReport
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupReport
                            ? isMobileViewReport
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewReport
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={
                          isMobileViewReport ? "Mobile View" : "Laptop Image"
                        }
                      />
                      <div
                        className="flexend3"
                        onClick={handlePopupToggleReport}
                      >
                        {isPopupReport ? (
                          <AiOutlineCompress />
                        ) : (
                          <AiOutlineExpand className="expand1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columncontainers downpush01">
                  <div className={`sub-container554`}>
                    <h3 className="h342">Inventory</h3>
                    <p className="para16">
                      Manage purchases, add new products, track self-use stock,
                      and optimize inventory efficiency.
                    </p>

                    <div className="container009 color12">
                      <div className="flexend3" onClick={handleToggleInventory}>
                        {isMobileViewInventory ? (
                          <LuLaptop className="bold1" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold1" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupInventory
                            ? isMobileViewInventory
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewInventory
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupInventory
                            ? isMobileViewInventory
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewInventory
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={
                          isMobileViewInventory ? "Mobile View" : "Laptop Image"
                        }
                      />
                      <div
                        className="flexend3"
                        onClick={handlePopupToggleInventory}
                      >
                        {isPopupInventory ? (
                          <AiOutlineCompress />
                        ) : (
                          <AiOutlineExpand className="expand1" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`sub-container554 `}>
                    <h3 className="h342">Statistic</h3>
                    <p className="para16">
                      Analyze key performance metrics,track growth trends,and
                      make informed decisions with detailed statistics.
                    </p>

                    <div className="container009 color15">
                      <div className="flexend3" onClick={handleToggleStat}>
                        {isMobileViewStat ? (
                          <LuLaptop className="bold1" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold1" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupStat
                            ? isMobileViewStat
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewStat
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupStat
                            ? isMobileViewStat
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewStat
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={isMobileViewStat ? "Mobile View" : "Laptop Image"}
                      />
                      <div className="flexend3" onClick={handlePopupToggleStat}>
                        {isPopupStat ? (
                          <AiOutlineCompress />
                        ) : (
                          <AiOutlineExpand className="expand1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isPopupActive && (
            <div className="popup-container">
              {isPopupPOS && (
                <div
                  className={`sub-container5541 ${
                    isPopupPOS ? "popup56 " : ""
                  }`}
                >
                  <div className="container0091 color10">
                    <div>
                      <h3 className="h3421">POS Billing</h3>
                      <p className="para1612">
                        Streamline your transactions with our intuitive POS
                        Billing system for quick and efficient payments.
                      </p>
                    </div>
                    <div className="fleximage21">
                      <div className="flexend311" onClick={handleTogglePOS}>
                        {isMobileViewPOS ? (
                          <LuLaptop className="bold11" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold11" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupPOS
                            ? isMobileViewPOS
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewPOS
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupPOS
                            ? isMobileViewPOS
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewPOS
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={isMobileViewPOS ? "Mobile View" : "Laptop Image"}
                      />
                      <div className="flexend31" onClick={handlePopupTogglePOS}>
                        {isPopupPOS ? (
                          <AiOutlineCompress className="compressicon" />
                        ) : (
                          <AiOutlineExpand />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isPopupService && (
                <div
                  className={`sub-container5541 ${
                    isPopupService ? "popup56 " : ""
                  }`}
                >
                  <div className="container0091 color13">
                    <div>
                      <h3 className="h3421">Service</h3>
                      <p className="para1612">
                        Offer a wide range of salon services, from hairstyling
                        to massages, tailored for both men and women.
                      </p>
                    </div>
                    <div className="fleximage21">
                      <div className="flexend311" onClick={handleToggleService}>
                        {isMobileViewService ? (
                          <LuLaptop className="bold11" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold11" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupService
                            ? isMobileViewService
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewService
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupService
                            ? isMobileViewService
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewService
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={
                          isMobileViewService ? "Mobile View" : "Laptop Image"
                        }
                      />
                      <div
                        className="flexend31"
                        onClick={handlePopupToggleService}
                      >
                        {isPopupService ? (
                          <AiOutlineCompress className="compressicon" />
                        ) : (
                          <AiOutlineExpand />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isPopupCrm && (
                <div
                  className={`sub-container5541 ${
                    isPopupCrm ? "popup56 " : ""
                  }`}
                >
                  <div className="container0091 color11">
                    <div>
                      <h3 className="h3421">CRM</h3>
                      <p className="para1612">
                        Efficiently manage customer relationships with
                        appointments and communication tools.
                      </p>
                    </div>
                    <div className="fleximage21">
                      <div className="flexend311" onClick={handleToggleCrm}>
                        {isMobileViewCrm ? (
                          <LuLaptop className="bold11" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold11" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupCrm
                            ? isMobileViewCrm
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewCrm
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupCrm
                            ? isMobileViewCrm
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewCrm
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={isMobileViewCrm ? "Mobile View" : "Laptop Image"}
                      />
                      <div className="flexend31" onClick={handlePopupToggleCrm}>
                        {isPopupCrm ? (
                          <AiOutlineCompress className="compressicon" />
                        ) : (
                          <AiOutlineExpand />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isPopupReport && (
                <div
                  className={`sub-container5541 ${
                    isPopupReport ? "popup56 " : ""
                  }`}
                >
                  <div className="container0091 color14">
                    <div>
                      <h3 className="h3421">Reports</h3>
                      <p className="para1612">
                        Access detailed reports on billing, services, product
                        sales, and employee performance.
                      </p>
                    </div>
                    <div className="fleximage21">
                      <div className="flexend311" onClick={handleToggleReport}>
                        {isMobileViewReport ? (
                          <LuLaptop className="bold11" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold11" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupReport
                            ? isMobileViewReport
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewReport
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupReport
                            ? isMobileViewReport
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewReport
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={
                          isMobileViewReport ? "Mobile View" : "Laptop Image"
                        }
                      />
                      <div
                        className="flexend31"
                        onClick={handlePopupToggleReport}
                      >
                        {isPopupReport ? (
                          <AiOutlineCompress className="compressicon" />
                        ) : (
                          <AiOutlineExpand />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isPopupInventory && (
                <div
                  className={`sub-container5541 ${
                    isPopupInventory ? "popup56 " : ""
                  }`}
                >
                  <div className="container0091 color12">
                    <div>
                      <h3 className="h3421">Inventory</h3>
                      <p className="para1612">
                        Manage purchases, add new products, track self-use
                        stock, and optimize inventory efficiency.
                      </p>
                    </div>
                    <div className="fleximage21">
                      <div
                        className="flexend311"
                        onClick={handleToggleInventory}
                      >
                        {isMobileViewInventory ? (
                          <LuLaptop className="bold11" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold11" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupInventory
                            ? isMobileViewInventory
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewInventory
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupInventory
                            ? isMobileViewInventory
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewInventory
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={
                          isMobileViewInventory ? "Mobile View" : "Laptop Image"
                        }
                      />
                      <div
                        className="flexend31"
                        onClick={handlePopupToggleInventory}
                      >
                        {isPopupInventory ? (
                          <AiOutlineCompress className="compressicon" />
                        ) : (
                          <AiOutlineExpand />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isPopupStat && (
                <div
                  className={`sub-container5541 ${
                    isPopupStat ? "popup56 " : ""
                  }`}
                >
                  <div className="container0091 color15">
                    <div>
                      <h3 className="h3421">Statistic</h3>
                      <p className="para1612">
                        Analyze key performance metrics,track growth trends,and
                        make informed decisions with detailed statistics.
                      </p>
                    </div>
                    <div className="fleximage21">
                      <div className="flexend311" onClick={handleToggleStat}>
                        {isMobileViewStat ? (
                          <LuLaptop className="bold11" />
                        ) : (
                          <PiDeviceMobileCameraThin className="bold11" />
                        )}
                      </div>
                      <img
                        className={`${
                          isPopupStat
                            ? isMobileViewStat
                              ? "fullscreenmobile-img"
                              : "fullscreenlap-img"
                            : isMobileViewStat
                            ? "mobileview2"
                            : "laptopview"
                        }`}
                        src={
                          isPopupStat
                            ? isMobileViewStat
                              ? mobileviewimage
                              : lapfullscreenimg
                            : isMobileViewStat
                            ? mobileviewimage
                            : Laptap
                        }
                        alt={isMobileViewStat ? "Mobile View" : "Laptop Image"}
                      />
                      <div
                        className="flexend31"
                        onClick={handlePopupToggleStat}
                      >
                        {isPopupStat ? (
                          <AiOutlineCompress className="compressicon" />
                        ) : (
                          <AiOutlineExpand />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Our Services */}
      <div id="services" className="scroll-css">
        <div className="container65">
          <h2 className="h1901 top90">OUR SERVICES</h2>
          <p className="para2020">
            Offering a wide range of services for both men and women, including
            haircuts, hairstyles, body massages, Thai massages, and more.
          </p>

          <div className="ourservice105">
            <div className="genderbtn65">
              <button
                className={`gender009 ${
                  activeGender === "Men" ? "active03" : ""
                }`}
                onClick={() => handleButtonClick("Men")}
              >
                Men
              </button>
              <button
                className={`gender009 ${
                  activeGender === "Women" ? "active03" : ""
                }`}
                onClick={() => handleButtonClick("Women")}
              >
                Women
              </button>
            </div>
            <div className="overflowhidden">
              {activeGender === "Women" && (
                <div className="women-mother-con">
                  <img
                    className="imagewomen"
                    src={womenimage1}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen"
                    src={womenimage2}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen"
                    src={womenimage3}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage6}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage7}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage8}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage9}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage10}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage11}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage12}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage13}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage14}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen2"
                    src={womenimage15}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen"
                    src={womenimage5}
                    alt="Womenimage"
                  />
                  <img
                    className="imagewomen"
                    src={womenimage1}
                    alt="Womenimage"
                  />
                </div>
              )}
              {activeGender === "Men" && (
                <div className="men-mother-con">
                  <img className="imagewomen" src={menimg1} alt="Menimage" />
                  <img className="imagewomen" src={menimg2} alt="Menimage" />
                  <img className="imagewomen" src={menimg3} alt="Menimage" />
                  <img className="imagewomen" src={menimg4} alt="Menimage" />
                  <img className="imagewomen" src={menimg5} alt="Menimage" />
                  <img className="imagewomen" src={menimg6} alt="Menimage" />
                  <img className="imagewomen" src={menimg7} alt="Menimage" />
                  <img className="imagewomen" src={menimg8} alt="Menimage" />
                  <img className="imagewomen" src={menimg9} alt="Menimage" />
                  <img className="imagewomen" src={menimg10} alt="Menimage" />
                  <img className="imagewomen" src={menimg11} alt="Menimage" />
                  <img className="imagewomen" src={menimg12} alt="Menimage" />
                  <img className="imagewomen" src={menimg13} alt="Menimage" />
                  <img className="imagewomen" src={menimg7} alt="Menimage" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="setupsalon67">
        <h2>Set up your business on One Salon</h2>
        <p>
          Streamline your salon operations with our comprehensive management
          tools.
        </p>
        <h3>Benefits</h3>
        <div className="checkcircle776">
          <div className="checkcircle76">
            <FaRegCircleCheck className="circlecheck" />
            <p>Multiple Admin</p>
          </div>
          <div className="checkcircle76">
            <FaRegCircleCheck className="circlecheck" />
            <p>Multiple Branch</p>
          </div>
          <div className="checkcircle76">
            <FaRegCircleCheck className="circlecheck" />
            <p>Multiple Role</p>
          </div>
        </div>
        {/* <Link to="/register" className="btn-enroll888">
          Enroll Now
        </Link> */}

        <img className="Tabmobileimg98" src={Tabmobileimg} alt="Tabmobileimg" />
      </div>
      {/* Review's */}
      <div className="slider437" id="reviews">
        <h2 className="h433"> REVIEW'S</h2>
        <p className="slider437-p">
          Hear what our happy clients have to say about their experience with
          One Salon.
        </p>
        <div className="hgf4320">
          <img
            className={`reviewimage221 ${animationClass}`}
            src={img}
            alt="Reviewimg"
          />
          <div className={`reviewsub67 ${animationClass}`}>
            <h1>
              What Our <br />
              Customers Say
            </h1>
            <div className="review-container2">
              <p className="review-text">
                <span className="doublecode"> " </span>
                {text}
              </p>
              <div className="iconflex">
                <div>
                  <p className="review-location">{name}</p>
                  <p className="review-location1">{location}</p>
                </div>
                <div className="rating8">
                  <p>{rating}</p>
                  <img src={startimg} alt="startimg" />
                </div>
              </div>
            </div>
            <div className="navigate-btns773">
              <GrPrevious className="pointer3" onClick={handlePrevious} />
              <GrNext className="pointer3" onClick={handleNext} />
            </div>
          </div>
        </div>
      </div>

      <div className="allcontainer500">
        {" "}
        {/* Frequently Asked Questions */}
        <div className="faq-section" id="faq">
          <h2 className="h433">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <div className="faq66">
                  {" "}
                  {faq.question}
                  <span className="faq-toggle">
                    {openIndex === index ? (
                      <FaChevronUp className="arrowdown" />
                    ) : (
                      <FaChevronDown className="arrowdown" />
                    )}
                  </span>
                </div>
                {openIndex === index && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Footer Code */}
        {/* <div className="footer-container454"> */}
        <div className="mainfooter112">
          <div className="ttr548">
            <h4 className="h355">One Salon</h4>
            <div className="hgf432">
              <div className="big5566">
                <div className="divide786">
                  <div className="gfhrt4556">
                    <FaMapLocationDot className="footericon887" />{" "}
                    <p className="pt67">
                      <br /> Rajarajeswari Nagar, Bengaluru, Karnataka - 560098
                    </p>
                  </div>
                  <div className="gfhrt4556">
                    <IoCall className="footericon887" />
                    <p className="pt67">+91-1234567890</p>
                  </div>
                  <div className="gfhrt4556">
                    <IoMdMail className="footericon887" />
                    <p className="pt67">support@1salon.in</p>
                  </div>
                  <div className="social-media-icons">
                    <div className="icon8">
                      <i className="fab fa-facebook-f"></i>
                      <span className="tooltipfb">Facebook</span>
                    </div>
                    <div className="icon8">
                      <i className="fa-brands fa-x-twitter"></i>
                      <span className="tooltip-x">X</span>
                    </div>
                    <div className="icon8">
                      <i className="fab fa-instagram"></i>
                      <span className="tooltip-insta">Instagram</span>
                    </div>
                    <div className="icon8">
                      <i className="fab fa-linkedin-in"></i>
                      <span className="tooltip-li">LinkedIn</span>
                    </div>
                    <div className="icon8">
                      <i className="fab fa-youtube"></i>
                      <span className="tooltip-yt">YouTube</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mob786">
                <div className="big556">
                  <h4 className="h35">Quick Links</h4>

                  <p>
                    <a className="para007" href="#about-us">
                      About Us
                    </a>
                  </p>

                  <p>
                    <a className="para007" href="#reviews">
                      Reviews
                    </a>
                  </p>
                  <p>
                    <a className="para007" href="#faq">
                      FAQ
                    </a>
                  </p>
                </div>
                <div className="big556">
                  <h4 className="h35">Legal</h4>
                  {/* Terms & Conditions */}
                  <p
                    className="para540"
                    onClick={openModal}
                    style={{
                      cursor: "pointer",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    Terms & Conditions
                  </p>

                  <TermsModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                  />

                  {/* Privacy Policy */}
                  <p
                    className="para540"
                    onClick={openPrivacyModal}
                    style={{
                      cursor: "pointer",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    Privacy Policy
                  </p>
                  <PrivacyPolicyModal
                    isOpen={isPrivacyModalOpen}
                    onRequestClose={closePrivacyModal}
                  />
                </div>
              </div>
              <div className="big556">
                <h2 className="h305">
                  Join Our <br className="br32" />
                  Newsletters
                </h2>
                <form className="forminput90">
                  <input
                    className="mailinput650"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                  <button type="submit" className="btn-submit23">
                    Subscribe
                  </button>
                </form>
                <div className="store-buttons">
                  <a
                    href="playstore_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={PlayStoreIcon}
                      alt="Play Store"
                      className="play-store-icon"
                    />
                  </a>
                  <a
                    href="applestore_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={AppleStoreIcon}
                      alt="Apple Store"
                      className="apple-store-icon"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <p className="para111">
            &copy;2024 Copyright Formonex Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;
