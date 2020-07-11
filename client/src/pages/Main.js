import React, { Component } from "react";
import Mention from "../components/Mention";
import axios from "axios";
import SwitchSelector from "react-switch-selector";
import { withStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Switch,
  Avatar,
  ListItemAvatar,
  Divider,
  Grid,
  ListItemSecondaryAction,
} from "@material-ui/core/";
import { uuid } from "uuidv4";
import Header from "../components/Header";

const useStyles = (theme) => ({
  RootGridContainer: {
    "& .MuiGrid-container": {
      paddingTop: "50px",
    },
  },
  rightPart: {
    marginTop: "8em",
  },
  SwitchSelector: {
    height: "2.8em",
    width: "30%",
    fontWeight: 400,
  },
  leftPanelGrid: {
    height: "calc(100vh - 5.4em)",
    position: "fixed",
    marginTop: "5.4em",
  },
  leftPanelList: {
    background: "white",
    width: "100%",
  },
  platformItem: {
    height: "6em",
  },
  platformFont: {
    fontWeight: 800,
  },
  platformListItemAvatar: {
    marginRight: "7px",
  },
  platformAvatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  instruction: {
    textAlign: "center",
  },
  mention: {
    maxWidth: "100%",
  },
});

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 36,
    height: 19,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(17px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#6583f2",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#6583f2",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 17,
    height: 17,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: "#bdc7d4",
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

class Main extends Component {
  constructor(props) {
    super(props);

    // Get the params in the URL so we can know which platforms are selected.
    let currentUrlParams = new URLSearchParams(window.location.search);
    let selectedPlatformsInURL = currentUrlParams.get("platforms");
    let splitSelectedPlatforms = [];
    if (selectedPlatformsInURL) {
      splitSelectedPlatforms = selectedPlatformsInURL.split(",");
    }

    let allPlatforms = ["Reddit", "Twitter", "Facebook"];
    let switchStates = [];
    allPlatforms.forEach((item) => {
      switchStates[item] = splitSelectedPlatforms.includes(item);
    });

    this.state = {
      allPlatforms: allPlatforms,
      platformSelected: [...splitSelectedPlatforms],
      mentions: [],
      switchStates: switchStates,
      sortByState: ''
    };
  }

  async componentDidMount() {
    let res = await axios.get("/api/mentions", {
      params: {
        platforms: this.state.platformSelected,
        keywords: "",
      },
    });
    this.setState({
      mentions: res.data.mentions,
      sortByState: 'MostRecent'
    });
    let currentUrlParams = new URLSearchParams(this.props.location.search);
    currentUrlParams.set('sortBy', this.state.sortByState)
    this.props.history.push({
      search: currentUrlParams.toString()
    });
  }

  sortByPopularity(mentions) {

    mentions.sort((a, b) => {
      return b.popularity - a.popularity;
    });
    this.setState({
      sortByState: 'MostPopular'
    })
    return mentions;
  }

  sortByDate(mentions) {
    mentions.sort((a, b) => {
      return b.date - a.date;
    });
    this.setState({
      sortByState: 'MostRecent'
    })
    return mentions;
  }

  sortToggle(event) {
    let sortedMentions = this.state.mentions;
    if (event === "Most Recent") {
      sortedMentions = this.sortByDate(this.state.mentions);
    } else {
      sortedMentions = this.sortByPopularity(this.state.mentions);
    }
    this.setState({
      mentions: sortedMentions,
    });
    let currentUrlParams = new URLSearchParams(this.props.location.search);
    currentUrlParams.set('sortBy', this.state.sortByState)
    console.log(this.state.sortByState)
    this.props.history.push({
      search: currentUrlParams.toString()
    });
  }

  async handlePlatformToggle(value) {
    let newlySelectedPlatform = value.target.name;
    let checked = value.target.checked;
    this.state.switchStates[newlySelectedPlatform] = checked;

    if (checked) {
      await this.setState({
        platformSelected: [
          ...this.state.platformSelected,
          newlySelectedPlatform,
        ],
      });

      let { data } = await axios.get("/api/mentions/", {
        params: {
          platforms: [newlySelectedPlatform],
          keywords: "",
        },
      });

      const newMentions = this.state.mentions.concat(data.mentions);

      let sortedMentions = this.sortByDate(newMentions);
      await this.setState({
        mentions: sortedMentions,
      });
    } else {
      let index = this.state.platformSelected.indexOf(newlySelectedPlatform);
      let temp = this.state.platformSelected;
      if (index !== -1) {
        temp.splice(index, 1);
      }
      await this.setState({
        platformSelected: temp,
      });

      let filteredMentions = this.state.mentions.filter(
        (mention) => mention.platform !== newlySelectedPlatform
      );

      await this.setState({
        mentions: filteredMentions,
      });
    }

    // Add the selected platforms in to the query params.
    let currentUrlParams = new URLSearchParams();
    currentUrlParams.set("platforms", this.state.platformSelected);
    console.log(currentUrlParams)
    this.props.history.push(
      window.location.pathname + "?" + currentUrlParams.toString()
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Header />
        <Grid container>
          <Grid item xs={3} container className={classes.leftPanelGrid}>
            <List dense className={classes.leftPanelList}>
              {this.state.allPlatforms.map((platform) => {
                return (
                  <div key={platform}>
                    <ListItem className={classes.platformItem}>
                      <ListItemAvatar
                        className={classes.platformListItemAvatar}
                      >
                        <Avatar
                          className={classes.platformAvatar}
                          src={`/imgs/${platform}_icon.png`}
                        />
                      </ListItemAvatar>

                      <ListItemText
                        disableTypography
                        primary={
                          <Typography className={classes.platformFont}>
                            {platform}
                          </Typography>
                        }
                      />

                      <ListItemSecondaryAction>
                        <IOSSwitch
                          name={platform}
                          checked={this.state.switchStates[platform]}
                          onClick={(event) => {
                            this.handlePlatformToggle(event);
                          }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="middle" light />
                  </div>
                );
              })}
            </List>
          </Grid>

          <Grid item xs={4}></Grid>

          <Grid
            item
            xs={6}
            className={classes.rightPart}
            container
            direction={"column"}
            spacing={2}
          >
            <Grid
              item
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <h1>My mentions</h1>
              <div className={classes.SwitchSelector}>
                <SwitchSelector
                  onChange={(event) => {
                    this.sortToggle(event);
                    this.setState({
                      sortByState: event
                    })
                  }}
                  options={[
                    {
                      label: "Most recent",
                      value: "MostRecent",
                      selectedBackgroundColor: "#6583f2",
                      selectedFontColor: "white",
                    },
                    {
                      label: "Most popular",
                      value: "MostPopular",
                      selectedBackgroundColor: "#6583f2",
                      selectedFontColor: "white",
                    },
                  ]}
                  backgroundColor={"#eaeefd"}
                  fontColor={"#6583f2"}
                />
              </div>
            </Grid>

            {this.state.mentions.length === 0 ? (
              <h3 className={classes.instruction}>
                Please enter a company name in the search bar, and toggle one or
                more platforms in the left panel.
              </h3>
            ) : (
                this.state.mentions.map((mention, index) => {
                  return (
                    <Grid item key={index} className={classes.mention}>
                      <Mention
                        image={mention.image}
                        title={mention.title}
                        platform={mention.platform}
                        content={mention.content}
                      />
                    </Grid>
                  );
                })
              )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(Main);
