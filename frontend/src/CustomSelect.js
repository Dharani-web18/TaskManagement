// Define a custom select component for choosing candidates with their profile pictures.
import React from 'react';

// Import candidate profile images
import JanesmithImage from './assets/jane.jpg'; 
import PreethaImage from './assets/preetha.jpg'; 
import DharaniImage from './assets/dharani.jpg'; 
import SivaImage from './assets/siva.jpg';
import GunaImage from './assets/guna.jpg';
import KrishImage from './assets/krish.jpg'; 
import SonuImage from './assets/sonu.jpg'; 

// Define an array of candidate objects with their names and profile pictures
const candidates = [
  { name: 'Jane Smith', profilePicture: JanesmithImage },
  { name: 'Preetha', profilePicture: PreethaImage },
  { name: 'Dharani', profilePicture: DharaniImage },
  { name: 'Siva', profilePicture: SivaImage },
  { name: 'Guna', profilePicture: GunaImage },
  { name: 'Krish', profilePicture: KrishImage },
  { name: 'Sonu', profilePicture: SonuImage },
];

// Define the CustomSelect component
function CustomSelect({ value = {}, onChange }) {
  const handleChange = (e) => {
    const selectedCandidate = candidates.find(candidate => candidate.name === e.target.value);
    onChange(selectedCandidate);
  };

  // Render the custom select component
  return (
    <div className="custom-select">
      <select value={value.name || ''} onChange={handleChange}>
        <option value="">Select Person</option>
        {candidates.map(candidate => (
          <option key={candidate.name} value={candidate.name}>
            {candidate.name}
          </option>
        ))}
      </select>
      {value.profilePicture && (
        <img src={value.profilePicture} alt="Profile" className="dropdown-profile-picture" />
      )}
    </div>
  );
}

// Export the CustomSelect component as default
export default CustomSelect;
