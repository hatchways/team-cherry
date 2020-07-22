import React, { useEffect, useState } from "react";
import { makeStyles, Grid, LinearProgress } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroller";
import { debounce } from "throttle-debounce";
import axios from "axios";

import Mention from "../components/Mention";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginTop: "3%",
  },
}));

const LikedMentions = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    mentions: [],
    page: 0,
    hasMore: true,
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

  return (
    <Grid className={classes.container}>
      <h1 style={{ textAlign: "center" }}>Page for liked mentions</h1>
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
      </InfiniteScroll>
    </Grid>
  );
};

export default LikedMentions;
