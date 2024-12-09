import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  StyleSheet,
  useColorScheme,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

function App(): React.JSX.Element {
  const [data, setData] = useState([]);
  const [favorite, setFavorite] = useState<User[]>([]);
  const [tabName, setTabName] = useState('list');

  useEffect(() => {
    fetchData();
    loadFavorites();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://reqres.in/api/users?page=2');
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteList');
      if (storedFavorites) {
        setFavorite(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (favorites: User[]) => {
    try {
      await AsyncStorage.setItem('favoriteList', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = async (userData: User) => {
    const isAlreadyFavorite = favorite.some((favItem) => favItem.id === userData.id);
    const updatedFavorites = isAlreadyFavorite
      ? favorite.filter((favItem) => favItem.id !== userData.id)
      : [...favorite, userData];
    setFavorite(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  const isFavorite = (item: User) => favorite.some((favItem) => favItem.id === item.id);

  const tabSwitch = (tabName: string) => setTabName(tabName);

  const renderCard = (item: User, isFavoriteView: boolean) => (
    <View style={styles.cardBox} key={item.id}>
      <View style={styles.userCard}>
        <View style={styles.userDataBox}>
          <Text style={styles.nameText}>{`${item.first_name} ${item.last_name}`}</Text>
          <Text style={styles.emailText}>{item.email}</Text>
        </View>
        <View style={styles.userProfileBox}>
          <Image source={{ uri: item.avatar }} style={styles.profilePhoto} />
        </View>
      </View>
      <View style={styles.buttonBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.favText}>{isFavoriteView ? 'Remove' : 'Favorite'}</Text>
          <Image
            source={
              isFavorite(item)
                ? require('./assets/favorite.png')
                : require('./assets/unfavorite.png')
            }
            style={isFavorite(item) ? styles.likedIcon : styles.favIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={useColorScheme() === 'dark' ? 'light-content' : 'dark-content'}
      />
      {tabName === 'list' && (
        <FlatList
          style={styles.dataList}
          data={data}
          renderItem={({ item }) => renderCard(item, false)}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      {tabName === 'favorites' && (
        <FlatList
          style={styles.dataList}
          data={favorite}
          renderItem={({ item }) => renderCard(item, true)}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => tabSwitch('list')}
        >
          <Text style={styles.bottomTabText}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => tabSwitch('favorites')}
        >
          <Text style={styles.bottomTabText}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff"
  },
  dataList: {
    flex: 1,
    padding: 10,
    backgroundColor:"#fff"
  },
  cardBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  separator: {
    height: 10,
  },
  userDataBox: {
    flex: 1,
  },
  userProfileBox: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
  },
  emailText: {
    fontSize: 20,
  },
  buttonBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  favText: {
    fontSize: 16,
    marginRight: 10,
  },
  favIcon: {
    height: 24,
    width: 24,
  },
  likedIcon: {
    height: 24,
    width: 24,
    tintColor: 'red',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor:"#fff"
  },
  bottomTabText: {
    fontSize: 18,
    fontWeight: '700',
  },
  tabButton: {
    padding: 10,
    backgroundColor:"#fff"
  },
});

export default App;
