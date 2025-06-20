import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSubscribe } from '../reducers/subReducer';
import { notify } from '../reducers/notificationReducer';
import SubFormModal from './SubFormModal';
import LoadingSpinner from './LoadingSpinner';
import getErrorMsg from '../utils/getErrorMsg';
import storageService from '../utils/localStorage';

import {
  Paper,
  Typography,
  useMediaQuery,
  Link,
  Button,
  TextField,
} from '@material-ui/core';
import { useSubPanelStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
// import AddIcon from '@material-ui/icons/Add';
// import CheckIcon from '@material-ui/icons/Check';
import MapModal from './MapModal';

const TopSubsPanel = () => {
  const { subs, user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const classes = useSubPanelStyles();
  const theme = useTheme();
  const isNotDesktop = useMediaQuery(theme.breakpoints.down('md'));

  const [searchTerm, setSearchTerm] = useState(''); // Search term for subreddit name
  const [latitude, setLatitude] = useState(''); // Latitude for search by location
  const [longitude, setLongitude] = useState(''); // Longitude for search by location
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  if (isNotDesktop) {
    return null;
  }

  console.log('search results:', searchResults);

  const loggedUser = storageService.loadUser() || user;

  const loadingSubs = !subs || !subs.topSubs;

  // const isSubscribed = (subscribedBy, user) => {
  //   return subscribedBy.includes(user.id);
  // };

  // Fetch subreddit by search term (name)
  const fetchSubredditByName = async (term) => {
    try {
      setLoadingSearch(true);
      const response = await fetch(`http://localhost:3005/api/subreddits?search=${term}`);
      const data = await response.json();
      setSearchResults(data);
      setLoadingSearch(false);
    } catch (err) {
      setLoadingSearch(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  // Fetch subreddit by lat/lng location
  const fetchSubredditByLocation = async (lat, lng) => {
    try {
      setLoadingSearch(true);
      const response = await fetch(`http://localhost:3005/api/subreddits?latitude=${lat}&longitude=${lng}`);
      const data = await response.json();
      setSearchResults(data);
      setLoadingSearch(false);
    } catch (err) {
      setLoadingSearch(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  // Handle search input (for subreddit name)
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle latitude input
  // const handleLatitudeChange = (e) => {
  //   setLatitude(e.target.value);
  // };

  // Handle longitude input
  // const handleLongitudeChange = (e) => {
  //   setLongitude(e.target.value);
  // };

  // Handle search submit for both subreddit name and lat/lng search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      fetchSubredditByName(searchTerm);
    } else if (latitude && longitude) {
      fetchSubredditByLocation(latitude, longitude);
    } else {
      dispatch(notify('Please enter a search term or latitude/longitude', 'error'));
    }
  };

  // const handleJoinSub = async (id, subscribedBy, subredditName) => {
  //   try {
  //     let updatedSubscribedBy;

  //     if (subscribedBy.includes(user.id)) {
  //       updatedSubscribedBy = subscribedBy.filter((s) => s !== user.id);
  //     } else {
  //       updatedSubscribedBy = [...subscribedBy, user.id];
  //     }
  //     dispatch(toggleSubscribe(id, updatedSubscribedBy));

  //     let message = subscribedBy.includes(user.id)
  //       ? `Unsubscribed from r/${subredditName}`
  //       : `Subscribed to r/${subredditName}!`;
  //     dispatch(notify(message, 'success'));
  //   } catch (err) {
  //     dispatch(notify(getErrorMsg(err), 'error'));
  //   }
  // };

  return (
    <Paper variant="outlined" className={classes.mainPaper}>
      <Paper variant="outlined" className={classes.listPaper}>
        <Typography variant="h5" color="secondary" className={classes.title}>
          Groups
        </Typography>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit}>
          <TextField
            variant="outlined"
            name="searchTerm"
            placeholder="Search groups by name or description"
            value={searchTerm}
            onChange={handleSearchTermChange}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          {/*
          <TextField
            variant="outlined"
            name="latitude"
            placeholder="Latitude"
            value={latitude}
            onChange={handleLatitudeChange}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            name="longitude"
            placeholder="Longitude"
            value={longitude}
            onChange={handleLongitudeChange}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          */}
          <MapModal
            isOpen={true}
            hideMap={true}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginBottom: '20px' }}
          >
            Search
          </Button>
        </form>

        {loadingSubs || loadingSearch ? (
          <LoadingSpinner text="Fetching subs data..." />
        ) : (
          (searchResults.length > 0 ? searchResults : subs.topSubs).map((s, i) => (
            <div key={s.id} className={classes.listWrapper}>
              <Typography variant="body2" className={classes.listItem}>
                {`${i + 1}. `}
                <Link
                  component={RouterLink}
                  to={`/r/${s.subredditName}`}
                  color="primary"
                >
                  r/{s.subredditName}
                </Link>
                {/* {` - ${s.subscriberCount} members `} */}
              </Typography>
              {/* {loggedUser && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={
                    isSubscribed(s.subscribedBy, user) ? (
                      <CheckIcon />
                    ) : (
                      <AddIcon />
                    )
                  }
                  onClick={() =>
                    handleJoinSub(s.id, s.subscribedBy, s.subredditName)
                  }
                >
                  {isSubscribed(s.subscribedBy, user) ? 'Joined' : 'Join'}
                </Button>
              )} */}
            </div>
          ))
        )}
      </Paper>
      {loggedUser && <SubFormModal />}
    </Paper>
  );
};

export default TopSubsPanel;
