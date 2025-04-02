//
// VideoCard Component
//
// This component displays a video metadata (including creator information, video title, thumbnail) and a video player.
//

import { useState } from 'react';

import { Alert, Image, View, Text, TouchableOpacity } from 'react-native';

import { Video, ResizeMode, AVPlaybackStatusSuccess } from 'expo-av';

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
    video: videoSource,
  },
}: IVideoCard) => {
  const [play, setPlay] = useState<boolean>(false);

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

      {play ? (
        <View className='w-full h-60 overflow-hidden rounded-xl mt-3'>
          <Video
            source={{
              uri: (videoSource =
                'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'), // VIDEO PLACE HOLDER
            }}
            style={{
              // style the video to fill its parent
              width: '100%',
              height: '100%',
            }}
            resizeMode={ResizeMode.COVER}
            useNativeControls={true}
            shouldPlay
            onError={
              // function to be called if load or playback have encountered a fatal error.
              (error) => {
                Alert.alert('Error', error);
                setPlay(false);
              }
            }
            onPlaybackStatusUpdate={
              // function to be called regularly with the AVPlaybackStatus of the video.
              (status) => {
                // https://docs.expo.dev/versions/latest/sdk/av/#avplaybackstatussuccess
                if (status.isLoaded && (status as AVPlaybackStatusSuccess).didJustFinish) {
                  setPlay(false);
                }
              }
            }
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className='w-full h-60 rounded-xl relative justify-center items-center mt-3'>
          <Image source={{ uri: thumbnail }} className='w-full h-full rounded-xl mt-3' resizeMode='cover' />
          <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain' />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
