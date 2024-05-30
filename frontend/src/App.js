// Importing necessary dependencies and components for the App
import React, { useState, useEffect, useRef } from 'react';
import CustomSelect from './CustomSelect';
import './App.css';
import { FaEdit } from 'react-icons/fa';
import { FaTrashCan, FaRegTrashCan } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { CiUser, CiStickyNote, CiCircleCheck } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";
import { CiCalendar } from "react-icons/ci";
import Datetime from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';

// Main function component for the App
function App() {
  // State hooks for managing form data, errors, saved data, comments, and more
  const [formData, setFormData] = useState({
    name: '',
    dateTimeRange: '',
    candidate: { name: '', profilePicture: '' },
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [savedData, setSavedData] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState('');
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const endDateRef = useRef(null);

  // Effect hook to load saved data from local storage on component mount
  useEffect(() => {
    const data = localStorage.getItem('formData');
    if (data) {
      setSavedData(JSON.parse(data));
    }
  }, []);

  // Event handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Event handler for candidate selection changes
  const handleCandidateChange = (candidate) => {
    setFormData({
      ...formData,
      candidate: candidate || { name: '', profilePicture: '' }
    });
  };

  // Function to validate form fields
  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Task is required";
    if (!formData.dateTimeRange) tempErrors.dateTimeRange = "Date and time range is required";
    if (!formData.candidate || !formData.candidate.name) tempErrors.candidate = "Candidate selection is required";
    if (!formData.note) tempErrors.note = "Note is required";
    return tempErrors;
  };

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      localStorage.setItem('formData', JSON.stringify(formData));
      setSavedData(formData);
      alert('Data saved to local storage!');
    }
  };

  // Event handler to clear form data
  const handleClear = () => {
    setFormData({
      name: '',
      dateTimeRange: '',
      candidate: { name: '', profilePicture: '' },
      note: ''
    });
    setErrors({});
    setComments([]);
  };

  // Event handler to delete saved data from local storage
  const handleDelete = () => {
    localStorage.removeItem('formData');
    setSavedData(null);
    setFormData({
      name: '',
      dateTimeRange: '',
      candidate: { name: '', profilePicture: '' },
      note: ''
    });
    setErrors({});
    setComments([]);
    alert('Data deleted from local storage!');
  };

  // Event handler to add a new comment
  const handleAddComment = () => {
    if (currentComment.trim() && formData.candidate.name) {
      const newComment = {
        text: currentComment,
        candidate: formData.candidate,
      };
      setComments([...comments, newComment]);
      setCurrentComment('');
    }
  };

  // Event handler to initiate editing of a comment
  const handleEditComment = (index) => {
    if (comments[index].candidate.name === formData.candidate.name) {
      setCurrentComment(comments[index].text);
      setEditingCommentIndex(index);
    } else {
      alert('You can only edit your own comments.');
    }
  };

  // Event handler to update a comment
  const handleUpdateComment = () => {
    if (currentComment.trim() && editingCommentIndex !== null) {
      const updatedComments = [...comments];
      updatedComments[editingCommentIndex].text = currentComment;
      setComments(updatedComments);
      setCurrentComment('');
      setEditingCommentIndex(null);
    }
  };

  // Event handler to delete a comment
  const handleDeleteComment = (index) => {
    if (comments[index].candidate.name === formData.candidate.name) {
      const updatedComments = comments.filter((_, i) => i !== index);
      setComments(updatedComments);
    } else {
      alert('You can only delete your own comments.');
    }
  };

  // Event handler for start date change in date-time picker
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate) {
      updateDateTimeRange(date, endDate);
    }
  };

  // Event handler for end date change in date-time picker
  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate) {
      updateDateTimeRange(startDate, date);
    }
  };

  // Function to update the date-time range in the form data
  const updateDateTimeRange = (start, end) => {
    const startDateTime = moment(start).format('MMM D, YYYY [at] h:mm A');
    const endDateTime = moment(end).format('h:mm A');
    setFormData({
      ...formData,
      dateTimeRange: `${startDateTime} - ${endDateTime}`
    });
    setShowDateTimePicker(false);
  };

  // Function to toggle visibility of the date-time picker
  const toggleDateTimePicker = () => {
    setShowDateTimePicker(!showDateTimePicker);
  };

  // Event handler for end date blur event in date-time picker
  const handleEndDateBlur = () => {
    if (startDate && endDate) {
      updateDateTimeRange(startDate, endDate);
    }
  };


