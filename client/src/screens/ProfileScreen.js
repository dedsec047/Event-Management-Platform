import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/api';

const ProfileScreen = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserDetails(response.data);
                    setName(response.data.name);
                    setEmail(response.data.email);
                } catch (error) {
                    Alert.alert('Error', 'Failed to fetch user details');
                }
            }
        };
        fetchUserDetails();
    }, []);

    const handleUpdateProfile = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const updatedDetails = { name, email };

            if (password) {
                updatedDetails.password = password; // Include password if entered
            }

            const response = await axios.put('/api/users/update', updatedDetails, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert('Success', 'Profile updated successfully!');
            setUserDetails(response.data); // Update local user details
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <View style={styles.container}>
            {userDetails ? (
                <>
                    <Text style={styles.title}>Profile</Text>
                    {!isEditing ? (
                        <>
                            <Text style={styles.detail}>Name: {userDetails.name}</Text>
                            <Text style={styles.detail}>Email: {userDetails.email}</Text>
                            <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
                        </>
                    ) : (
                        <>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter new password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm new password"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <Button title="Update Profile" onPress={handleUpdateProfile} />
                            <Button title="Cancel" onPress={() => setIsEditing(false)} />
                        </>
                    )}
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    detail: {
        fontSize: 18,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        color: '#000',
    },
});

export default ProfileScreen;
