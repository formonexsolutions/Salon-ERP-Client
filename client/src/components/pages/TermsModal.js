import React from "react";
import Modal from "react-modal";
import "../styles/TermsModal.css";

const TermsModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Terms and Conditions"
      className="modal-content18"
      overlayClassName="modal-overlay01"
    >
      <h2 className="modal-title18">Terms & Conditions</h2>
      <div className="modal-body01">
        <p>
          These terms and conditions outline the rules and regulations for the
          use of Formonex Solutions Website, located at
          https://1salon.in & One Salon Business.
        </p>

     

        <h3 className="font-weight6000">For Website :</h3>
        <p>
          These terms and conditions outline the rules and regulations for the
          use of Formonex Solutions Website, located at
          https://1salon.in
        </p>
        <p>
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use One Salon if you do not agree to
          take all of the terms and conditions stated on this page.
        </p>
        <p>
          The following terminology applies to these Terms and Conditions,
          Privacy Statement and Disclaimer Notice and all Agreements: “Client”,
          “You” and “Your” refers to you, the person logging on this website and
          compliant to the Company’s terms and conditions. “The Company”,
          “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”,
          “Parties”, or “Us”, refers to both the Client and ourselves. All terms
          refer to the offer, acceptance and consideration of payment necessary
          to undertake the process of our assistance to the Client in the most
          appropriate manner for the express purpose of meeting the Client’s
          needs in respect of provision of the Company’s stated services, in
          accordance with and subject to, prevailing law of India. Any use of
          the above terminology or other words in the singular, plural,
          capitalization and/or he/she or they, are taken as interchangeable and
          therefore as referring to same.
        </p>

        <h3 className="font-weight6000">Cookies :</h3>
        <p>
          We employ the use of cookies. By accessing One Salon, you agreed to
          use cookies in agreement with Formonex Solutions Privacy
          Policy.
        </p>
        <p>
          Most interactive websites use cookies to let us retrieve the user’s
          details for each visit. Cookies are used by our website to enable the
          functionality of certain areas to make it easier for people visiting
          our website. Some of our affiliate/advertising partners may also use
          cookies.
        </p>

        <h3 className="font-weight6000">License :</h3>
        <p>
          Unless otherwise stated, Formonex Solutions and/or its
          licensors own the intellectual property rights for all material on One
          Salon. All intellectual property rights are reserved. You may access
          this from One Salon for your own personal use subjected to
          restrictions set in these terms and conditions.
        </p>
        <p>You must not :</p>
        <ul>
          <li>Republish material from One Salon</li>
          <li>Sell, rent or sub-license material from One Salon</li>
          <li>Reproduce, duplicate or copy material from One Salon</li>
          <li>Redistribute content from One Salon</li>
        </ul>
        <p>This Agreement shall begin on the date hereof.</p>
        <p>
          Parts of this website offer an opportunity for users to post and
          exchange opinions and information in certain areas of the website.
          Formonex Solutions does not filter, edit, publish or review
          Comments prior to their presence on the website. Comments do not
          reflect the views and opinions of Formonex Solutions, its
          agents and/or affiliates. Comments reflect the views and opinions of
          the person who post their views and opinions. To the extent permitted
          by applicable laws, Formonex Solutions shall not be liable
          for the Comments or for any liability, damages or expenses caused
          and/or suffered as a result of any use of and/or posting of and/or
          appearance of the Comments on this website.
        </p>
        <p>
          Formonex Solutions reserves the right to monitor all
          Comments and to remove any Comments which can be considered
          inappropriate, offensive or causes a breach of these Terms and
          Conditions.
        </p>

        <h3 className="font-weight6000">You warrant and represent that :</h3>
        <ul>
          <li>
            You are entitled to post the Comments on our website and have all
            necessary licenses and consents to do so;
          </li>
          <li>
            The Comments do not invade any intellectual property right,
            including without limitation copyright, patent or trademark of any
            third party;
          </li>
          <li>
            The Comments do not contain any defamatory, libelous, offensive,
            indecent or otherwise unlawful material which is an invasion of
            privacy;
          </li>
          <li>
            The Comments will not be used to solicit or promote business or
            custom or present commercial activities or unlawful activity;
          </li>
        </ul>
        <p>
          You hereby grant Formonex Solutions a non-exclusive license
          to use, reproduce, edit and authorize others to use, reproduce and
          edit any of your Comments in any and all forms, formats or media.
        </p>

        <h3 className="font-weight6000">Hyperlinking to our Content :</h3>
        <p>
          The following organizations may link to our Website without prior
          written approval:
        </p>
        <ul>
          <li>Government agencies;</li>
          <li>Search engines;</li>
          <li>News organizations;</li>
          <li>
            Online directory distributors may link to our Website in the same
            manner as they hyperlink to the Websites of other listed businesses;
            and
          </li>
          <li>
            System wide Accredited Businesses except soliciting non-profit
            organizations, charity shopping malls, and charity fundraising
            groups which may not hyperlink to our Web site.
          </li>
        </ul>
        <p>
          These organizations may link to our home page, to publications or to
          other Website information so long as the link: (a) is not in any way
          deceptive; (b) does not falsely imply sponsorship, endorsement or
          approval of the linking party and its products and/or services; and
          (c) fits within the context of the linking party’s site.
        </p>
        <p>
          We may consider and approve other link requests from the following
          types of organizations:
        </p>
        <ul>
          <li>commonly-known consumer</li>
        </ul>
      </div>
      <div className="closebtn">
        <button className="close-btn84" onClick={onRequestClose}>Close</button>
      </div>
    </Modal>
  );
};

export default TermsModal;
