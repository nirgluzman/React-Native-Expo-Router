//
// Component to render a simple, reusable UI element to display a title and a subtitle.
//

import { Text, View } from 'react-native';

interface IInfoBox {
  title: string;
  subtitle: string;
  containerStyles?: string;
  titleStyles?: string;
  [key: string]: any; // index signature ("catch-all" for properties that are not explicitly defined in the interface).
}

const InfoBox = ({ title, subtitle, containerStyles, titleStyles, ...props }: IInfoBox) => {
  return (
    <View className={containerStyles} {...props}>
      <Text className={`font-psemibold text-white text-center ${titleStyles}`}>{title}</Text>
      <Text className='font-pregular text-gray-100 text-sm text-center'>{subtitle}</Text>
    </View>
  );
};

export default InfoBox;
