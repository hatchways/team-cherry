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
  Snackbar,
  Dialog,
  Button,
  IconButton
} from "@material-ui/core/";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import io from "socket.io-client";

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
  snackBarBackground: {
    background: theme.palette.primary.main,
  }
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

// Variables for "new mentions" popup window.
const DialogTitle = withStyles(useStyles)((props) => {
  const { children } = props;
  return (
    <MuiDialogTitle disableTypography>
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
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

    let keywords = currentUrlParams.get("keywords");
    if (!keywords) {
      keywords = "";
    }
    let sortByState = currentUrlParams.get("sortBy");
    if (!sortByState) {
      sortByState = "MostRecent";
    }

    let allPlatforms = ["Reddit", "Twitter", "Facebook"];
    let switchStates = [];
    allPlatforms.forEach((item) => {
      switchStates[item] = splitSelectedPlatforms.includes(item);
    });

    // Setup WebSocket
    var socket = io.connect("http://localhost:3000/", {
      query: {
        keywords: keywords,
        platformSelected: splitSelectedPlatforms,
      },
    });

    this.state = {
      allPlatforms: allPlatforms,
      platformSelected: [...splitSelectedPlatforms],
      keywords: keywords,
      mentions: [],
      newMentions: [],
      switchStates: switchStates,
      sortByState: sortByState,
      socket: socket,
      snackBarOpen: false,
      newMentionsPopupOpen: false,
      idAndPlatformForMentionDisplayedInDialog: props.match.params.idAndPlatform,
      singleMentionPopupOpen: false,
      mentionDisplayedInDialog: null
    };
  }

  async componentDidUpdate() {
    console.log("componentDidUpdate");

    let currentUrlParams = new URLSearchParams(window.location.search);
    let keywords = currentUrlParams.get("keywords");
    if (!keywords) {
      keywords = "";
    }

    if (this.state.keywords !== keywords) {
      let { data } = await axios.get("/api/mentions", {
        params: {
          platforms: this.state.platformSelected,
          keywords: keywords,
        },
      });

      if (this.state.sortByState === "MostRecent") {
        this.sortByDate(data.mentions);
      } else {
        this.sortByPopularity(data.mentions);
      }

      this.setState({
        mentions: data.mentions,
        keywords: keywords,
      });

      this.state.socket.emit("setKeywords", {
        keywords: this.state.keywords,
      });
    }

    if (this.props.match.params.idAndPlatform) {
      if (this.state.idAndPlatformForMentionDisplayedInDialog !== this.props.match.params.idAndPlatform) {
        console.log("if");

        let { data } = await axios.get("/api/mentions/" + this.props.match.params.idAndPlatform)

        if (data) {
          this.setState({
            mentionDisplayedInDialog: data.mention,
            singleMentionPopupOpen: true,
            idAndPlatformForMentionDisplayedInDialog: this.props.match.params.idAndPlatform
          })
        }
      }
    }
    else {
      if (this.state.idAndPlatformForMentionDisplayedInDialog) {
        console.log("else");
        this.setState({
          mentionDisplayedInDialog: null,
          singleMentionPopupOpen: false,
          idAndPlatformForMentionDisplayedInDialog: null
        })
      }
    }
  }

  async componentDidMount() {
    let res = await axios.get("/api/mentions", {
      params: {
        platforms: this.state.platformSelected,
        keywords: this.state.keywords,
      },
    });

    if (this.state.sortByState === "MostRecent") {
      this.sortByDate(res.data.mentions);
    } else {
      this.sortByPopularity(res.data.mentions);
    }

    this.setState({
      mentions: res.data.mentions,
    });


    this.state.socket.on("newMentions", data => {
      this.setState({
        newMentions: [...data, ...this.state.newMentions],
      })

      if (!this.state.newMentionsPopupOpen) {
        this.setState({
          snackBarOpen: true
        })
      }
    })

    if (this.state.idAndPlatformForMentionDisplayedInDialog) {
      let { data } = await axios.get("/api/mentions/" + this.state.idAndPlatformForMentionDisplayedInDialog)
      if (data) {
        await this.setState({
          mentionDisplayedInDialog: data.mention,
          singleMentionPopupOpen: true
        })
      }
    }
  }

  sortByPopularity(mentions) {
    mentions.sort((a, b) => {
      return b.popularity - a.popularity;
    });
  }

  sortByDate(mentions) {
    mentions.sort((a, b) => {
      if (new Date(b.date) > new Date(a.date)) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  sortToggle(value) {
    let sortedMentions = this.state.mentions;
    if (value === "MostRecent") {
      this.sortByDate(sortedMentions);
    } else {
      this.sortByPopularity(sortedMentions);
    }
    this.setState({
      mentions: sortedMentions,
    });

    this.setState({
      sortByState: value,
    });

    let currentUrlParams = new URLSearchParams(this.props.location.search);
    currentUrlParams.set("sortBy", value);
    this.props.history.push({
      search: currentUrlParams.toString(),
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
          keywords: this.state.keywords,
        },
      });

      const newMentions = this.state.mentions.concat(data.mentions);

      if (this.state.sortByState === "MostRecent") {
        this.sortByDate(newMentions);
      } else {
        this.sortByPopularity(newMentions);
      }

      await this.setState({
        mentions: newMentions,
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
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("platforms", this.state.platformSelected);
    this.props.history.push(
      window.location.pathname + "?" + currentUrlParams.toString()
    );

    this.state.socket.emit("setPlatformSelected", {
      platformSelected: this.state.platformSelected,
    });
  }

  handleSnackBarClick = (event) => {
    let updatedMentions = [...this.state.mentions, ...this.state.newMentions]

    if (this.state.sortByState === "MostRecent") {
      this.sortByDate(updatedMentions);
    } else {
      this.sortByPopularity(updatedMentions);
    }

    this.setState({
      snackBarOpen: false,
      newMentionsPopupOpen: true,
      mentions: updatedMentions,
    })
  }

  handleNewMentionsPopupClose = () => {
    this.setState({
      newMentionsPopupOpen: false,
      newMentions: []
    });
  };

  handleSingleMentionPopupClose = () => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    this.props.history.push("/main" + "?" + currentUrlParams);

    this.setState({
      singleMentionPopupOpen: false,
      idAndPlatformForMentionDisplayedInDialog: null,
      mentionDisplayedInDialog: null
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
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
                  initialSelectedIndex={
                    !this.state.sortByState ||
                      this.state.sortByState === "MostRecent"
                      ? 0
                      : 1
                  }
                  onChange={(value) => {
                    this.sortToggle(value);
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
                        inList={true}
                        id={mention.id}
                        image={mention.imageUrl}
                        title={mention.title}
                        platform={mention.platform}
                        content={mention.content}
                        popularity={mention.popularity}
                        date={mention.date}
                        url={mention.url}
                        summary={mention.summary}
                      />
                    </Grid>
                  );
                })
              )}

            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              open={this.state.snackBarOpen}
              message="New mentions arrived. Click to view. "
              onClick={this.handleSnackBarClick}
              ContentProps={{
                classes: {
                  root: classes.snackBarBackground,
                }
              }}
            />
          </Grid>
        </Grid>

        <Dialog aria-labelledby="customized-dialog-title" open={this.state.newMentionsPopupOpen} maxWidth={'md'} fullWidth={true}>
          <DialogTitle id="customized-dialog-title">
            Newly posted mentions
          </DialogTitle>

          <MuiDialogContent dividers>
            {
              this.state.newMentions.map((mention, index) => {
                return (
                  <Grid item key={index} className={classes.mention}>
                    <Mention
                      inList={true}
                      id={mention.id}
                      image={mention.imageUrl}
                      title={mention.title}
                      platform={mention.platform}
                      content={mention.content}
                      popularity={mention.popularity}
                      date={mention.date}
                      url={mention.url}
                      summary={mention.summary}
                    />
                    {
                      index === this.state.newMentions.length - 1 ? null : <Divider />
                    }
                  </Grid>
                );
              })
            }
          </MuiDialogContent>

          <MuiDialogActions>
            <Button autoFocus onClick={this.handleNewMentionsPopupClose} color="primary">
              Close
            </Button>
          </MuiDialogActions>
        </Dialog>

        <Dialog aria-labelledby="customized-dialog-title" open={this.state.singleMentionPopupOpen} maxWidth={'md'} fullWidth={true}>
          <MuiDialogContent>
            {
              this.state.mentionDisplayedInDialog ?
                <Mention
                  inList={false}
                  image={this.state.mentionDisplayedInDialog.imageUrl}
                  title={this.state.mentionDisplayedInDialog.title}
                  platform={this.state.mentionDisplayedInDialog.platform}
                  content={this.state.mentionDisplayedInDialog.content}
                  popularity={this.state.mentionDisplayedInDialog.popularity}
                  date={this.state.mentionDisplayedInDialog.date}
                  url={this.state.mentionDisplayedInDialog.url}
                  summary={this.state.mentionDisplayedInDialog.summary}
                />
                :
                null
            }

          </MuiDialogContent>

          <Divider style={{ marginTop: "20px" }}></Divider>

          <MuiDialogActions>
            <Button onClick={() => { window.open(this.state.mentionDisplayedInDialog.url) }} color="primary">
              Original Post
            </Button>
            <Button onClick={this.handleSingleMentionPopupClose} color="primary">
              Close
            </Button>
          </MuiDialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(useStyles)(Main);
