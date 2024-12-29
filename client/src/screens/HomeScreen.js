import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/api';
import Icon from 'react-native-vector-icons/FontAwesome'; // For the star icon

const HomeScreen = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const fetchEvents = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('/api/events', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data);
            setLoading(false);
        } catch (error) {
            alert('Failed to fetch events');
            setLoading(false);
        }
    };

    const fetchUserId = async () => {
        const userIdFromStorage = await AsyncStorage.getItem('userId');
        setUserId(userIdFromStorage);
    };

    useEffect(() => {
        fetchUserId();
        fetchEvents();

        // Set up the header options
        navigation.setOptions({
            headerLeft: null, // This removes the back arrow
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
                    <Button title="Logout" onPress={handleLogout} />
                </View>
            ),
        });
    }, []);

    const handleRSVP = async (eventId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                `/api/events/rsvp/${eventId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            alert('RSVP Successful!');
            fetchEvents();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to RSVP');
        }
    };

    const handleEditEvent = (event) => {
        navigation.navigate('CreateEvent', { event });
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`/api/events/delete/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Event deleted successfully!');
            fetchEvents();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete event');
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.clear(); // Clear all AsyncStorage data (including token and userId)
        navigation.navigate('Login'); // Navigate to the login screen after logging out
    };

    const renderItem = ({ item }) => {
        const hasRSVPd = item.attendees.some(attendee => attendee._id === userId);

        return (
            <View style={styles.eventItem}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>{new Date(item.date).toDateString()}</Text>
                <Text>Location: {item.location}</Text>
                <Text>Category: {item.category}</Text>
                <Text>Attendees:</Text>
                {item.attendees.map((attendee) => (
                    <Text key={attendee._id}>{attendee.name}</Text>
                ))}
                
                <Button title="RSVP" onPress={() => handleRSVP(item._id)} />
                <Button title="Edit" onPress={() => handleEditEvent(item)} />
                <Button title="Delete" onPress={() => handleDeleteEvent(item._id)} color="red" />

                {hasRSVPd && (
                    <Icon name="star" size={20} color="gold" style={styles.starIcon} />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading events...</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                />
            )}
            <Button title="Create Event" onPress={() => navigation.navigate('CreateEvent')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    eventItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        position: 'relative',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    starIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default HomeScreen;
