import React, { useEffect, useState } from "react";
import {
  Grid,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import { debounce } from "throttle-debounce";

import Mention from "../components/Mention";
import MentionDialog from "../components/liked-mentions/MentionDialog";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginTop: "3%",
    alignItems: "center",
  },
}));

const LikedMentions = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    mentions: [],
    page: 0,
    hasMore: true,
    dialogOpen: false,
    dialogMention: {},
  });

  useEffect(() => {
    async function getLikedMentions() {
      const res = await axios.get("/api/users/mentions/liked", {
        params: { page: state.page },
      });
      setState({ ...state, mentions: res.data.mentions, page: state.page + 1 });
    }
    getLikedMentions();
  }, []);

  const loadMore = async () => {
    let res = await axios.get("/api/users/mentions/liked", {
      params: { page: state.page },
    });

    setState({
      ...state,
      mentions: [...state.mentions, ...res.data.mentions],
      page: state.page + 1,
      hasMore: res.data.hasMore,
    });
  };

  const debouncedLoader = debounce(250, loadMore);

  const toggleLike = async (mentionId) => {
    const res = await axios.post(`/api/users/mentions/${mentionId}/like`);
    const { mention } = res.data;
    if (!mention.liked) {
      setState({
        ...state,
        mentions: state.mentions.filter((m) => m.MentionId !== mentionId),
      });
    }
  };

  const toggleDialog = (mention) => {
    setState({ ...state, dialogOpen: true, dialogMention: mention });
  };

  const dialogClose = () => {
    setState({ ...state, dialogOpen: false, dialogMention: {} });
  };

  return (
    <Grid className={classes.container}>
      <h1 style={{ textAlign: "center" }}>Your Liked Mentions</h1>
      <MentionDialog
        open={state.dialogOpen}
        handleClose={dialogClose}
        mention={state.dialogMention}
        toggleLike={toggleLike}
      />
      <InfiniteScroll
        pageState={state.page}
        loadMore={debouncedLoader}
        hasMore={state.hasMore}
        loader={<LinearProgress key={0} />}
      >
        {state.mentions.map((m) => {
          const mention = m.Mention;
          return (
            <Mention
              inLiked
              toggleLikedDialog={() => toggleDialog(mention)}
              inList={true}
              key={mention.id}
              handleLikeToggle={toggleLike}
              liked={true}
              id={mention.id}
              image={mention.imageUrl}
              title={mention.title}
              platform={mention.platform}
              content={mention.content}
              popularity={mention.popularity}
              date={mention.date}
            />
          );
        })}
      </InfiniteScroll>{" "}
    </Grid>
  );
};

export default LikedMentions;
