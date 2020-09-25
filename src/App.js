import React, { useState } from 'react';
import './App.css';

function App() {
  const [headerText, setHeaderText] = useState('');
  const [artist, setArtist] = useState('');
  const [artistInfo, setArtistInfo] = useState('');
  const [song, setSong] = useState('');
  const [songInfo, setSongInfo] = useState('');
  const [artistSongInfo, setArtistSongInfo] = useState('');


  var mySubmitHandler = (event) => {

    event.preventDefault();

    if ({artist}.artist !== '' && {song}.song !== '') {
        fetch('/artistsong?artist='+{artist}.artist +'&song='+{song}.song).then(res => res.json()).then(data => {
           setArtistSongInfo(data);
	   setArtistInfo('');
	   setSongInfo('');
           setHeaderText('Artist & Song Information');
        });
    }
    else if ({artist}.artist !== '' && {song}.song === '') {
        fetch('/artist?artist=' + {artist}.artist).then(res => res.json()).then(data => {
           setArtistInfo(data);
	   setSongInfo('');
           setArtistSongInfo('');
           setHeaderText('Artist Information');
        });
    }
    else if ({artist}.artist === '' && {song}.song !== '') {
        fetch('/song?song=' + {song}.song).then(res => res.json()).then(data => {
           var tracksDisplay = [];
	   var keys = Object.getOwnPropertyNames(data);
           var i = 0;
	   while (i < keys.length) {
              tracksDisplay[keys[i]] = data[keys[i]];
              i++;
           }
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

const Example = ({ data }) =>
  Object.entries(data).map(([k, v]) => (
    <div key={k}>
      {k}: {v}
      <br />
      <br />
    </div>
  ));


  return (
    <div className="App">
      <form onSubmit={mySubmitHandler}>
        <p>Enter Singer/Artist:</p>
        <input name='artist' onChange={myChangeHandler} type="text" />
        <p>And/Or Song Title:</p>
        <input name='song' onChange={myChangeHandler} type="text" /><br /> <br />
        <input type="submit" value="Submit" />
      </form>
	   <h1> {headerText} </h1>
	<div>
	   <p>{artistInfo}</p>
        </div>
	<div>
           <div>
              <Example data={songInfo} />
	   </div>
        </div>
	<div>
	   <p>{artistSongInfo}</p>
        </div>
    </div>
  );
}

export default App;
