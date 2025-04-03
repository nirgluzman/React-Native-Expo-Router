//
// VideoCard Component
//
// This component displays a video metadata (including creator information, video title, thumbnail) and a video player.
//

import { Alert, Image, View, Text, TouchableOpacity } from 'react-native';

import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView, VideoPlayer } from 'expo-video';

import { type Video as VideoDocument } from '../types/video';
import { icons } from '../constants';

interface IVideoCard {
  videoItem: VideoDocument & { id: string };
}

const VideoCard = ({
  videoItem: {
    creator: { username, photoURL },
    title,
    thumbnail,
    video: videoUrl,
  },
}: IVideoCard) => {
  // hook for managing the lifecycle of the player, and destroying it when the screen is unmounted.
  const videoPlayer = useVideoPlayer(
    (videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'), // VIDEO URL PLACEHOLDER
    (player: VideoPlayer) => {
      player.loop = false; // determines whether the player should automatically replay after reaching the end of the video.
    }
  );

  // hook for listening to events emitted by the video player.
  // the returned value is an event parameter that gets updated whenever a new event is dispatched.
  const { isPlaying } = useEvent(
    videoPlayer, // the object that emits events.
    'playingChange', // name of the event to listen to; https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents
    { isPlaying: videoPlayer.playing } // initial state (an event parameter to use until the event is called for the first time).
  );

  //hook for listening to events emitted by the given object and calls the listener function whenever a new event is dispatched.
  useEventListener(
    videoPlayer, // the object that emits events.
    'statusChange', // name of the event to listen to;
    ({ status, error }) => {
      // function to call when the event is dispatched.
      if (status === 'error') {
        Alert.alert('Error', error!.message);
      }
    }
  );

  return (
    <View className='flex-col items-center px-4 mb-14'>
      <View className='flex-row items-start gap-3'>
        <View className='flex-1 flex-row justify-center items-center'>
          <View className='justify-center items-center w-[46px] h-[46px] border rounded-lg border-secondary'>
            <Image source={{ uri: photoURL }} className='w-full h-full rounded-lg' resizeMode='cover' />
          </View>

          <View className='flex-1 justify-center ml-3 gap-y-1'>
            <Text className='text-sm font-psemibold text-white' numberOfLines={1}>
              {title}
            </Text>
            <Text className='text-xs font-pregular text-gray-100' numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>

        <View className='p-2'>
          <Image source={icons.menu} className='w-5 h-5' resizeMode='contain' />
        </View>
      </View>

      {isPlaying ? (
        <View className='w-full h-60 overflow-hidden rounded-xl mt-3'>
          <VideoView
            player={videoPlayer}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={true} // determine whether native controls should be displayed or not.
            contentFit='cover' // describe how the video should be scaled to fit in the container.
            style={{
              // style the video to fill its parent
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => videoPlayer.play()}
          className='w-full h-60 rounded-xl relative justify-center items-center mt-3'>
          <Image source={{ uri: thumbnail }} className='w-full h-full rounded-xl' resizeMode='cover' />
          <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain' />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
