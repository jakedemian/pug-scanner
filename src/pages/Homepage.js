import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { TextField, Typography } from '@material-ui/core';
import PlayerCard from '../components/PlayerCard';
import logo from '../assets/logo.png';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
    root: {
        height: "100vh",
        padding: 32
    },
    mainTextField: {
      width: "50%",
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
        width: "65%"
    },
    cardGrid: {
        display: "grid",
        gridTemplateColumns: "50% 50%",
    }
  });

// Primepriest-Stormrage;Orillun-Stormrage;Kupunch-Stormrage;Vespe-Stormrage;Fancymoose-Stormrage;Bigoofta-Stormrage;Jaquabas-Whisperwind

const Homepage = props => {
    const classes = useStyles();
    const inputRef = useRef(null);

    const [pastedString, setPastedString] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [failedCharacters, setFailedCharacters] = useState([]);
    const [players, setPlayers] = useState([]);

    const [scoreColors, setScoreColors] = useState([]);

    const fetchScoreColors = async () => {
        let url = "https://raider.io/api/v1/mythic-plus/score-tiers?season=current";
        let res = await axios.get(url);
        setScoreColors(res.data);
    };

    const fetchPlayers = async () => {
        setIsFetching(true);
        let charNamesArray = pastedString.split(";");
        let charNameData = [];

        for (let i = 0; i < charNamesArray.length; i++) {
            let character = charNamesArray[i].split("-");
            charNameData.push({
                "name": character[0],
                "realm": character[1]
            })
        }

        let playersArray = [];

        let failed = [];
        let url = "https://raider.io/api/v1/characters/profile?region=us&fields=gear,guild,covenant,mythic_plus_ranks,raid_progression,mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs&";
        for (let i = 0; i < charNameData.length; i++) {
            let thisUrl = url + "realm=" + charNameData[i].realm + "&name=" + charNameData[i].name;

            let res;
            try {
                res = await axios.get(thisUrl);
            } catch(err){
                failed.push(charNameData[i].name + "-" + charNameData[i].realm);
                console.error(err);
                continue;
            }

            playersArray.push(res.data);
        }

        if(failed.length > 0){
            setFailedCharacters(failed);
            console.log("Failed to load the following characters: ", failedCharacters);
        }

        setPlayers(playersArray);
        setIsFetching(false);
    };

    useEffect(() => {
        console.log("pasted string is", pastedString);
        if(!!pastedString){
            fetchPlayers();
        }
    }, [pastedString]);

    useEffect(() => {
        fetchScoreColors();
    }, []);

    return (
        <div className={classes.root}>
            <div>
                <img src={logo} className="inline"/>
                <div className="inline-block" style={{transform: "translateY(7px)"}}>
                    <Typography className="text-gray-500 italic">v0.1</Typography>
                </div>
            </div>
            <TextField
                ref={inputRef}
                className={classes.mainTextField}
                placeholder="Paste /ps string here"
                autoFocus
                multiline
                rows={4}
                variant="outlined"
                value={pastedString}
                onKeyPress={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onPaste={(e) => {
                    if(pastedString !== e.clipboardData.getData('Text')) {
                        // only set if not exactly the same, otherwise it doesnt work right
                        setPastedString(e.clipboardData.getData('Text'));
                    }
                    e.stopPropagation();
                }}
            />
            {!!pastedString && (
                <div>
                    <Button
                        className="text-white"
                        onClick={() => {
                            setPastedString("");
                            inputRef.current.querySelector("textarea").value = "";
                            setPlayers([]);
                            setFailedCharacters([]);
                        }}
                    >
                        Clear
                    </Button>
                </div>
            )}

            {failedCharacters.length > 0 && (
                <div>
                    <Typography className="text-red-500">Failed to load the following characters:</Typography>
                    {failedCharacters.map((character, index) => {
                        return (
                            <Typography variant="caption" className="ml-4 text-red-500 block">{character}</Typography>
                        )
                    })}
                </div>
            )}

            <div className={classes.cardWrapper}>
                {isFetching ? (
                    <div className="w-full flex justify-center">
                        <CircularProgress style={{color: "#fca503"}}/>
                    </div>
                ) : (
                    <div className={classes.cardGrid}>
                        {players.map((player, index) => {
                            return (
                                <div key={index} className={classes.cardWrapper}>
                                    <PlayerCard player={player} scoreColors={scoreColors}/>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Homepage;
