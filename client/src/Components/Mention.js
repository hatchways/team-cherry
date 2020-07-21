import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, IconButton } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";

const useStyles = makeStyles(() => ({
  Card: {
    height: "200px",
    borderRadius: "5px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
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
    maxWidth: "70%",
    maxHeight: "70%",
  },
  contentDiv: {
    width: "69%",
  },
  paragraphInMentions: {
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
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
    bottom: "10px",
  },
}));

export default function Mention(props) {
  const classes = useStyles();
  const toggleLike = async (mentionId) => {
    const res = await axios.post(`/api/users/mentions/${mentionId}/like`);
    const { mention } = res.data;
    if (!mention.liked) {
      // might use a context dispatch here to signal to LikedMentions component that a mention is possibly unliked
      console.log(`mention ${mention.id} was unliked`);
    }
  };

  return (
    <div className={classes.Card}>
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
          <IconButton
            className={classes.likeIcon}
            onClick={() => props.handleLikeToggle(props.id)}
          >
            <FavoriteIcon />
          </IconButton>
        </div>

        <Typography
          gutterBottom
          variant="subtitle1"
          component="small"
          className={classes.fontColorForPlatform}
        >
          {props.platform} | Popularity: {props.popularity} | {props.date}
        </Typography>

        <p className={classes.paragraphInMentions}>{props.content}</p>
        <div className={classes.dividerDiv}></div>
      </div>
    </div>
  );
}
