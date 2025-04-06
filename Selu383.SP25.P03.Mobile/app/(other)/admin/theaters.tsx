import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { Trash2, PencilLine, Plus } from "lucide-react-native";
import { BASE_URL } from "@/constants/baseUrl"; 

type Theater = {
  id?: number;
  name: string;
  address: string;
  seatCount: number;
  managerId?: number | null;
};

const API_BASE = `${BASE_URL}/api/theaters`;

const AdminTheaters = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Theater>({
    name: "",
    address: "",
    seatCount: 0,
    managerId: null,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTheaters = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTheaters(res.data);
    } catch (err) {
      console.error("Failed to fetch theaters", err);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this theater?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE}/${id}`);
              fetchTheaters();
            } catch (err) {
              Alert.alert(
                "Error",
                "Could not delete theater. Make sure there are no halls."
              );
            }
          },
        },
      ]
    );
  };

  const handleEdit = (theater: Theater) => {
    setFormData(theater);
    setEditingId(theater.id ?? null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || formData.seatCount <= 0) {
      Alert.alert("Invalid Data", "Please fill out all required fields.");
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put(`${API_BASE}/${editingId}`, formData);
      } else {
        await axios.post(API_BASE, formData);
      }
      setShowModal(false);
      setFormData({ name: "", address: "", seatCount: 0, managerId: null });
      setEditingId(null);
      fetchTheaters();
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to submit theater. Check data and permissions."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-6 pt-10">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-3xl font-bold">Manage Theaters</Text>
          <TouchableOpacity
            className="bg-red-600 p-2 rounded-full"
            onPress={() => {
              setFormData({
                name: "",
                address: "",
                seatCount: 0,
                managerId: null,
              });
              setEditingId(null);
              setShowModal(true);
            }}
          >
            <Plus color="white" size={24} />
          </TouchableOpacity>
        </View>

        {theaters.map((theater) => (
          <View
            key={theater.id}
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4"
          >
            <Text className="text-white text-lg font-bold">{theater.name}</Text>
            <Text className="text-zinc-400">Address: {theater.address}</Text>
            <Text className="text-zinc-400">Seats: {theater.seatCount}</Text>
            <Text className="text-zinc-500">
              Manager ID: {theater.managerId ?? "N/A"}
            </Text>

            <View className="flex-row flex-wrap gap-3 mt-3">
              <TouchableOpacity
                onPress={() => handleEdit(theater)}
                className="bg-red-500 px-4 py-2 rounded-lg flex-row items-center justify-center flex-1"
              >
                <PencilLine color="white" size={18} />
                <Text className="text-white ml-2">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(theater.id!)}
                className="border border-red-600 px-4 py-2 rounded-lg flex-row items-center justify-center flex-1"
              >
                <Trash2 color="white" size={18} />
                <Text className="text-red-500 ml-2">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 justify-center bg-black/90 px-6">
          <View className="bg-zinc-800 rounded-xl p-6">
            <Text className="text-white text-xl font-bold mb-4">
              {editingId ? "Edit Theater" : "Add Theater"}
            </Text>

            <TextInput
              placeholder="Name"
              placeholderTextColor="#a1a1aa"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="bg-zinc-900 text-white p-3 rounded mb-3"
            />

            <TextInput
              placeholder="Address"
              placeholderTextColor="#a1a1aa"
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
              className="bg-zinc-900 text-white p-3 rounded mb-3"
            />

            <TextInput
              placeholder="Seat Count"
              placeholderTextColor="#a1a1aa"
              keyboardType="numeric"
              value={formData.seatCount.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, seatCount: parseInt(text) || 0 })
              }
              className="bg-zinc-900 text-white p-3 rounded mb-3"
            />

            <TextInput
              placeholder="Manager ID (optional)"
              placeholderTextColor="#a1a1aa"
              keyboardType="numeric"
              value={formData.managerId?.toString() || ""}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  managerId: text ? parseInt(text) : null,
                })
              }
              className="bg-zinc-900 text-white p-3 rounded mb-5"
            />

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="border border-zinc-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-zinc-300">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  {editingId ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminTheaters;
