//
// Component to display a horizontal list of trending videos using a FlatList.
// It features interactive video previews with zoom animations based on which video is currently in view.
//

import { useState } from 'react';

import { FlatList, type ViewToken } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { type VideoWithId } from '../types/video';
import VideoViewer from './VideoViewer';

// custom animation.
const zoomIn = {
  0: {
    opacity: 1,
    scale: 0.9,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};

const zoomOut = {
  0: {
    opacity: 1,
    scale: 1,
  },
  1: {
    opacity: 1,
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItemId, item }: { activeItemId: string; item: VideoWithId }) => {
  const { thumbnail, video: videoUrl } = item;

  return (
    <Animatable.View
      className='mr-1'
      animation={activeItemId === item.id ? zoomIn : zoomOut} // name of the animation.
      duration={500} // duration of the animation.
    >
      <VideoViewer
        thumbnail={thumbnail}
        videoUrl={videoUrl}
        containerStyles='w-52 h-72 rounded-[14px] justify-center items-center mt-3'
      />
    </Animatable.View>
  );
};

const Trending = ({ trendingVideos }: { trendingVideos: VideoWithId[] }) => {
  const [activeItemId, setActiveItemId] = useState<string>(trendingVideos[0]?.id || '');

  // called when the viewability of rows changes, https://reactnative.dev/docs/flatlist#onviewableitemschanged
  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveItemId(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={trendingVideos}
      keyExtractor={(item) => item.id} // unique key for each FlatList item.
      renderItem={({ item }) => <TrendingItem activeItemId={activeItemId} item={item} />}
      horizontal={true} // render the items horizontally.
      onViewableItemsChanged={handleViewableItemsChanged} // called when the viewable items change (as defined by the viewabilityConfig).
      viewabilityConfig={{
        waitForInteraction: true,
        itemVisiblePercentThreshold: 70,
      }}
      showsHorizontalScrollIndicator={false} // hide the horizontal scroll indicator.
      contentContainerStyle={{ paddingHorizontal: 40 }} // styles will be applied to the scroll view content container which wraps all of the child views.
      // it adds horizontal padding, allowing users to fully view and interact with the rightmost video.
      contentOffset={{ x: 0, y: 0 }} // used to manually set the starting scroll offset (default value is {x: 0, y: 0}).
    />
  );
};

export default Trending;
