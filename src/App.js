import React, { useState } from 'react';
import './App.css';

function App() {
  const [headerText, setHeaderText] = useState('');
  const [artist, setArtist] = useState('');
  const [artistInfo, setArtistInfo] = useState('');
  const [song, setSong] = useState('');
  const [songInfo, setSongInfo] = useState('');
  const [artistSongInfo, setArtistSongInfo] = useState('');
  const [errorInfo, setErrorInfo] = useState('');


  var handleData = (data, keys) => {
    var modifiedData = [];
    var i = 0;
    while (i < keys.length) {
      modifiedData[keys[i]] = data[keys[i]];
      i++;
    }
    return modifiedData
  }

  const spinner = document.getElementById("spinner");
  const errorAlert = document.getElementById("errorAlert");

  function showSpinner() {
    spinner.className = "show";
    setTimeout(() => {
      spinner.className = spinner.className.replace("show", "");
    }, 5000);
  }

  function hideSpinner() {
    spinner.className = spinner.className.replace("show", "");
  }

  function showErrorAlert() {
    hideSpinner();
    errorAlert.className = "show";
    setArtistSongInfo('');
    setArtistInfo('');
    setSongInfo('');
  }

  function hideErrorAlert() {
    errorAlert.className = errorAlert.className.replace("show", "");
  }

  var mySubmitHandler = (event) => {
    hideErrorAlert();
    showSpinner();
    event.preventDefault();
    if ({artist}.artist !== '' && {song}.song !== '') {
      fetch('/artistsong?artist='+{artist}.artist +'&song='+{song}.song).then(res => res.json()).then(data => {
        var keys = Object.getOwnPropertyNames(data);
        if (keys[0] !== "error") {
          var artistSongDisplay = handleData(data, keys);
          hideSpinner();
          setArtistSongInfo(artistSongDisplay);
          setArtistInfo('');
          setSongInfo('');
          setHeaderText('Artist & Song Information');
        }
        else {
          showErrorAlert();
          setErrorInfo('Error: ' + data[keys[0]]);
        }
      })
      .catch((error) => {
        showErrorAlert();
        setErrorInfo('Error: ' + error);
      });
    }
    else if ({artist}.artist !== '' && {song}.song === '') {
      fetch('/artist?artist=' + {artist}.artist).then(res => res.json()).then(data => {
        var keys = Object.getOwnPropertyNames(data);
        if (keys[0] !== "error") {
          var artistDisplay = handleData(data, keys);
          hideSpinner();
          setArtistInfo(artistDisplay);
          setSongInfo('');
          setArtistSongInfo('');
          setHeaderText('Artist Information');
        }
        else {
          showErrorAlert();
          setErrorInfo('Error: ' + data[keys[0]]);
        }
      })
      .catch((error) => {
        showErrorAlert();
        setErrorInfo('Error: ' + error);
      });
    }
    else if ({artist}.artist === '' && {song}.song !== '') {
      fetch('/song?song=' + {song}.song).then(res => res.json()).then(data => {
        var keys = Object.getOwnPropertyNames(data);
        if (keys[0] !== "error") {
          var tracksDisplay = handleData(data, keys);
          hideSpinner();
          setSongInfo(tracksDisplay);
          setArtistInfo('');
          setArtistSongInfo('');
          setHeaderText('Song(s) Information');
        }
        else {
          showErrorAlert();
          setErrorInfo('Error: ' + data[keys[0]]);
        }
      })
      .catch((error) => {
        showErrorAlert();
        setErrorInfo('Error: ' + error);
      });
    }
    else {
      showErrorAlert();
      setErrorInfo("Please Enter an artist, a song, or both.");
    }
  }

  var myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    if (nam==='artist') {
      setArtist(val);
    }
    else if (nam === 'song') {
      setSong(val);
    }
  }


  const getArtistFromSongSearch = (artistName) => e =>  {
    hideErrorAlert();
    showSpinner();
    e.preventDefault();
    fetch('/artist?artist=' + artistName).then(res => res.json()).then(data => {
      var keys = Object.getOwnPropertyNames(data);
      if (keys[0] !== "error") {
        var artistFromSongList = handleData(data, keys);
        hideSpinner();
        setArtistInfo(artistFromSongList);
        setSongInfo('');
        setArtistSongInfo('');
        setHeaderText('Artist Information');
      }
      else {
        showErrorAlert();
        setErrorInfo('Error: ' + data[keys[0]]);
      }
    })
    .catch((error) => {
      showErrorAlert();
      setErrorInfo('Error: ' + error);
    });
  }

  const getArtistSongFullInfo = (artistName, songName) => e =>  {
    hideErrorAlert();
    showSpinner();
    e.preventDefault();
    fetch('/artistsong?artist='+artistName +'&song='+songName).then(res => res.json()).then(data => {
      var keys = Object.getOwnPropertyNames(data);
      if (keys[0] !== "error") {
        var artistSongFromSongList = handleData(data, keys);
        hideSpinner();
        setArtistSongInfo(artistSongFromSongList);
        setArtistInfo('');
        setSongInfo('');
        setHeaderText('Artist & Song Information');
      }
      else {
        showErrorAlert();
        setErrorInfo('Error: ' + data[keys[0]]);
      }
    })
    .catch((error) => {
      showErrorAlert();
      setErrorInfo('Error: ' + error);
    });
  }

  const ArtistSongMap = ({ data }) =>
    Object.entries(data).map(([k, v]) => (
      <div class="text-center margin-top-2">
        <h3>{k}: {v}</h3>
        <button type="button" class="btn btn-primary" onClick={getArtistSongFullInfo(k,v)}>Info on {v} by {k}</button><br /><br />
        <button type="button" class="btn btn-secondary" onClick={getArtistFromSongSearch(k)}>Info on {k}</button>
      </div>
  ));

  const InfoMap = ({ data }) =>
    Object.entries(data).map(([k, v]) => (
      <tr>
        <td class="col-2">{k}</td>
        <td class="col-4">{v}</td>
      </tr>
  ));

  return (

    <div className="App">
       <link
         rel="stylesheet"
         href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
         integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
         crossorigin="anonymous"
       />
      <body>
      <div class="container text-center">
        <div class="center text-center margin-top-5">
          <form onSubmit={mySubmitHandler}>
            <p>Enter Singer/Artist:</p>
            <input name='artist' onChange={myChangeHandler} type="text" />
            <p>And/Or Song Title:</p>
            <input name='song' onChange={myChangeHandler} type="text" /><br /><br />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div class="top-margin-5" id="spinner"></div>
        <div class="row">
          <h2 class="row margin-auto"><u>{headerText}</u></h2>
        </div>
        <div id="errorAlert">
          <div class="row">
            <h2 class="margin-auto">{errorInfo}</h2>
          </div>
        </div>
        <div>
	  <div>
            <table class="table ">
	      <InfoMap data ={artistInfo} />
            </table>
          </div>
	  <div>
            <div>
              <ArtistSongMap data={songInfo} />
	    </div>
          </div>
	  <div>
            <table class="table ">
              <InfoMap data={artistSongInfo} />
            </table>
          </div>
        </div>
      </div>
      </body>
    </div>
  );
}

export default App;
