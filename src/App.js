import React, { useState } from 'react';
import './App.css';

function App() {
  const [headerText, setHeaderText] = useState('');
  const [artist, setArtist] = useState('');
  const [artistInfo, setArtistInfo] = useState('');
  const [song, setSong] = useState('');
  const [songInfo, setSongInfo] = useState('');
  const [artistSongInfo, setArtistSongInfo] = useState('');


  var handleData = (data) => {
      var modifiedData = [];
      var keys = Object.getOwnPropertyNames(data);
      var i = 0;
      while (i < keys.length) {
         modifiedData[keys[i]] = data[keys[i]];
         i++;
      }
      return modifiedData
  }

  var mySubmitHandler = (event) => {

    event.preventDefault();

    if ({artist}.artist !== '' && {song}.song !== '') {
        fetch('/artistsong?artist='+{artist}.artist +'&song='+{song}.song).then(res => res.json()).then(data => {
           var artistSongDisplay = handleData(data);
           setArtistSongInfo(artistSongDisplay);
	   setArtistInfo('');
	   setSongInfo('');
           setHeaderText('Artist & Song Information');
        });
    }
    else if ({artist}.artist !== '' && {song}.song === '') {
        fetch('/artist?artist=' + {artist}.artist).then(res => res.json()).then(data => {
           var artistDisplay = handleData(data);
           setArtistInfo(artistDisplay);
	   setSongInfo('');
           setArtistSongInfo('');
           setHeaderText('Artist Information');
        });
    }
    else if ({artist}.artist === '' && {song}.song !== '') {
        fetch('/song?song=' + {song}.song).then(res => res.json()).then(data => {
           var tracksDisplay = handleData(data);
           setSongInfo(tracksDisplay);
           setArtistInfo('');
           setArtistSongInfo('');
           setHeaderText('Song(s) Information');
        });
    }
    else {
    	alert("Please Enter an artist, a song, or both.");
    }


  }

  var myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    if (nam==='artist'){
	setArtist(val);
    }
    else if (nam === 'song') {
	setSong(val);
    }

  }


const getArtistFromSongSearch = (artistName) => e =>  {
    e.preventDefault();
    fetch('/artist?artist=' + artistName).then(res => res.json()).then(data => {
        var artistFromSongList = handleData(data);
        setArtistInfo(artistFromSongList);
	setSongInfo('');
        setArtistSongInfo('');
        setHeaderText('Artist Information');
    });
}

const getArtistSongFullInfo = (artistName, songName) => e =>  {
    e.preventDefault();
    fetch('/artistsong?artist='+artistName +'&song='+songName).then(res => res.json()).then(data => {
        var artistSongFromSongList = handleData(data);
        setArtistSongInfo(artistSongFromSongList);
        setArtistInfo('');
        setSongInfo('');
        setHeaderText('Artist & Song Information');
    });
}

const ArtistSongMap = ({ data }) =>
  Object.entries(data).map(([k, v]) => (
    <div class="textCenter">
      <h3>{k}: {v}</h3>
      <br />
      <button type="button" class="btn btn-primary" onClick={getArtistSongFullInfo(k,v)}>Info on {v} by {k}</button>
      <br />
      <br />
      <button type="button" class="btn btn-secondary" onClick={getArtistFromSongSearch(k)}>Info on {k}</button>
      <br />
      <br />
      <br />
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
      <div class="d-flex justify-content-center">
      <br />
      <br />
      <form onSubmit={mySubmitHandler}>
        <p>Enter Singer/Artist:</p>
        <input name='artist' onChange={myChangeHandler} type="text" />
        <br />
        <p>And/Or Song Title:</p>
        <input name='song' onChange={myChangeHandler} type="text" /><br /> <br />
        <input type="submit" value="Submit" />
      </form>
      </div>
      <br />
      <br />
      <div class="row justify-content-center">
	   <h2 class="row justify-content-center"><u>{headerText}</u></h2>
      <br />
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
       </body>
    </div>
  );
}

export default App;
