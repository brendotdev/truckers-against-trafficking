import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, loadMorePosts } from '../reducers/postReducer';
import { notify } from '../reducers/notificationReducer';
import PostCard from './PostCard';
import SortTabBar from './SortTabBar';
import LoadMoreButton from './LoadMoreButton';
import LoadingSpinner from './LoadingSpinner';
import getErrorMsg from '../utils/getErrorMsg';
// import MapModal from '../components/MapModal'; // Import your MapModal component
import ModalList from './MapList';

import { Typography } from '@material-ui/core';
import { usePostListStyles } from '../styles/muiStyles';

const PostList = () => {
  const [sortBy, setSortBy] = useState('map'); // This state will determine which tab is active
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = usePostListStyles();

  const handleTabChange = async (e, newValue) => {
    try {
      setPageLoading(true);
      await dispatch(fetchPosts(newValue));
      setSortBy(newValue); // Update the active tab
      setPageLoading(false);
      if (page !== 1) {
        setPage(1);
      }
    } catch (err) {
      setPageLoading(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const handleLoadPosts = async () => {
    try {
      setLoadingMore(true);
      await dispatch(loadMorePosts(sortBy, page + 1));
      setPage((prevState) => prevState + 1);
      setLoadingMore(false);
    } catch (err) {
      setLoadingMore(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  return (
    <div className={classes.root}>
      <SortTabBar
        sortBy={sortBy}
        handleTabChange={handleTabChange}
        subscribedTab={true}
        user={user}
      />
      {/* Conditionally render MapModal based on the active tab */}
      {sortBy === 'map' ? (
        <ModalList /> // Show the MapModal if "Map" tab is selected
      ) : !pageLoading ? (
        <div>
          {/* Render your post cards here */}
          {posts.results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <LoadingSpinner text={'Fetching posts. Wait a sec.'} />
      )}
      {sortBy === 'subscribed' && posts.results.length === 0 && (
        <div className={classes.noSubscribedPosts}>
          <Typography variant="h5" color="secondary">
            No Posts Found
          </Typography>
          <Typography variant="h6" color="secondary">
            Subscribe to more subs if you haven't!
          </Typography>
        </div>
      )}
      {posts && 'next' in posts && !pageLoading && (
        <LoadMoreButton
          handleLoadPosts={handleLoadPosts}
          loading={loadingMore}
        />
      )}
    </div>
  );
};

export default PostList;
