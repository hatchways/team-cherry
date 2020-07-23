import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { Typography, IconButton, ButtonBase, Grid } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  CardInList: {
    height: "200px",
    width: "100%",
    borderRadius: "5px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
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
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  likeIcon: {
    position: "relative",
    height: "25%",
    top: "32px",
    right: "40px",
  },
}));

export default function Mention(props) {
  const classes = useStyles();
  const history = useHistory();

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
