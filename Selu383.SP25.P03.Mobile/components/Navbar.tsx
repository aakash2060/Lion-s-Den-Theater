import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome';

const Navbar = () => {
    return (
        <SafeAreaView>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "black",
                padding: 16
            }}>
                {/* App Title */}
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
                    Lion's Den
                </Text>

                {/* Icon Buttons */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity style={{ marginHorizontal: 10 }}>
                        <Icon name="search" size={25} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 10 }}>
                        <Icon name="envelope" size={25} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 10 }}>
                        <Icon name="user" size={25} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Navbar;
