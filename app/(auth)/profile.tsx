import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Initialize state with empty strings to avoid null issues
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // Update state when user data is available
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const onSaveUser = async () => {
    if (!user) {
      alert("User data is not loaded.");
      return;
    }

    try {
      const result = await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      console.log("🚀 ~ Profile update result:", result);
      alert("Profile updated successfully!");
    } catch (e: any) {
      console.error("🚀 ~ Error updating profile:", e);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Show loading indicator while user data is loading
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c47ff" />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  // Handle case where user is not signed in
  if (!isSignedIn || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>You are not signed in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Good morning {user.firstName} {user.lastName}!
      </Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.inputField}
      />
      <Button onPress={onSaveUser} title="Update Account" color={"#6c47ff"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6c47ff",
  },
  message: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
  greeting: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
    color: "#333",
  },
  inputField: {
    marginVertical: 8,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default Profile;
