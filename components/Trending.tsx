import { FlatList, Text } from 'react-native';

interface ITrending {
  posts: any[];
}

const Trending = ({ posts }: ITrending) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id} // unique key for each FlatList item.
      renderItem={({ item }) => <Text className='text-3xl text-white'>{item.id}</Text>}
      horizontal={true} // render the items horizontally.
    />
  );
};

export default Trending;
