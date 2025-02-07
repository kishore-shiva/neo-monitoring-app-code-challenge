import React, { useEffect, useState, createContext, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  Modal
} from "react-native";
import { NearEarthObject } from "../models/NearEarthObject";
import { fetchNEOData } from "../models/NeoData";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment-timezone";

const GlobalContext = createContext({ isDarkMode: false});

export const AsteroidMonitor = () => {
  const [neoData, setNeoData] = useState<NearEarthObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(moment().tz("America/Chicago").format("YYYY-MM-DD").split("T")[0]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const hazardousImg = require("../assets/images/neo-hazardous-yes.webp");
  const notHazardousImg = require("../assets/images/hazardous-no.avif");

  // Fetch data whenever the date changes
  useEffect(() => {
    const getNEOData = async () => {
      setLoading(true);
      const data = await fetchNEOData(new Date(date));
      setNeoData(data);
      setLoading(false);
    };

    getNEOData();
  }, [date]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(moment(selectedDate).tz("America/Chicago").format("YYYY-MM-DD")); // Format to YYYY-MM-DD
    hideDatePicker();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <GlobalContext.Provider value={{ isDarkMode}}>
    <View style={[styles.safePlace, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <FlatList
        data={neoData}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={[styles.header, isDarkMode ? styles.darkText : styles.lightText]}>Asteroids for {date}</Text>
        <TouchableOpacity style={styles.footerIcon}>
          <FontAwesome name="sun-o" size={22} color={isDarkMode ? "orange" : "black"}/>
        </TouchableOpacity>
            <View style={styles.switchWrapper}>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: "black" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#767577"
              />
            </View>
          <TouchableOpacity>
            <FontAwesome name="moon-o" size={22} color={isDarkMode ? "white" : "#230046"}/>
          </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
              <Image source={item.hazardous ? hazardousImg : notHazardousImg} style={styles.image} />
            </View>
            <View style={[styles.cardContent, isDarkMode ? styles.darkBackground : styles.cardContent]}>
              <Text style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>{item.name}</Text>
              {/* Diameter */}
    <View style={styles.detailRow}>
      <Text style={[styles.key, isDarkMode ? styles.darkText : styles.lightText]}>Diameter:</Text>
      <Text style={[styles.value, isDarkMode ? styles.darkText : styles.lightText]}>
        {item.diameter.toFixed(2)} feet
      </Text>
    </View>

    {/* Velocity */}
    <View style={styles.detailRow}>
      <Text style={[styles.key, isDarkMode ? styles.darkText : styles.lightText]}>Velocity:</Text>
      <Text style={[styles.value, isDarkMode ? styles.darkText : styles.lightText]}>
        {item.velocity.toFixed(2)} mi/h
      </Text>
    </View>

    {/* Miss Distance */}
    <View style={styles.detailRow}>
      <Text style={[styles.key, isDarkMode ? styles.darkText : styles.lightText]}>Miss Distance:</Text>
      <Text style={[styles.value, isDarkMode ? styles.darkText : styles.lightText]}>
        {item.missDistance.toFixed(2)} mi
      </Text>
    </View>
              <Text style={{ color: item.hazardous ? "red" : "green" }}>
                Hazardous: {item.hazardous ? "Yes" : "No"}
              </Text>
            </View>
          </View>
        )}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date(date)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <View style={[styles.footer, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
        <Text onPress={showDatePicker} style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>Pick a Date</Text>
        <TouchableOpacity style={styles.footerIcon} onPress={showDatePicker}>
          <FontAwesome name="calendar" size={24} color={isDarkMode ? "white" : "black"}/>
        </TouchableOpacity>
      </View>
    </View>
    </GlobalContext.Provider>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontFamily: "AvenirNext-Bold",
    fontSize: 20,
    fontWeight: "bold",
  },
  safePlace: {
    padding: 20,
    paddingBottom: 55,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "AvenirNext-DemiBold"
  },
  cardContainer: {
    flexDirection: "row",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  key: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },
  value: {
    fontSize: 14,
    fontWeight: "normal",
    color: "black",
  },
  lightCard: {
    backgroundColor: "red",
  },
  darkCard: {
    backgroundColor: "white",
  },
  imageContainer: {
    width: "30%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#FAFAFC"
  },
  lightBackground: {
    backgroundColor: "white",
  },
  darkBackground: {
    backgroundColor: "black",
  },
  lightText: {
    color: "black",
  },
  darkText: {
    color: "white",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerText: {
    fontSize: 16,
    marginRight: 10,
  },
  footerIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  switchWrapper: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 25,
    padding: 0,
  },
});

export const useGlobal = () => useContext(GlobalContext);
export default AsteroidMonitor;
