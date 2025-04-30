//
// Component to render a video player with a thumbnail preview.
// When the user taps the thumbnail, the video player is initiated and displayed.
// It handles video playback, error handling, and provides native video controls.
//

import { Alert, Image, View, TouchableOpacity, ImageSourcePropType } from 'react-native';

import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView, VideoPlayer } from 'expo-video';

import { icons } from '../constants';

interface IVideoViewer {
  thumbnail: ImageSourcePropType; // Image source (either a remote URL or a local file resource).
  videoUrl: string;
  containerStyles: string; // Tailwind CSS class names for styling the container.
}

const VideoViewer = ({ thumbnail, videoUrl, containerStyles }: IVideoViewer) => {
  // hook for managing the lifecycle of the player, and destroying it when the screen is unmounted.
  const videoPlayer = useVideoPlayer(videoUrl, (player: VideoPlayer) => {
    player.loop = false; // determines whether the player should automatically replay after reaching the end of the video.
  });

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
    <>
      {isPlaying ? (
        <View className={`overflow-hidden relative ${containerStyles}`}>
          <VideoView
            player={videoPlayer}
            allowsFullscreen={true}
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
          className={`overflow-hidden relative ${containerStyles}`}>
          {/* 'position' in React Native is similar to regular CSS, but everything is set to 'relative' by default. */}
          <Image
            source={typeof thumbnail === 'string' ? { uri: thumbnail } : thumbnail}
            className='w-full h-full'
            resizeMode='cover'
          />
          <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain' />
        </TouchableOpacity>
      )}
    </>
  );
};

export default VideoViewer;
