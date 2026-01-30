import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const ReportIssueScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#1a0033', '#3b0a57', '#6a0f6b']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Report Issue</Text>

        <View style={styles.coinCircle}>
          <Ionicons name="logo-bitcoin" size={18} color="#FFD700" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Subject */}
        <TextInput
          placeholder="Subject"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
        />

        {/* Description */}
        <TextInput
          placeholder="Describe your issue..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.textArea}
          multiline
          numberOfLines={5}
        />

        {/* Attach Screenshot */}
        <Text style={styles.sectionTitle}>Attach Screenshots</Text>

        <View style={styles.uploadBox}>
          <Ionicons name="image-outline" size={32} color="#fff" />
          <Text style={styles.uploadTitle}>Add Screenshot</Text>
          <Text style={styles.uploadSub}>
            Attach screenshots to help us{'\n'}understand the issue better.
          </Text>

          <TouchableOpacity style={styles.uploadBtn}>
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default ReportIssueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  coinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    marginBottom: 14,
  },

  textArea: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    color: '#fff',
    height: 120,
    textAlignVertical: 'top',
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 14,
  },

  uploadBox: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 26,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 6,
  },
  uploadBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadBtnText: {
    color: '#4b146b',
    fontWeight: '600',
  },

  submitBtn: {
    backgroundColor: '#5b2d8b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
