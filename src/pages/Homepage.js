import {makeStyles} from '@material-ui/styles';
import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {TextField, Typography} from '@material-ui/core';
import logo from '../assets/images/logo.png';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import GroupSummary from "../components/GroupSummary";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from "@material-ui/lab/AlertTitle";
import Utilities from "../utilities/Utilities";
import PlayerList from "../components/PlayerList";

const useStyles = makeStyles({
    root: {
        height: "100vh",
        display: "flex",
        justifyContent: "center"
    },
    wrapper: {
        width: 850,
        marginTop: 16
    },
    mainTextField: {
        width: "100%",
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
        width: "100%"
    }
});

// TODO
/*
- add role played in recent keys
- hovering a score should show the dps/healer/tank score breakdown
- add a x/10 to loading animation.  eg 6/22 players loaded
*/
// TODO

const Homepage = props => {
    const classes = useStyles();
    const inputRef = useRef(null);

    const [pastedString, setPastedString] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [failedCharacters, setFailedCharacters] = useState([]);
    const [players, setPlayers] = useState([]);
    const [applicants, setApplicants] = useState([]);

    const [scoreColors, setScoreColors] = useState([]);
    const apiUrl = "https://raider.io/api/v1/characters/profile?region=us&fields=gear,guild,covenant,mythic_plus_ranks,raid_progression,mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs&";
    const getScoreColor = (score) => {
        return Utilities.getScoreColor(score, scoreColors);
    };

    const getScoreTextColor = (score) => {
        return Utilities.getScoreTextColor(score, scoreColors);
    };

    const fetchScoreColors = async () => {
        let url = "https://raider.io/api/v1/mythic-plus/score-tiers?season=current";
        let res = await axios.get(url);
        setScoreColors(res.data);
    };

    const parsePastedString = (idString) => {
        if(pastedString.indexOf(idString) === -1){
            return []
        }

        const groupStringStart = pastedString.indexOf(idString) + idString.length;
        const groupStringEnd = pastedString.substr(groupStringStart).indexOf("\n");
        const groupString = pastedString.substr(groupStringStart, groupStringEnd);
        return groupString.split(';');
    }

    const fetchPlayers = async (idString, updateFunc) => {
        setIsFetching(true);

        let groupNamesArray = parsePastedString(idString);
        let groupNameData = [];

        for (let i = 0; i < groupNamesArray.length; i++) {
            if(groupNamesArray[i].trim().length === 0){
                continue;
            }

            let character = groupNamesArray[i].split("-");
            groupNameData.push({
                "name": character[0],
                "realm": character[1]
            })
        }

        let playersArray = [];
        for (let i = 0; i < groupNameData.length; i++) {
            let thisUrl = apiUrl + "realm=" + groupNameData[i].realm + "&name=" + groupNameData[i].name;

            let res;
            try {
                res = await axios.get(thisUrl);
            } catch (err) {
                setFailedCharacters([...failedCharacters,groupNameData[i].name + "-" + groupNameData[i].realm]);
                console.error(err);
                continue;
            }

            playersArray.push(res.data);
        }

        setIsFetching(false);
        updateFunc(playersArray);
    }

    useEffect(() => {
        if (!!pastedString) {
            fetchPlayers("_group:", setPlayers);
            fetchPlayers("_applicants:", setApplicants);
        }
    }, [pastedString]);

    useEffect(() => {
        fetchScoreColors();
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <div>
                    <img src={logo} className="inline"/>
                    <div className="inline-block" style={{transform: "translateY(7px)"}}>
                        <Typography className="text-gray-500 italic">v0.5</Typography>
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
                        if (pastedString !== e.clipboardData.getData('Text')) {
                            // only set if not exactly the same, otherwise it doesnt work right
                            setPastedString(e.clipboardData.getData('Text'));
                            setFailedCharacters([]);
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
                                setApplicants([]);
                                setFailedCharacters([]);
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                )}

                {failedCharacters.length > 0 && (
                    <Alert severity="error" className="mb-4">
                        <AlertTitle>Failed to load the following characters:</AlertTitle>
                        {failedCharacters.map((character, index) => {
                            return (
                                <Typography key={index} variant="caption" className="block">{character}</Typography>
                            )
                        })}
                    </Alert>
                )}

                <div className="pb-32">
                    {isFetching ? (
                        <div className="w-full flex flex-col items-center justify-center">
                            <CircularProgress style={{color: "#fca503"}}/>
                            <Typography className="text-white">Retrieving character info...</Typography>
                        </div>
                    ) : (
                        <div>
                            <GroupSummary
                                players={players}
                                getScoreColor={getScoreColor}
                                getScoreTextColor={getScoreTextColor}
                            />

                            {!!players && !!players.length > 0 && (
                                <PlayerList {...{
                                    playerData: players,
                                    getScoreColor: getScoreColor,
                                    getScoreTextColor: getScoreTextColor,
                                    label: "Your Group"
                                }} />
                            )}

                            {!!applicants && !!applicants.length > 0 && (
                                <PlayerList {...{
                                    playerData: applicants,
                                    getScoreColor: getScoreColor,
                                    getScoreTextColor: getScoreTextColor,
                                    label: "LFG Applicants"
                                }} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