// Render the main application component including form inputs, icons, comments section, and actions.
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit} >
          <div className="icon-container">
            <div className="left-icon">
              <button type="submit">
                <CiCircleCheck size={30} style={{ marginLeft: '5px' }} />
              </button>
            </div>
            <div className="right-icon">
              <button type="button" onClick={handleDelete}>
                <FaTrashCan size={18} style={{ marginLeft: '5px' }} />
              </button>
              <button type="button" onClick={handleClear}>
                <IoClose size={20} style={{ marginLeft: '5px' }} />
              </button>
            </div>
          </div>
          <div className='task'>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Give Task"
              className='input1'
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="date-input-container">
            <input
              type="text"
              name="dateTimeRange"
              value={formData.dateTimeRange}
              onClick={toggleDateTimePicker}
              readOnly
              className='input2'
              placeholder="Select Date and Time"
            />
            <CiCalendar  className="calendar-icon" onClick={toggleDateTimePicker} />
            {errors.dateTimeRange && <span className="error">{errors.dateTimeRange}</span>}
            {showDateTimePicker && (
              <div className="datetime-picker">
                <div>
                  <label>Select Start Time:</label>
                  <Datetime
                    value={startDate}
                    onChange={handleStartDateChange}
                    input={false}
                    open={true}
                    closeOnSelect={false}
                  />
                </div>
                <div>
                  <label>Select End Time:</label>
                  <Datetime
                    value={endDate}
                    onChange={handleEndDateChange}
                    input={false}
                    open={true}
                    closeOnSelect={false}
                    dateFormat={false} // Only show time picker
                    timeConstraints={{ minutes: { step: 15 } }} // Adjust as necessary
                    onBlur={handleEndDateBlur}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="user">
            <CiUser size={"25px"} />
            <label className='label1'>Assign to:</label>
            <CustomSelect
              value={formData.candidate}
              onChange={handleCandidateChange}
            />
            {errors.candidate && <span className="error">{errors.candidate}</span>}
          </div>
          <div>
            <div className='note'>
              <CiStickyNote size={"25px"} />
              <label className='label2'>Note:</label>
              <textarea
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className='note1'
              />
               {errors.note && <span className="error">{errors.note}</span>}
            </div>
          </div>
          <hr/>
          <div className="comments-section">
            <h2>Comments</h2>
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                {comment.candidate.profilePicture && (
                  <img src={comment.candidate.profilePicture} alt="Profile" className="comment-profile" />
                )}
                <div>
                  <p><strong>{comment.candidate.name}</strong> {comment.text}</p>
                </div>
                {comment.candidate.name === formData.candidate.name && (
                  <div className="comment-actions">
                    <button type="button" onClick={() => handleEditComment(index)} className="editicon">
                      <FaEdit size={15}/>
                    </button>
                    <button type="button" onClick={() => handleDeleteComment(index)} className="deleteicon">
                      <FaRegTrashCan size={15}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="add-comment">
              {formData.candidate.profilePicture && (
                <img src={formData.candidate.profilePicture} alt="Profile" className="comment-profile" />
              )}
              <div className="comment-box-container">
                <input
                  type="text"
                  value={currentComment}
                  onChange={(e) => setCurrentComment(e.target.value)}
                  placeholder="Write comment..."
                  className='comment-box'
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                />
                {editingCommentIndex !== null ? (
                  <button type="button" onClick={handleUpdateComment} className="send-icon">
                    <VscSend size={20}/>
                  </button>
                ) : (
                  <button type="button" onClick={handleAddComment} className="send-icon">
                    <VscSend size={20}/>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </header>
    </div>
  );
}

export default App;

