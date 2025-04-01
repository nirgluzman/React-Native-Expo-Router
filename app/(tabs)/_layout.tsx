//
// This component defines the bottom tab navigation structure for the application using Expo Router's Tabs navigator.
//

import { Image, View, Text, type ImageSourcePropType } from 'react-native';
import { Tabs } from 'expo-router';

import { colors } from '../../constants';
import { icons } from '../../constants';

interface ITabIcon {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

// render an individual tab icon with its label.
const TabIcon = ({ icon, color, name, focused }: ITabIcon) => {
  return (
    <View className='items-center justify-center gap-1'>
      <Image source={icon} resizeMode='contain' tintColor={color} className='w-5 h-5' />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          // https://reactnavigation.org/docs/bottom-tab-navigator/
          // https://stackoverflow.com/questions/63444247/react-native-top-tab-bar-navigator-indicator-width-to-match-text/75995819
          headerShown: false, // hide the header for all screens.
          tabBarShowLabel: false, // hide the tab label for all screens.
          tabBarActiveTintColor: colors.secondary.DEFAULT, // active tab color.
          tabBarInactiveTintColor: colors.gray[100], // inactive tab color.
          tabBarStyle: {
            // style object for the tab bar
            height: 84,
            backgroundColor: colors.primary,
            borderTopWidth: 1, // top border of the tab bar.
            borderTopColor: colors.black[200], // top border color of the tab bar.
          },
          tabBarIconStyle: {
            // style object for the tab icon.
            flex: 1,
            width: 'auto', // make Icon width adjust to Text width (i.e. tab width flexible).
          },
        }}>
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home', // header for the screen.
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} name='Home' focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name='bookmark'
          options={{
            title: 'Bookmark', // header for the screen.
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.bookmark} color={color} name='Bookmark' focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name='create'
          options={{
            title: 'Create', // header for the screen.
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.plus} color={color} name='Create' focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile', // header for the screen.
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.profile} color={color} name='Profile' focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};
export default TabsLayout;
