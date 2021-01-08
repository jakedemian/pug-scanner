import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { TextField, Typography } from '@material-ui/core';
import PlayerCard from '../components/PlayerCard';

const useStyles = makeStyles({
    root: {
        height: "100vh"
    },
    mainTextField: {
      width: "50%",
      height: 200,
      "& .MuiOutlinedInput-root.Mui-focused fieldset": {
        borderColor: "#fca503"
      },
      "& .MuiOutlinedInput-root": {
          color: "white",
          backgroundColor: "#111",
          "& textarea::placeholder": {
              color: "#eee"
          }
      }
    },
    cardWrapper: {
        marginTop: 16,
        display: "grid",
        gridTemplateColumns: "50% 50%",
        width: "65%"
    }
  });

const Homepage = props => {
    const classes = useStyles();
    const inputRef = useRef(null);

    const [pastedString, setPastedString] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [players, setPlayers] = useState([]);

    const [test, setTest] = useState(false);

    const fetchPlayers = async () => {
        let charNamesArray = pastedString.split(";");
            let charNameData = [];
            for(let i = 0; i < charNamesArray.length; i++){
                let character = charNamesArray[i].split("-");
                charNameData.push({
                    "name": character[0],
                    "realm": character[1]
                })
            }

            let playersArray = [];

            let url = "https://raider.io/api/v1/characters/profile?region=us&fields=gear,guild,covenant,mythic_plus_ranks,raid_progression,mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs&";
            for(let i = 0; i < charNameData.length; i++){
                let thisUrl = url + "realm=" + charNameData[i].realm + "&name=" + charNameData[i].name;
                let res = await axios.get(thisUrl)
                playersArray.push(res.data);
            }
            
            setPlayers(playersArray);
    }

    useEffect(() => {
        if(!!pastedString){
            fetchPlayers();
        }
    }, [pastedString]);

    useEffect(() => {
        if(players.length > 0){
            console.log("we've got new players!", players, players.length);
        }
    }, [players])

    //Primepriest-Stormrage;Orillun-Stormrage


    return (
        <div className={classes.root}>
            <Typography>Primepriest-Stormrage;Orillun-Stormrage;Kupunch-Stormrage;Vespe-Stormrage;Fancymoose-Stormrage;Bigoofta-Stormrage;Jaquabas-Whisperwind</Typography>
            <TextField
                ref={inputRef}
                className={classes.mainTextField}
                placeholder="Paste /ps string here"
                autoFocus
                multiline
                rows={4}
                variant="outlined"
                onKeyPress={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onPaste={(e) => {
                    setPlayers([]);
                    setPastedString(e.clipboardData.getData('Text'));
                    e.stopPropagation();
                }}
            />
            
            <div className={classes.cardWrapper}>
                {players.map((player, index) => {
                    return (
                        <div key={index} className={classes.cardWrapper}>
                            <PlayerCard player={player} />
                        </div>
                    )
                })}
            </div>

        </div>
    );
};

export default Homepage;