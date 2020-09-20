import React, { useState } from 'react';
import './App.css';

function App() {
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
        });
    }
    else if ({artist}.artist !== '' && {song}.song === '') {
        fetch('/artist?artist=' + {artist}.artist).then(res => res.json()).then(data => {
           setArtistInfo(data);
        });
    }
    else if ({artist}.artist === '' && {song}.song !== '') {
        fetch('/song?song=' + {song}.song).then(res => res.json()).then(data => {
           setSongInfo(data);
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

  return (
    <div className="App">
      <form onSubmit={mySubmitHandler}>
        <p>Enter Singer/Artist:</p>
        <input name='artist' onChange={myChangeHandler} type="text" />
        <p>And/Or Song Title:</p>
        <input name='song' onChange={myChangeHandler} type="text" /><br /> <br />
        <input type="submit" value="Submit" />
      </form>
	<div>
	   <h1> Artist Info </h1>
	   <p>{artistInfo}</p>
        </div>
	<div>
	   <h1> Song Info </h1>
	   <p>{songInfo}</p>
        </div>
	<div>
	   <h1> Artist Song Info </h1>
	   <p>{artistSongInfo}</p>
        </div>
    </div>
  );
}

export default App;
