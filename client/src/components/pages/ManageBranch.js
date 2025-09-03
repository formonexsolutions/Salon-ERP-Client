import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Helper/helper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/ManageSalon.css";

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedBranch, setEditedBranch] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const salon_id = localStorage.getItem('salon_id');

  const itemsPerPage = 5;

  const loggedInUser = localStorage.getItem('adminName') || localStorage.getItem('employeeName');

    useEffect(() => {
      const fetchBranches = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/branches?salon_id=${salon_id}`);
          setBranches(response.data);
          setFilteredBranches(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching branches:', error);
          setError('Failed to fetch branches');
          setLoading(false);
        }
      };
    
      if (salon_id) {
        fetchBranches();
      } else {
        setError('Salon ID not found in local storage');
        setLoading(false);
      }
    }, [salon_id]);
    

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBranches(branches);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filteredData = branches.filter(branch =>
        branch.branchName.toLowerCase().includes(lowercasedTerm) ||
        branch.city.toLowerCase().includes(lowercasedTerm) ||
        branch.state.toLowerCase().includes(lowercasedTerm) ||
        branch.area.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredBranches(filteredData);
    }
    setCurrentPage(1); // Reset to the first page on search
  }, [searchTerm, branches]);

  const togglePopup = (branch) => {
    const confirmToastId = toast(
      <div>
        <p>Are you sure you want to edit this branch?</p>
        <button
          className="confirm-btn confirm-yes"
          onClick={() => {
            handleConfirmEdit(confirmToastId, branch);
          }}
        >
          Yes
        </button>
        <button
          className="confirm-btn confirm-no"
          onClick={() => {
            handleCancelEdit(confirmToastId);
          }}
        >
          No
        </button>
      </div>,
      {
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      }
    );
  };
  
  const handleConfirmEdit = (toastId, branch) => {
    toast.dismiss(toastId);
    
    setShowPopup(true);
    setEditedBranch(branch);
  };
  
  const handleCancelEdit = (toastId) => {
    toast.dismiss(toastId);
    toast.info("Edit cancelled!");
  };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditBranch = async () => {
    try {
      const allowedUpdates = ['branchName', 'city', 'state', 'area', 'address', 'startTime', 'endTime', 'status'];
      const updatedBranch = {};
      allowedUpdates.forEach(field => {
        if (editedBranch[field] !== undefined) {
          updatedBranch[field] = editedBranch[field];
        }
      });
  
      // Add modifiedBy to the update request
      updatedBranch.modifiedBy = loggedInUser; // Use the logged-in user's name
  
      const response = await axios.put(`${BASE_URL}/api/branches/${editedBranch._id}`, updatedBranch);
      const updatedBranchData = response.data;
      setBranches(prevBranches =>
        prevBranches.map(item => (item._id === updatedBranchData._id ? updatedBranchData : item))
      );
      setFilteredBranches(prevBranches =>
        prevBranches.map(item => (item._id === updatedBranchData._id ? updatedBranchData : item))
      );
      setShowPopup(false);
      toast.success('Branch updated successfully!', { autoClose: 5000 });
    } catch (error) {
      console.error('Error updating branch:', error);
      toast.error('Failed to update branch', { autoClose: 5000 });
    }
  };  
  

  const handleActivateDeactivate = async (branch) => {
    try {
      const confirmToastId = toast(
        <div>
          <p>Are you sure you want to {branch.status === 'AA' ? 'deactivate' : 'activate'} this branch?</p>
          <button
            className="confirm-btn confirm-yes"
            onClick={() => {
              handleConfirmActivateDeactivate(confirmToastId, branch);
            }}
          >
            Yes
          </button>
          <button
            className="confirm-btn confirm-no"
            onClick={() => {
              handleCancelActivateDeactivate(confirmToastId);
            }}
          >
            No
          </button>
        </div>,
        {
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      console.error('Error displaying confirmation toast:', error);
      toast.error(`Error displaying confirmation: ${error.message}`);
    }
  };
  
  const handleConfirmActivateDeactivate = async (toastId, branch) => {
    try {
      let updatedStatus = branch.status === 'AA' ? 'IA' : 'AA'; // Toggle status
  
      // Add statusBy to the update request
      const response = await axios.put(`${BASE_URL}/api/branches/${branch._id}/status`, {
        status: updatedStatus,
        statusBy: loggedInUser // Use the logged-in user's name
      });
  
      const updatedBranchData = response.data;
      setBranches(prevBranches =>
        prevBranches.map(item => (item._id === updatedBranchData._id ? updatedBranchData : item))
      );
      setFilteredBranches(prevBranches =>
        prevBranches.map(item => (item._id === updatedBranchData._id ? updatedBranchData : item))
      );
  
      toast.success(`Branch ${updatedStatus === 'AA' ? 'activated' : 'deactivated'} successfully!`, { autoClose: 5000 });
    } catch (error) {
      console.error('Error updating branch status:', error);
      toast.error('Failed to update branch status', { autoClose: 5000 });
    }finally {
      toast.dismiss(toastId); // Dismiss the toast after handling the confirmation
    }
  };
  
  const handleCancelActivateDeactivate = (toastId) => {
    toast.dismiss(toastId);
    toast.info('Status update canceled!');
  };
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBranches = filteredBranches.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  const handlePreviousPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLastPageClick = () => {
    setCurrentPage(totalPages);
  };

  const getDisplayedPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error_lkjh123">{error}</div>;
  }

  return (
    <div >
      <ToastContainer />
      <div className="customer-container112">
        <h6 className="edit-customer-heading1123"> Manage Branch</h6>
         <div className="A7serin12">
        <label className="show11"> Search</label>
        <input
          type="search"
          className="border-change890vh"
          placeholder="Branch/City/State/Area"
          onChange={handleSearch}
        />
        
      <div className="tble-overflow12">
      <table className='customer-table11'>
        <thead className="thead87">
          <tr>
            <th className="customer-table11-th">Branch ID</th>
            <th className="customer-table11-th">Branch Name</th>
            <th className="customer-table11-th">City</th>
            <th className="customer-table11-th">State</th>
            <th className="customer-table11-th">Area</th>
            <th className="customer-table11-th">Status</th>
            <th className="customer-table11-th">Status By</th>
            <th className="customer-table11-th">Action</th>
            <th className="customer-table11-th">Action By</th>
          </tr>
        </thead>
        <tbody className="thead87">
          {currentBranches.map(branch => (
            <tr key={branch._id} className="tr32">
              <td className="customer-table11-td1">{branch.branch_id}</td>
              <td className="customer-table11-td">{branch.branchName}</td>
              <td className="customer-table11-td">{branch.city}</td>
              <td className="customer-table11-td">{branch.state}</td>
              <td className="customer-table11-td">{branch.area}</td>
              <td className="customer-table11-td1">
                <button
                  className={`buttonrety5678 ${branch.status === 'AA' ? 'deactivate' : 'activate'}`}
                  onClick={() => handleActivateDeactivate(branch)}
                >
                  {branch.status === 'AA' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
              <td className="customer-table11-td1">{branch.statusBy}</td>
              <td className="customer-table11-td1">
                <button className="butt_edit_emloy" onClick={() => togglePopup(branch)}>Edit</button>
              </td>
              <td className="customer-table11-td1">{branch.modifiedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

        <div className="entries-div12">
        <div className="flex163">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBranches.length)} of {filteredBranches.length} Entries
        </div>
        <div className="flex163">
          <button className="badges05" onClick={handleFirstPageClick}>
            First
          </button>
          <button className="badges05" onClick={handlePreviousPageClick}>
            Previous
          </button>
          {getDisplayedPages().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`badges05 ${pageNumber === currentPage ? 'AA' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button className="badges05" onClick={handleNextPageClick}>
            Next
          </button>
          <button className="badges05" onClick={handleLastPageClick}>
            Last
          </button>
        </div>
      </div>
      </div>
      {showPopup && (
        <div className="popup-container_siv909">
          <div className="popup_asd8709">
            <h2>Edit Branch</h2>
            <label>
              Branch Name:
              <input
                type="text"
                value={editedBranch.branchName || ''}
                onChange={(e) => setEditedBranch({ ...editedBranch, branchName: e.target.value })}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                value={editedBranch.city || ''}
                onChange={(e) => setEditedBranch({ ...editedBranch, city: e.target.value })}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                value={editedBranch.state || ''}
                onChange={(e) => setEditedBranch({ ...editedBranch, state: e.target.value })}
              />
            </label>
            <label>
              Area:
              <input
                type="text"
                value={editedBranch.area || ''}
                onChange={(e) => setEditedBranch({ ...editedBranch, area: e.target.value })}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={editedBranch.address || ''}
                onChange={(e) => setEditedBranch({ ...editedBranch, address: e.target.value })}
              />
            </label>
            <div className="buttonContainermnop">
            <button onClick={handleEditBranch} className="saveButtonmnop">Save</button>
            <button onClick={() => setShowPopup(false)} className="cancelButtonmnop">Cancel</button>
            </div>
          </div>
        
        </div>
      )}
      </div>
      </div>
  );
};

export default BranchList;
