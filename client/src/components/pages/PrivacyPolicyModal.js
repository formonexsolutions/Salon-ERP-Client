import React from "react";
import Modal from "react-modal";
import "../styles/PrivacyPolicyModal.css"; 

const PrivacyPolicyModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Privacy Policy"
      className="modal-content181"
      overlayClassName="modal-overlay12"
    >
      <h2 className="headingh1">Privacy Policy</h2>
      
      <div className="privacy-policy-content">
        <p>
          Formonex Solutions built the One Salon the website https://1salon.in to provide better information of
          our product. This SERVICE is provided by Formonex Solutions and is
          intended for use as is.
        </p>

        <p>
          This page is used to inform visitors regarding our policies with the
          collection, use, and disclosure of Personal Information if anyone
          decided to use our Service.
        </p>

        <p>
          If you choose to use our Service, then you agree to the collection and
          use of information in relation to this policy. The Personal
          Information that we collect is used for providing and improving the
          Service. We will not use or share your information with anyone except
          as described in this Privacy Policy.
        </p>

        <p>
          The terms used in this Privacy Policy have the same meanings as in our
          Terms and Conditions, which is accessible at One Salon.com unless
          otherwise defined in this Privacy Policy.
        </p>

        <p>
          <span className="font-weight600">Information Collection and Use &nbsp;:</span> For a better experience, while using
          our Service, we may require you to provide us with certain personally
          identifiable information. The information that we request will be
          retained by us and used as described in this privacy policy.
        </p>

        <p>
          The website does use third party services that may collect
          information used to identify you.
        </p>

        <p>
        <span className="font-weight600">Log Data &nbsp;:</span> We want to inform you that whenever you use our Service, in
          a case of any error on the or website we collect data and
          information (through third party products) called Log Data. This Log
          Data may include information such as your device Internet Protocol
          (“IP”) address, device name, operating system version, the
          configuration of the software when utilizing our Service, the time and date
          of your use of the Service, and other statistics.
        </p>

        <p>
        <span className="font-weight600">Cookies&nbsp; :</span> This Service does not use these “cookies” explicitly.
          However, the website may use third party code and libraries
          that use “cookies” to collect information and improve their services.
          You have the option to either accept or refuse these cookies and know
          when a cookie is being sent to your device. If you choose to refuse
          our cookies, you may not be able to use some portions of this Service.
        </p>

        <p>
        <span className="font-weight600">Service Providers &nbsp;:</span> We may employ third-party companies and individuals
          due to the following reasons:
        </p>
        <ul>
          <li>To facilitate our Service;</li>
          <li>To provide the Service on our behalf;</li>
          <li>To perform Service-related services; or</li>
          <li>To assist us in analyzing how our Service is used.</li>
        </ul>
        <p>
          We want to inform users of this Service that these third parties have
          access to your Personal Information. The reason is to perform the
          tasks assigned to them on our behalf. However, they are obligated not
          to disclose or use the information for any other purpose.
        </p>

        <p>
        <span className="font-weight600">Security &nbsp;:</span> We value your trust in providing us with your Personal
          Information, thus we are striving to use commercially acceptable means
          of protecting it. But remember that no method of transmission over the
          Internet, or method of electronic storage is 100% secure and reliable,
          and we cannot guarantee its absolute security.
        </p>

        <p>
        <span className="font-weight600">Links to Other Sites &nbsp;:</span> This Service may contain links to other sites.
          If you click on a third-party link, you will be directed to that site.
          Note that these external sites are not operated by us. Therefore, we
          strongly advise you to review the Privacy Policy of these websites. We
          have no control over and assume no responsibility for the content,
          privacy policies, or practices of any third-party sites or services.
        </p>

        <p>
        <span className="font-weight600">Children’s Privacy &nbsp;:</span> These Services do not address anyone under the age
          of 13. We do not knowingly collect personally identifiable information
          from children under 13. In the case we discover that a child under 13
          has provided us with personal information, we immediately delete this
          from our servers. If you are a parent or guardian and you are aware
          that your child has provided us with personal information, please
          contact us so that we will be able to do the necessary actions.
        </p>

        <p>
        <span className="font-weight600">Changes to This Privacy Policy &nbsp;:</span> We may update our Privacy Policy from
          time to time. Thus, you are advised to review this page periodically
          for any changes. We will notify you of any changes by posting the new
          Privacy Policy on this page. These changes are effective immediately
          after they are posted on this page.
        </p>

        <p>
        <span className="font-weight600">Contact Us &nbsp;:</span> If you have any questions or suggestions about our Privacy
          Policy, do not hesitate to contact us through email at
          support@1salon.in.
        </p>
      </div>
      
      <div className="closebtn">
        <button className="close12" onClick={onRequestClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default PrivacyPolicyModal;