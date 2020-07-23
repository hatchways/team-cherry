import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Moment from "react-moment";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied"; //ok
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied"; //sad
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt"; //happy
import Tooltip from "@material-ui/core/Tooltip";

import { useHistory } from "react-router-dom";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { Typography, IconButton, ButtonBase, Grid } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  CardInList: {
    height: "200px",
    width: "100%",
    maxWidth: "850px",
    borderRadius: "5px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    marginBottom: "25px",
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
    textAlign: "left",
  },
  thumbnailDiv: {
    width: "25%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "10px",
  },
  dividerDiv: {
    width: "3%",
  },
  thumbnailImg: {
    objectFit: "contain",
    maxHeight: "75%",
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
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  likeIcon: {
    position: "relative",
    height: "25%",
    right: "80px",
    bottom: "12px",
  },
  sentiment: {
    float: "left",
    top: 0,
    width: "100px",
    position: "absolute",
    right: 0,
    display: "flex",
    justifyContent: "center",
    paddingLeft: "40px",
  },
}));

export default function Mention(props) {
  const classes = useStyles();
  const history = useHistory();

  function sentimentAnalysis() {
    if (props.sentiment < -0.05)
      return (
        <SentimentVeryDissatisfiedIcon
          style={{ color: "rgb(101, 130, 243)" }}
        />
      );
    if (props.sentiment > 0.05)
      return (
        <SentimentSatisfiedAltIcon style={{ color: "rgb(101, 130, 243)" }} />
      );
    return <SentimentSatisfiedIcon style={{ color: "rgb(101, 130, 243)" }} />;
  }
  return (
    <Grid style={{ display: "flex" }}>
      <ButtonBase
        disabled={!props.inList}
        className={props.inList ? classes.CardInList : classes.CardInDialog}
        onClick={(event) => {
          if (props.inLiked) {
            props.toggleLikedDialog();
          } else {
            let currentUrlParams = new URLSearchParams(window.location.search);
            history.push(
              "/main/mentions/" +
                props.id +
                "|" +
                props.platform +
                "?" +
                currentUrlParams
            );
          }
        }}
      >
        <div
          className={props.inList ? classes.CardInList : classes.CardInDialog}
        >
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
            <div className={classes.header}>
              <Typography noWrap gutterBottom variant="h5" component="h2">
                {props.title}
              </Typography>
            </div>

            <Typography
              gutterBottom
              variant="subtitle1"
              component="small"
              className={classes.fontColorForPlatform}
            >
              {props.platform} | Popularity: {props.popularity} |{" "}
              <Moment format="YYYY/MM/DD HH:mm">{props.date}</Moment>
            </Typography>

            {props.inList ? (
              props.summary ? (
                <p className={classes.paragraphInMentionsInList}>
                  {props.summary}
                </p>
              ) : (
                <p className={classes.paragraphInMentionsInList}>
                  {props.content}
                </p>
              )
            ) : (
              <p className={classes.paragraphInMentionsInDialog}>
                {props.content}
              </p>
            )}
            <div className={classes.sentiment}>
              <Tooltip
                title={`From a range between -1 to 1, we gave this post a sentiment score of ${
                  props.sentiment ? props.sentiment.toFixed(2) : 0
                }`}
                aria-label="add"
                placement="top"
              >
                {sentimentAnalysis()}
              </Tooltip>
            </div>
          </div>
        </div>
      </ButtonBase>
      <IconButton
        className={classes.likeIcon}
        onClick={() => props.handleLikeToggle(props.id)}
      >
        {props.inList ? (
          props.liked ? (
            <FavoriteIcon style={{ fill: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )
        ) : null}
      </IconButton>
    </Grid>
  );
}
