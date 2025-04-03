//
// VideoCard Component
//
// This component displays a video metadata (including creator information, video title, thumbnail) and a video player.
//

import { Image, View, Text } from 'react-native';

import { type VideoWithId } from '../types/video';
import { icons } from '../constants';
import VideoViewer from './VideoViewer';

const VideoCard = ({
  videoItem: {
    creator: { username, photoURL },
    title,
    thumbnail,
    video: videoUrl,
  },
}: {
  videoItem: VideoWithId;
}) => {
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

      <VideoViewer
        thumbnail={thumbnail}
        videoUrl={videoUrl}
        containerStyles='w-full h-60 rounded-xl justify-center items-center mt-3'
      />
    </View>
  );
};

export default VideoCard;
