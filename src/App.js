import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nasaData, setNasaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState('');  // Date starts as empty
  const [maxDate, setMaxDate] = useState('');  // Max date for the picker

  // Function to set the max date to today's date
 useEffect(() => {
  const today = new Date().toISOString().split('T')[0];  // Get today's date in 'YYYY-MM-DD' format
  setMaxDate(today);  // Set the max date to today
}, []);


  const fetchData = () => {
    // Validate the date
    if (date < "1995-06-16" || date > maxDate) {
      setError(`Date must be between June 16, 1995, and ${maxDate}.`);
      return;
    }
  
    // Set loading state
    setLoading(true);
    setError(null);  // Clear previous errors
  
    // Fetch data from the backend
    fetch(`http://localhost:5000/api/nasa?date=${date}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from NASA');
        }
        return response.json();
      })
      .then((data) => {
        setNasaData(data);  // Store fetched data
        setLoading(false);  // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');  // Show error message
        setLoading(false);  // Stop loading
      });
  };
  

  return (
    <div>
  <h1>{nasaData ? nasaData.title : 'NASA APOD'}</h1>

  {loading && <p>Loading data, please wait...</p>}  {/* Show loading message */}

  {nasaData && (
    <>
      <img src={nasaData.url} alt={nasaData.title} />
      <p>{nasaData.explanation}</p>
    </>
  )}

  {/* Date Input and Button */}
  <div>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
    <button onClick={fetchData}>Fetch Data for Date</button>
  </div>

  {/* Error Message */}
  {error && <p style={{ color: 'red' }}>{error}</p>}
</div>

  );
  
}

export default App;
