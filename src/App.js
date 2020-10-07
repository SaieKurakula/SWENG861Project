import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [headerText, setHeaderText] = useState('');
  const [artist, setArtist] = useState('');
  const [artistInfo, setArtistInfo] = useState('');
  const [song, setSong] = useState('');
  const [songInfo, setSongInfo] = useState('');
  const [artistSongInfo, setArtistSongInfo] = useState('');
  const [errorInfo, setErrorInfo] = useState('');

  // Process Data for mapping
  var handleData = (data, keys) => {
    var modifiedData = [];
    var i = 0;
    while (i < keys.length) {
      modifiedData[keys[i]] = data[keys[i]];
      i++;
    }
    return modifiedData
  }

  // I'm not sure why this works, but it does. Don't Delete
  var spinner = document.getElementById("spinner");
  var errorAlert = document.getElementById("errorAlert");

  // Just in case, load spinner and error alert after DOM loaded
  useEffect(() => {
    spinner = document.getElementById("spinner");
    errorAlert = document.getElementById("errorAlert");
  }, []);

  // Show spinner
  var showSpinner = () => {
    spinner.className = "show";
    setTimeout(() => {
      spinner.className = spinner.className.replace("show", "");
    }, 5000);
  }

  // Hide Spinner
  var hideSpinner = () => {
    spinner.className = spinner.className.replace("show", "");
  }

  // Clear all info
  var clearAllInfo = () => {
    setArtistSongInfo('');
    setArtistInfo('');
    setSongInfo('');
  }

  // Hide Error Alert Div
  var hideErrorAlert = () => {
    errorAlert.className = errorAlert.className.replace("show", "");
  }

  // Show Alert Box and display error
  var handleErrors = (errorText) => {
    hideSpinner();
    clearAllInfo();
    errorAlert.className = "show";
    setErrorInfo('Error: ' + errorText);
  }

  // Catch http errors from fetch()
  var fetchErrors = (response) => {
    if (!response.ok) {
        handleErrors(response.status + response.statusText);
    }
    return response.json();
  }

  // Handle form submission and API Calls
  var mySubmitHandler = (event) => {
    hideErrorAlert();
    showSpinner();
    event.preventDefault();

    if ({artist}.artist !== '' && {song}.song !== '') {
      fetch('/artistsong?artist='+{artist}.artist +'&song='+{song}.song)
        .then(fetchErrors)
        .then(data => {
          var keys = Object.getOwnPropertyNames(data);
          if (keys[0] !== "error") {
            var artistSongDisplay = handleData(data, keys);
            hideSpinner();
            clearAllInfo();
            setArtistSongInfo(artistSongDisplay);
            setHeaderText('Artist & Song Information');
          }
          else {
            handleErrors(data[keys[0]]);
          }
        })
        .catch((error) => {
          handleErrors(error);
        });
    }
    else if ({artist}.artist !== '' && {song}.song === '') {
      fetch('/artist?artist=' + {artist}.artist)
        .then(fetchErrors)
        .then(data => {
          var keys = Object.getOwnPropertyNames(data);
          if (keys[0] !== "error") {
            var artistDisplay = handleData(data, keys);
            hideSpinner();
            clearAllInfo();
            setArtistInfo(artistDisplay);
            setHeaderText('Artist Information');
          }
          else {
            handleErrors(data[keys[0]]);
          }
        })
        .catch((error) => {
          handleErrors(error);
        });
    }
    else if ({artist}.artist === '' && {song}.song !== '') {
      fetch('/song?song=' + {song}.song)
        .then(fetchErrors)
        .then(data => {
          var keys = Object.getOwnPropertyNames(data);
          if (keys[0] !== "error") {
            var tracksDisplay = handleData(data, keys);
            hideSpinner();
            clearAllInfo();
            setSongInfo(tracksDisplay);
            setHeaderText('Song(s) Information');
          }
          else {
            handleErrors(data[keys[0]]);
          }
        })
        .catch((error) => {
          handleErrors(error);
        });
    }
    else {
      handleErrors("Please Enter an artist, a song, or both.");
    }
  }

  // Handle user input in the form
  var myChangeHandler = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    if (name==='artist') {
      setArtist(val);
    }
    else if (name === 'song') {
      setSong(val);
    }
  }

  // Get Song by artist from song search buttons
  const getArtistFromSongSearch = (artistName) => e =>  {
    hideErrorAlert();
    showSpinner();
    e.preventDefault();
    fetch('/artist?artist=' + artistName)
      .then(fetchErrors)
      .then(data => {
        var keys = Object.getOwnPropertyNames(data);
        if (keys[0] !== "error") {
          var artistFromSongList = handleData(data, keys);
          hideSpinner();
          clearAllInfo();
          setArtistInfo(artistFromSongList);
          setHeaderText('Artist Information');
        }
        else {
          handleErrors(data[keys[0]]);
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  }

  // Get Artist from song search button
  const getArtistSongFullInfo = (artistName, songName) => e =>  {
    hideErrorAlert();
    showSpinner();
    e.preventDefault();
    fetch('/artistsong?artist='+artistName +'&song='+songName)
      .then(fetchErrors)
      .then(data => {
        var keys = Object.getOwnPropertyNames(data);
        if (keys[0] !== "error") {
          var artistSongFromSongList = handleData(data, keys);
          hideSpinner();
          clearAllInfo();
          setArtistSongInfo(artistSongFromSongList);
          setHeaderText('Artist & Song Information');
        }
        else {
          handleErrors(data[keys[0]]);
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  }

  // Map buttons from song search
  const ArtistSongMap = ({ data }) =>
    Object.entries(data).map(([k, v]) => (
      <div key={k+v} className="text-center margin-top-2">
        <h3>{k}: {v}</h3>
        <button type="button" className="btn btn-primary" onClick={getArtistSongFullInfo(k,v)}>Info on {v} by {k}</button><br /><br />
        <button type="button" className="btn btn-secondary" onClick={getArtistFromSongSearch(k)}>Info on {k}</button>
      </div>
  ));

  // Map info tables
  const InfoMap = ({ data }) =>
    Object.entries(data).map(([k, v]) => (
      <tr key={k}>
        <td className="col-2">{k}</td>
        <td className="col-4">{v}</td>
      </tr>
  ));

  return (

    <div className="App">
       <link
         rel="stylesheet"
         href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
         integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
         crossOrigin="anonymous"
       />
      <div className="container text-center">
        <div className="center text-center margin-top-5">
          <form onSubmit={mySubmitHandler}>
            <p>Enter Singer/Artist:</p>
            <input name='artist' onChange={myChangeHandler} type="text" />
            <p>And/Or Song Title:</p>
            <input name='song' onChange={myChangeHandler} type="text" /><br /><br />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="top-margin-5" id="spinner"></div>
        <div className="row">
          <h2 className="row margin-auto"><u>{headerText}</u></h2>
        </div>
        <div id="errorAlert">
          <div className="row">
            <h2 className="margin-auto">{errorInfo}</h2>
          </div>
        </div>
        <div>
	  <div>
            <table className="table ">
              <tbody>
	        <InfoMap data ={artistInfo} />
              </tbody>
            </table>
          </div>
	  <div>
            <div>
              <ArtistSongMap data={songInfo} />
	    </div>
          </div>
	  <div>
            <table className="table ">
              <tbody>
                <InfoMap data={artistSongInfo} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
