import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Keyboard,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";

const Navbar: React.FC = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const { setQuery } = useSearch();

  const handleSearch = () => {
    setQuery(searchQuery.trim());
    router.push("/(other)/searchresult" as any);
    Keyboard.dismiss();
  };

  const cancelSearch = () => {
    setSearchQuery("");
    setQuery("");
    setShowSearch(false);
    Keyboard.dismiss();
  };

  const handleProfileIconPress = () => {
    if (!auth?.isAuthenticated) {
      router.push("/(auth)/login");
      return;
    }

    const isAdmin = auth.user?.roles?.some(
      (r: string) => r.toLowerCase() === "admin"
    );
    if (isAdmin) {
      setShowAdminMenu(true);
    } else {
      router.push("/(auth)/profile");
    }
  };

  const handleLogout = async () => {
    setShowAdminMenu(false);
    await auth?.signout();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      {/* App Title or Search Input */}
      <View style={styles.leftContainer}>
        {showSearch ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoFocus
            />
          </View>
        ) : (
          <Text style={styles.title}>Lion's Den</Text>
        )}
      </View>

      {/* Right Icons */}
      <View style={styles.rightContainer}>
        {showSearch ? (
          <TouchableOpacity onPress={cancelSearch}>
            <Icon name="times" size={20} color="white" style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setShowSearch(true)}
              style={styles.iconButton}
            >
              <Icon name="search" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon
                name="envelope"
                size={20}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleProfileIconPress}
              style={styles.iconButton}
            >
              <Icon name="user" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Admin Dropdown Menu */}
      <Modal transparent visible={showAdminMenu} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowAdminMenu(false)}
        >
          <View style={styles.adminMenu}>
            <TouchableOpacity
              onPress={() => {
                setShowAdminMenu(false);
                router.push("/(auth)/profile");
              }}
            >
              <Text style={styles.menuItem}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowAdminMenu(false);
                router.push("/(other)/admin-dashboard" as any);
              }}
            >
              <Text style={styles.menuItem}>Admin Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.menuItem, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 40,
    width: "100%",
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    height: 36,
    backgroundColor: "#222",
    borderRadius: 18,
    paddingHorizontal: 15,
    color: "white",
    fontSize: 14,
  },
  iconButton: {
    marginLeft: 16,
  },
  icon: {
    width: 24,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
  },
  adminMenu: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 10,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "white",
    fontSize: 16,
  },
});

export default Navbar;
