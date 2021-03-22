import React, {useCallback, Component } from 'react';
import {
  Alert,
  Button,
  Linking,
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import {generalInfo, sleepInfo, nutritionInfo, waterInfo} from '../assets/healthInfo'

const sampleURL = "https://google.com"
const cdc = "https://www.cdc.gov/hrqol/wellbeing.htm"
const hseSleep = "https://www.hse.ie/eng/services/news/media/pressrel/healthy-routines-start-with-sleep.html"
const hseNutrition = "https://www.hse.ie/eng/about/who/healthwellbeing/our-priority-programmes/heal/healthy-eating-guidelines/"
const hseWater = "https://www.hse.ie/eng/health/hl/water/drinkingwater/"
const hseHome = "https://www.hse.ie/"

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

class InfoScreen extends Component {
  state = {
    activeSections: [],
    collapsed: true,
    multipleSelect: false,
  };

  render() {
    return (
      <View style={styles.container}>
              <View style={styles.headerView}>
          <Ionicons
            style={styles.headerItem}
            name="ios-menu"
            size={50}
            md="md-menu"
            onPress={() => this.props.navigation.openDrawer()}
          />
        </View>
        <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
        <OpenURLButton contentContainerStyle={{ paddingTop: 30 }} url={hseHome}>HSE</OpenURLButton>
        <OpenURLButton contentContainerStyle={{ paddingTop: 30 }} url={hseNutrition}>Nutrition</OpenURLButton>
        <OpenURLButton contentContainerStyle={{ paddingTop: 30 }} url={hseWater}>Water</OpenURLButton>
        <OpenURLButton contentContainerStyle={{ paddingTop: 30 }} url={hseSleep}>Sleep</OpenURLButton>
        </ScrollView>
      </View>
    );
  }
}

export default InfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: Constants.statusBarHeight,
  },
  headerView: {
    paddingTop: StatusBar.currentHeight + 10,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerItem: {
    flex: 1,
    textAlign: "center",
  },
});