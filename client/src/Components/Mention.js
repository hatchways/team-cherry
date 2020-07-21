import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';//ok
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';//sad
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt'; //happy
import { Typography, ButtonBase } from "@material-ui/core";
import Moment from 'react-moment';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  CardInList: {
    height: "200px",
    width: "100%",
    borderRadius: "5px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left"
  },
  CardInDialog: {
    height: "auto",
    maxHeight: "400px",
    width: "100%",
    borderRadius: "5px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left"
  },
  thumbnailDiv: {
    width: "25%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dividerDiv: {
    width: "3%",
  },
  thumbnailImg: {
    objectFit: "contain",
    maxHeight: "100%",
    width: "95%",
  },
  contentDiv: {
    marginTop: "20px",
    width: "69%",
  },
  paragraphInMentionsInList: {
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
  },
  paragraphInMentionsInDialog: {
    whiteSpace: "pre-wrap",
    maxHeight: "300px",
    height: "auto",
  },
  fontColorForPlatform: {
    color: "#D3D3D3",
  },
}));


export default function Mention(props) {
  console.log('what are props', props)
  const classes = useStyles();
  const history = useHistory();

  function sentimentAnalysis() {
    if (props.sentiment < 0) return <SentimentVeryDissatisfiedIcon />
    if (props.sentiment > 0) return <SentimentSatisfiedAltIcon />
    return <SentimentSatisfiedIcon />
  }
  return (
    < ButtonBase
      disabled={!props.inList}
      className={props.inList ? classes.CardInList : classes.CardInDialog}
      onClick={(event) => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        history.push("/main/mentions/" + props.id + "|" + props.platform + "?" + currentUrlParams);
      }}>
      <div className={props.inList ? classes.CardInList : classes.CardInDialog}>
        <div className={classes.thumbnailDiv}>
          {props.image ? (
            <img className={classes.thumbnailImg} src={props.image} alt="" />
          ) : (
              <img
                className={classes.thumbnailImg}
                src={`/imgs/${props.platform}_icon.png`}
                alt=""
              />
            )}
        </div>

        <div className={classes.dividerDiv}></div>

        <div className={classes.contentDiv}>
          <Typography noWrap={props.inList} gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>

          <Typography
            gutterBottom
            variant="subtitle1"
            component="small"
            className={classes.fontColorForPlatform}
          >
            {props.platform} | Popularity: {props.popularity} | <Moment format="YYYY/MM/DD HH:mm">{props.date}</Moment> | Sentiment: {sentimentAnalysis()}
          </Typography>

          {
            props.inList ?
              (props.summary ? <p className={classes.paragraphInMentionsInList}>{props.summary}</p> : <p className={classes.paragraphInMentionsInList}>{props.content}</p>)
              :
              <p className={classes.paragraphInMentionsInDialog}>{props.content}</p>
          }
        </div>
      </div>
    </ButtonBase >
  );
}
