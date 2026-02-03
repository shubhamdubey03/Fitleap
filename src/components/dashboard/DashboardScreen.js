import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import SafeProgressCircle from '../SafeProgressCircle';

const DashboardScreen = ({ navigation }) => {

  return (
    <LinearGradient colors={['#1a0033', '#4b0066']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.hello}>Hello Benjamin</Text>
              <Text style={styles.title}>Let's Explore</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <Ionicons name="business-outline" size={22} color="#F5C542" />
            <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
              <Ionicons name="notifications" size={22} color="#FF6B3D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.card}>
          <View style={styles.progressCircleContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.percent}>81%</Text>
              <Text style={styles.label}>Calories</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={{ marginTop: 14 }}>
                <Ionicons name="nutrition-outline" size={26} color="#2F80ED" />
              </View>
              <View>
                <Text style={[styles.stat, { textAlign: 'center', color: '#7a7a7aff' }]}>Carbs</Text>
                <Text style={styles.stat}> 89/140g</Text>
              </View>
            </View>
            <View style={styles.statRow}>
              <View style={{ marginTop: 14 }}>
                <Ionicons name="fish-outline" size={26} color="#FF6B3D" />
              </View>
              <View>
                <Text style={[styles.stat, { textAlign: 'center', color: '#7a7a7aff' }]}>Protein</Text>
                <Text style={styles.stat}> 45/80g</Text>
              </View>
            </View>
            <View style={styles.statRow}>
              <View style={{ marginTop: 14 }}>
                <Image
                  source={require('../../assets/images/flower.png')}
                  style={styles.flowerIcon}
                />
              </View>
              <View>
                <Text style={[styles.stat, { textAlign: 'center', color: '#7a7a7aff' }]}>Fiber</Text>
                <Text style={styles.stat}> 20/50g</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Middle Cards */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.progressCircleWrapper}
            onPress={() => navigation.navigate('Exercise')}
          >
            <Text style={styles.cardTitle}>Exercise</Text>
            <SafeProgressCircle
              // percent={75}
              radius={55}
              borderWidth={8}
              color="#2ECC71"
              bgColor="#fff"
            >
              <Text style={styles.stepsNumber}>5460</Text>
              <Text style={styles.stepsLabel}>Steps</Text>
            </SafeProgressCircle>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallCard}
            onPress={() => navigation.navigate('Calories')}
          >
            <Text style={styles.cardTitle}>Calories</Text>
            <Text style={styles.kcal}>540 kcal</Text>
          </TouchableOpacity>
        </View>

        {/* Coaching */}
        {/* Coaching */}
        <TouchableOpacity
          style={styles.coachCard}
          onPress={() => navigation.navigate('Exercise', { screen: 'Coaching' })}
        >
          <Text style={styles.cardTitle}>Coaching</Text>
          <Text style={styles.coach}>Dr. Emily</Text>
        </TouchableOpacity>

        {/* Daily Intake */}
        <TouchableOpacity onPress={() => navigation.navigate('Recipes')}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.section}>Daily Intake</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={styles.intakeRow}>
          {['Carbs', 'Protein', 'Fat', 'Fiber'].map(item => {
            let iconName = 'nutrition-outline';
            if (item === 'Protein') iconName = 'fish-outline';
            if (item === 'Fat') iconName = 'flame-outline';
            if (item === 'Fiber') iconName = 'leaf-outline';
            return (
              <View key={item} style={styles.intake}>
                <Ionicons name={iconName} size={18} color="#fff" />
                <Text style={styles.intakeText}>{item}</Text>
                <Text style={styles.intakeSub}>50/65g</Text>
              </View>
            );
          })}
        </View>

        {/* Shop */}
        <TouchableOpacity onPress={() => navigation.navigate('Marketplace')}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.section}>Shop Equipment's</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e',
            }}
            style={styles.shopImage}
          />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 10
  },
  hello: {
    color: '#ccc',
    fontSize: 12
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percent: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  label: {
    fontSize: 12,
    color: '#666'
  },
  statsContainer: {
    flex: 1,
    marginLeft: 86,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stat: {
    fontSize: 14,
    marginLeft: 6,
    color: '#333',


  },
  flowerIcon: {
    width: 26,
    height: 26,
    tintColor: '#27AE60',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressCircleWrapper: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsNumber: {
    fontSize: 16,
    color: '#FF6B3D',
    fontWeight: 'bold'
  },
  stepsLabel: {
    fontSize: 12,
    color: '#FF6B3D'
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  kcal: {
    fontSize: 18,
    color: '#ff6b00',
    fontWeight: 'bold'
  },
  coachCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  coach: {
    color: '#ff6b00',
    fontWeight: 'bold'
  },
  section: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  intakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  intake: {
    backgroundColor: '#3b145f',
    padding: 12,
    borderRadius: 12,
    width: '23%',
    alignItems: 'center',
  },
  intakeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center'
  },
  intakeSub: {
    color: '#aaa',
    fontSize: 10,
    textAlign: 'center'
  },
  shopImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 30,
  },
});

export default DashboardScreen;