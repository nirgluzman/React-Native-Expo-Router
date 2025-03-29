//
// Reusable and customizable button element.
// It renders a touchable button with customizable title, press handler, loading state, and styles.
//

import { Text, TouchableOpacity } from 'react-native';

interface ICustomButton {
  title: string;
  handlePress?: () => void;
  isLoading?: boolean;
  containerStyles?: string;
  textStyles?: string;
}

const CustomButton = ({ title, handlePress, isLoading, containerStyles, textStyles }: ICustomButton) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}>
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};
export default CustomButton;
