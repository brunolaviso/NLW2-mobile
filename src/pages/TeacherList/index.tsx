import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false); 

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id
                })
                setFavorites(favoritedTeachersIds);
            }
        })
    }

    useFocusEffect (() => {
        loadFavorites();
    })

    //useEffect(() => {loadFavorites()}, []);

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFiltersSubmit() {
        loadFavorites();
        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });

        setIsFiltersVisible(!isFiltersVisible);

        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                { isFiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label} >Matéria</Text>
                        <TextInput
                            placeholderTextColor="#c1bccc" 
                            style={styles.input} 
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder="Qual a matéria?"
                        />
                        <View style={styles.inputGroup} >
                            <View style={styles.inputBlock} >
                                <Text style={styles.label} >Dia da semana</Text>
                                <TextInput
                                placeholderTextColor="#c1bccc" 
                                style={styles.input} 
                                placeholder="Qual o dia?"
                                value={week_day}
                                onChangeText={text => setWeekDay(text)}
                                />
                            </View>
                            <View style={styles.inputBlock} >
                                <Text style={styles.label} >Horário</Text>
                                <TextInput
                                placeholderTextColor="#c1bccc" 
                                style={styles.input} 
                                placeholder="Qual horário?"
                                value={time}
                                onChangeText={text => setTime(text)}
                                />
                            </View>
                        </View>

                        <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>

                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id}
                            teacher={teacher} 
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;