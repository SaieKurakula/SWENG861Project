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


  var handleData = (data, keys) => {
    var modifiedData = [];
    var i = 0;
    while (i < keys.length) {
      modifiedData[keys[i]] = data[keys[i]];
      i++;
    }
    return modifiedData
  }

  var spinner = document.getElementById("spinner");
  var errorAlert = document.getElementById("errorAlert");

  useEffect(() => {
    spinner = document.getElementById("spinner");
    errorAlert = document.getElementById("errorAlert");
  }, []);

  var showSpinner = () => {
    spinner.className = "show";
    setTimeout(() => {
      spinner.className = spinner.className.replace("show", "");
    }, 5000);
  }

  var hideSpinner = () => {
    spinner.className = spinner.className.replace("show", "");
  }

  var showErrorAlert = () => {
    hideSpinner();
    errorAlert.className = "show";
    setArtistSongInfo('');
    setArtistInfo('');
    setSongInfo('');
  }

  var hideErrorAlert = () => {
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
    let name = event.target.name;
    let val = event.target.value;
    if (name==='artist') {
      setArtist(val);
    }
    else if (name === 'song') {
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
      <div key={k+v} className="text-center margin-top-2">
        <h3>{k}: {v}</h3>
        <button type="button" className="btn btn-primary" onClick={getArtistSongFullInfo(k,v)}>Info on {v} by {k}</button><br /><br />
        <button type="button" className="btn btn-secondary" onClick={getArtistFromSongSearch(k)}>Info on {k}</button>
      </div>
  ));

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
